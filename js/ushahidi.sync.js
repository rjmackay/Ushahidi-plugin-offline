/*
* Custom Ushahidi Backbone.sync
*/

// Reset sync to use ajaxSync, not localStorage
//Backbone.sync = Backbone.ajaxSync;

/**
 * OnlineOffline sync 
 **/
Backbone.OnlineOffline = function(onlinesync, offlinesync) {
  this.offlinesync = offlinesync;
  this.onlinesync = onlinesync;
};

_.extend(Backbone.OnlineOffline.prototype, {
	sync: function (method, model, options, error) {
		Backbone.ajaxSync.apply(this, arguments);
		return Backbone.LocalStorage.sync.apply(this, arguments);
	}
});

/**
 * Custom Report Sync logic
 */
Backbone.reportSync =
{
	sync : function(method, model, options) {
		//console.log(method, model, options);

		// Default options, unless specified.
		options || ( options =
		{
		});

		var settings = model.settings || model.collection.settings;

		// Default JSON-request options.
		var params =
		{
			type : 'POST',
			dataType : 'json',
			username : settings.get('username'),
			password : settings.get('password')
		};

		// Ensure that we have a URL.
		if(!options.url)
		{
			params.url = model.url || urlError();
		}

		switch (method)
		{
			case "read":
				params.type = 'GET';
				if(model.id != undefined)
				{
					params.data =
					{
						task : 'reports',
						by : 'incidentid',
						id : model.id
					};
					return $.ajax(_.extend(params, options));
				}
				else
				{
					params.data =
					{
						task : 'reports',
						by : 'all',
						limit : '300'
					};
					return $.ajax(_.extend(params, options));
				}
				break;
			/*case "create":
			 resp = Backbone.reportSync.create(model, params, options);
			 break;
			 case "update":
			 data.incident_category = [];
			 for (c in response.categories)
			 {
			 data.incident_category.push(response.categories[c].title);
			 }
			 data.incident_category = data.incident_category.join(',');
			 resp = Backbone.reportSync.update(model, params, options);
			 break;
			 case "delete":
			 resp = Backbone.reportSync.destroy(model, params, options);
			 break;*/
		}

		if(resp)
		{
			options.success(resp);
		}
		else
		{
			options.error("Record not found");
		}
		return resp;
	}
}