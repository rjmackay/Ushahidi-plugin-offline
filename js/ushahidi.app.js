/**
 *  Routing and app code
 **/
$(function() {
	var AppModel = Backbone.Model.extend(
	{
		initialize : function() {
			_.bindAll(this, "poll");
			
			
			// Settings
			this.settings = new Settings();
			this.settings.fetch();
			// @todo: Add check for admin / member later
			
			// Reports setup
			this.reports = new ReportCollection();
			this.reports.settings = this.settings;
			//this.reports.fetch();
			
			// Messages
			this.messages = new MessagesCollection();
			this.messages.settings = this.settings;
			//this.messages.fetch();
		},
		delay : 6000,
		poll : function() {
			if (this.settings.get('username') != '') {
				this.reports.storage.sync.incremental();
				this.messages.storage.sync.incremental();
			}
			// @todo move reset delay to after fetch finishes
			this.startPolling();
		},
		startPolling : function(delay) {
			delay = typeof delay !== 'undefined' ? delay : this.delay;
			clearTimeout(this.pollTimeout);
			this.pollTimeout = _.delay(this.poll, delay);
		},
		stopPolling : function() {
			clearTimeout(this.pollTimeout);
		},
		// @todo make this global
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
		},
		setTab : function(tab) {
			$('.nav-holder .active').removeClass('active');
			$('.nav-holder .'+tab).addClass('active');
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
			
			//_.bindAll(this, "reconnect");
			//$('.reconnect').click(this.reconnect);
		},
		routes :
		{
			"" : "home",
			"reports" : "reports",
			"reports/view/:number" : "report_view",
			// @todo: handle actions with events
			"reports/edit/:number" : "report_edit",
			"settings/edit" : "settings_edit",
			"messages/:type" : "messages",
			"messages" : "messages"
		},
		home : function() {
			if (this.model.settings.get('username') != '')
			{
				this.navigate('reports',{trigger: true});
			}
			else
			{
				this.navigate('settings/edit',{trigger: true});
			}
		},
		reports : function() {
			this.model.startPolling(50);
			
			if (this.model.settings.get('username') == '')
			{
				this.navigate('settings/edit',{trigger: true});
				return;
			}
			
			var reportAppView = new ReportAppView(
			{
				model : this.model
			});
			this.appView.showView(reportAppView);
			this.appView.setTab('reports');
		},
		report_view : function(id) {
			this.model.stopPolling();
			
			var model = this.model.reports.get(id);
			var reportPageView = new ReportPageView({
				model : model
			});
			this.appView.showView(reportPageView);
		},
		report_edit : function(cid) {
			this.model.stopPolling();
			
			var model = this.model.reports.getByCid(cid);
			var reportEditView = new ReportEditView({
				model : model
			});
			this.appView.showView(reportEditView);
		},
		settings_edit : function() {
			this.model.stopPolling();
			
			var settingsEditView = new SettingsEditView({
				model : this.model.settings
			});
			this.appView.showView(settingsEditView);
			this.appView.setTab('settings');
		},
		messages : function(type) {
			type = (typeof type == 'undefined') ? 'twitter' : type;
			this.model.startPolling(50);
			
			if (this.model.settings.get('username') == '')
			{
				this.navigate('settings/edit',{trigger: true});
				return;
			}
			
			var messageAppView = new MessageAppView(
			{
				model : this.model
			});
			this.appView.showView(messageAppView);
			this.appView.setTab('messages');
		}
	});

	var UshahidiApp = new AppRouter(
	{
		container : $('#content .bg')
	});
	window.app = UshahidiApp;
	Backbone.history.start();
	
});
