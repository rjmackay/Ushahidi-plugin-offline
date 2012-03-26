/**
 *  Routing and app code
 **/
$(function() {
	var AppModel = Backbone.Model.extend(
	{
		initialize : function() {
			this.onlinereports = new OnlineReportCollection();
			this.reports = new OfflineReportCollection();
			
			this.onlinereports.bind('reset', function(){
				this.reports.reset(this.onlinereports.models);
				this.reports.each(function(model){model.save();});
			}
			, this);
			this.onlinereports.fetch();
			this.reports.fetch();
			// Messages
			// Settings
		}
	});

	/*
	 * AppView object
	 * Manages rendering and closing of AppViews to avoid zombies
	 * @url http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
	 */
	var AppView = Backbone.View.extend(
	{
		initialize : function(params) {
			this.container = params.container;
		},
		showView : function(view) {
			if(this.currentView)
			{
				this.currentView.close();
			}

			this.currentView = view;
			this.currentView.render();

			this.container.html(this.currentView.el);
		}
	});

	/*
	 * AppRouter
	 */
	var AppRouter = Backbone.Router.extend(
	{
		initialize : function(params) {
			this.appView = new AppView(
			{
				container : params.container
			});
			this.model = new AppModel();
		},
		routes :
		{
			"" : "home",
			"reports" : "reports",
			"reports/view/:number" : "report_view",
			// @todo: handle actions with events
			"reports/add" : "report_add",
			"reports/remove/:number" : "report_remove"
		},
		home : function() {
			this.navigate('reports')
		},
		reports : function() {
			var reportAppView = new ReportAppView(
			{
				model : this.model
			});
			this.appView.showView(reportAppView);
		},
		report_view : function(cid) {
			var model = this.model.reports.getByCid(cid);
			var reportPageView = new ReportPageView({
				model : model
			});
			this.appView.showView(reportPageView);
		},
		report_add : function() {
			/*data =
			 {
			 title : 'The Matrix ' + Math.floor(Math.random() * 11),
			 format : 'dvd',
			 };
			 app.model.reports.create(data);*/
			this.navigate();
			// reset location so we can trigger again
		},
		report_remove : function(cid) {
			//app.model.reports.getByCid(cid).destroy();
			this.navigate();
		},
	});

	var UshahidiApp = new AppRouter(
	{
		container : $('#content .bg')
	});
	window.app = UshahidiApp;
	Backbone.history.start();
});
