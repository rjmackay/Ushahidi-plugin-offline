/**
 *  Routing and app code
 **/
$(function() {
	var AppModel = Backbone.Model.extend(
	{
		initialize : function() {
			_.bindAll(this, "resetOffline", "poll");
			// Settings
			this.settings = new Settings();
			this.settings.fetch();
			// Bootstrap with admin credentials
			if (this.settings.get('username') == undefined || this.settings.get('username') == false) {
				this.settings.set({
					'username' : 'admin',
					'password' : 'opto2313'
				});
				this.settings.save();
			}
			// @todo: Add check for admin / member later
			
			// Reports setup
			this.reports = new OfflineReportCollection();
			this.reports.fetch();
			
			this.onlinereports = new OnlineReportCollection();
			this.onlinereports.settings = this.settings;
			this.onlinereports.bind('reset', this.resetOffline);
			this.onlinereports.fetch();
			
			// Messages
			//this.messages = new MessagesCollection();
			
			// @todo dynamic change delay and start/stop
			_.delay(this.poll, this.delay);
		},
		resetOffline : function() {
			this.onlinereports.each(function(model) {
				offlinemodel = this.reports.get(model.id);
				if (offlinemodel == undefined) {
					this.reports.create(model);
				} else {
					// @todo make sure we're clearing blank fields
					offlinemodel.set(model.toJSON());
				}
			}, this);
			this.reports.each(function(model) {
				model.save();
			});
		},
		poll : function() {
			this.onlinereports.fetch();
			_.delay(this.poll, this.delay, this);
		},
		delay : 4000
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
			"reports/remove/:number" : "report_remove"
		},
		home : function() {
			this.navigate('reports',{trigger: true});
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
