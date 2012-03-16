
// Tweak this:
// Local storage only when offline
// Both when online, but REST datasource wins
/*Backbone.sync = function Sync() {
    Backbone.ajaxSync.apply(this, arguments);
    return Backbone.localSync.apply(this, arguments);
};*/
// We also probably want a settings model, but don't want to sync that.

var Report = Backbone.Model.extend(
{
	validate : function(attrs) {
		if(attrs.title)
		{
			if(!_.isString(attrs.title) || attrs.title.length === 0)
			{
				return 'Title must be a string with a length';
			}
		}
	}
});

var ReportCollection = Backbone.Collection.extend(
{
	localStorage: new Backbone.LocalStorage("ReportCollection"), // Unique name within your app.
	model : Report
});

var ReportView = Backbone.View.extend(
{
	template : _.template($("#report-template").html()),
	initialize : function(args) {
		_.bindAll(this, 'changeTitle');
		this.model.bind('change:title', this.changeTitle);
	},
	events :
	{
		'click .title' : 'handleTitleClick'
	},

	render : function() {
		var context = _.extend(this.model.toJSON(), {cid: this.model.cid});
		this.$el.html(this.template(context));
		return this;
	},
	changeTitle : function() {
		this.$('.title').text(this.model.get('title'));
	},
	handleTitleClick : function() {
		alert('you clicked the title: ' + this.model.get('title'));
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
	}
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
	},
	routes :
	{
		"reports/add" : "add",
		"reports/remove/:number" : "remove",
	},

	add : function() {
		app.model.reports.add(new Report(
		{
			title : 'The Matrix ' + Math.floor(Math.random() * 11),
			format : 'dvd',
		}));
		this.navigate();
		// reset location so we can trigger again
	},
	remove : function(cid) {
		app.model.reports.remove(app.model.reports.getByCid(cid));
	},
});

$(function() {
	var reportApp = new ReportAppController(
	{
		append_at : $('body')
	});
	window.app = reportApp;
	Backbone.history.start();
});