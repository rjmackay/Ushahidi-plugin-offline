var api_url = "/api";
// fix for your server

var interviews_db =
{
};
(function(context)
{

	context.initDB = function()
	{
		// load persistent store after the DOM has loaded
		
		interviews_db.Interviews = window.realStorage.getItem('interviews');
		if (interviews_db.Interviews == null)
		{
			interviews_db.Interviews = {};
			window.realStorage.setItem('interviews', interviews_db.Interviews);
		}
		
		/*context.Interview = 
		{
			title : "",
			posted : ""
		};*/

	};

	context.initUI = function()
	{
		// reset DB
		$('#reset').click(function()
		{
			context.resetDB();
			$('.status').html('Reset complete');
			$.mobile.changePage("#index");
			return false;
		});
		// sync DB
		$('#sync').click(function()
		{
			$('.status').html('Starting sync');
			context.uploadDB();
			return false;
		});
	};

	context.resetDB = function()
	{
		window.realStorage.clear();
		console.log("DB reset");
	};

	context.uploadDB = function()
	{
		//        persistence.dumpToJson(
		//            null,
		//            [interviews_db.Interview, interviews_db.Answer],
		//            function(dump) {
		//                console.log(dump);
		//            });

		$(interviews_db.Interviews).each(context.postInterview);
		$.mobile.changePage("#empty", "none");

	};

	context.dataURItoBlob = function(dataURI)
	{
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs
		var byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for(var i = 0; i < byteString.length; i++)
		{
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
		var bb = new BlobBuilder();
		bb.append(ab);
		return bb.getBlob(mimeString);
	}

	context.postInterview = function(interview)
	{
		if(interview.posted == false)
		{
			$('.status').ajaxError(context.uploadedFailed);
			// Check for the various File API support.
			if(window.File && window.FileReader && window.FileList && window.Blob)
			{
				// Great success! All the File APIs are supported.
				var formData = new FormData();
				formData.append('task', 'report');
				for(idx in interview)
				{
					
					if(idx == 'incident_photo')
					{
						var photo_data = interview.incident_photo;
						if(photo_data != null)
						{
							//blob
							blob = context.dataURItoBlob(photo_data);
							formData.append("incident_photo[]", blob);
						}
					}
					else
					{
						formData.append(idx, interview[idx].toString());
					}
				}

				// add personal informations from the settings
				var settings_data = interviews_conf.getPersonalInfo()
				if(settings_data.person_first != undefined)
				{
					formData.append('person_first', settings_data.person_first);
				}
				if(settings_data.person_last != undefined)
				{
					formData.append('person_last', settings_data.person_last);
				}
				if(settings_data.person_email != undefined)
				{
					formData.append('person_email', settings_data.person_email);
				}

				$.ajax(
				{
					url : api_url,
					data : formData,
					cache : false,
					contentType : false,
					processData : false,
					type : 'POST',
					success : function(data, textStatus, jqXHRres)
					{
						context.uploadedInterview(data, textStatus, jqXHRres);
						interview.posted = true;
					}
				});

			}
			else
			{
				var data =
				{
					'task' : 'report'
				};

				for(var idx in interview)
				{
					value = interview[idx].value
					if(value != undefined)
					{
						data[idx] = interview[idx].toString();
					}
				}

				// add personal informations from the settings
				var settings_data = interviews_conf.getPersonalInfo();
				if(settings_data.person_first != undefined)
				{
					data.person_first = settings_data.person_first;
				}
				if(settings_data.person_last != undefined)
				{
					data.person_last = settings_data.person_last;
				}
				if(settings_data.person_email != undefined)
				{
					data.person_email = settings_data.person_email;
				}

				$.post(api_url, data, function(data, textStatus, jqXHRres)
				{
					context.uploadedInterview(data, textStatus, jqXHRres);
					interview.posted = true;
				}, 'json');
			}
		};
	};

	context.uploadedFailed = function(event, jqXHR, ajaxSettings, thrownError)
	{
		$(this).html('Sync failed: ' + jqXHR.statusText);
	};

	context.uploadedInterview = function(data, textStatus, jqXHRres)
	{
		// note: this should be raised only after all interviews are uploaded...
		if(jqXHRres.success())
		{
			if(data["error"] != undefined)
			{
				data = data["error"];
			}
			if(data["code"] == "0")
			{
				$('.status').html('Sync done');
			}
			else
			{
				$('.status').html('Sync failed: ' + data["message"]);
			}

		}
		else
			$('.status').html('Sync failed: ' + jqXHRres.statusText);
	};
})(interviews_db);

// interviews configurations
var interviews_conf =
{
};
(function(context)
{

	context.init = function()
	{
		if(!localStorage.categories)
			localStorage.categories = JSON.stringify(
			{
			});

		if(!localStorage.personal_info)
			localStorage.personal_info = JSON.stringify(
			{
			});

		$.ajax(api_url + "?task=categories", settings =
		{
			dataType : 'json',
			success : function(ajaxArgs)
			{
				localStorage.categories = context.parseCategories(ajaxArgs);
				interviews_app.updateFormCategories(JSON.parse(localStorage.categories))
			}
		});
	};

	context.parseCategories = function(ajaxArgs)
	{
		var categories = ajaxArgs.payload.categories
		return JSON.stringify(categories)
	};

	context.savePersonalInfo = function(info)
	{
		localStorage.personal_info = JSON.stringify(info);
	};

	context.getPersonalInfo = function()
	{
		return JSON.parse(localStorage.personal_info);
	};
})(interviews_conf);

//
$(document).ready(function()
{
	interviews_conf.init();
	interviews_db.initDB();
	interviews_db.initUI();
})