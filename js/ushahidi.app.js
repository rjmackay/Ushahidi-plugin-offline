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
				if (model.id != undefined)
				{
					params.data = {
						task : 'incidents',
						by : 'incidentid',
						id : model.id
					};
					return $.ajax(_.extend(params, options));
				}
				else
				{
					params.data = {
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

$(function() {

	var Report = Backbone.Model.extend(
	{
		initialize :function(args){
			//console.log(this);
		},
		validate : function(attrs) {
			if(attrs.title)
			{
				if(!_.isString(attrs.title) || attrs.title.length === 0)
				{
					return 'Title must be a string with a length';
				}
			}
		},
		parse : function(response) {
			//console.log(response);
			// Parse json data into the format the API expects posted back
			data = {}
			data.id = response.incident.incidentid;
			//data.incident_id = response.incident.incidentid;
			data.incident_title = response.incident.incidenttitle;
			data.incident_description = response.incident.incident_description;
			data.incident_date = response.incident.incidentdate;
			data.incident_mode = response.incident.incidentmode;
			data.incident_active = response.incident.incident_active;
			data.incident_verified = response.incident.incidentverified;
			data.location_id = response.incident.locationid;
			data.location_name = response.incident.locationname;
			data.location_latitude = response.incident.locationlongitude;
			data.location_longitude = response.incident.locationlongitude;
			data.incident_category = response.categories;
			return data;
		}
	});

	var ReportCollection = Backbone.Collection.extend(
	{
		localStorage : new Backbone.LocalStorage("ReportCollection"), // Unique name within your app.
		model : Report,
		url : '/api',
		parse : function(response) {
			if (response.payload != undefined)
				return response.payload.incidents;
		},
		sync : Backbone.reportSync.sync
	});

	var ReportView = Backbone.View.extend(
	{
		template : _.template($("#report-template").html()),
		initialize : function(args) {
		},
		render : function() {
			var context = _.extend(this.model.toJSON(),
			{
				cid : this.model.cid
			});
			this.$el.html(this.template(context));
			return this;
		},
		remove : function() {
			$(this.el).remove();
		}
	});

	var ReportAppModel = Backbone.Model.extend(
	{
		initialize : function() {
			this.reports = new ReportCollection();
		}
	});

	var ReportAppView = Backbone.View.extend(
	{
		template : _.template($("#app-template").html()),
		initialize : function() {
			_.bindAll(this, "addReport", "removeReport");
			this.model.reports.bind('add', this.addReport);
			this.model.reports.bind('remove', this.removeReport);
			this.model.reports.bind('reset', this.addAll, this);
		},
		render : function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.reportList = this.$('#reportList');
			return this;
		},
		addReport : function(report) {
			var view = new ReportView(
			{
				model : report
			});
			this.reportList.append(view.render().el);
		},
		removeReport : function(report) {
			this.$('#report_' + report.cid).remove();
		},
		addAll : function() {
			this.model.reports.each(this.addReport);
		},
	});

	var ReportAppController = Backbone.Router.extend(
	{
		initialize : function(params) {
			this.model = new ReportAppModel();
			this.view = new ReportAppView(
			{
				model : this.model
			});
			params.append_at.append(this.view.render().el);
			this.model.reports.fetch();
		},
		routes :
		{
			"reports/add" : "add",
			"reports/remove/:number" : "remove",
		},

		add : function() {
			/*data =
			{
				title : 'The Matrix ' + Math.floor(Math.random() * 11),
				format : 'dvd',
			};
			app.model.reports.create(data);*/
			this.navigate();
			// reset location so we can trigger again
		},
		remove : function(cid) {
			//app.model.reports.getByCid(cid).destroy();
			this.navigate();
		},
	});

	var reportApp = new ReportAppController(
	{
		append_at : $('#content .bg')
	});
	window.app = reportApp;
	Backbone.history.start();
});

