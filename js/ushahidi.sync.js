/*
 * Custom Ushahidi Backbone.sync
 */

// Tweak this:
// Local storage only when offline
// Both when online, but REST datasource wins
/*Backbone.sync = function Sync() {
 Backbone.ajaxSync.apply(this, arguments);
 return Backbone.LocalStorage.sync.apply(this, arguments);
 };*/
Backbone.sync = Backbone.ajaxSync;
// We also probably want a settings model, but don't want to sync that.

Backbone.reportSync =
{
	sync : function(method, model, options) {
		//console.log(method, model, options);

		// Default options, unless specified.
		options || ( options =
		{
		});

		// Default JSON-request options.
		var params =
		{
			type : 'POST',
			dataType : 'json'
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
						task : 'incidents',
						by : 'incidentid',
						id : model.id
					};
					return $.ajax(_.extend(params, options));
				}
				else
				{
					params.data =
					{
						task : 'incidents',
						by : 'all',
						limit : '10'
					};
					console.log(params);
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