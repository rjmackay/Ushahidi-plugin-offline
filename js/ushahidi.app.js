/**
 *  Routing and app code
 **/
$(function() {
	var AppModel = Backbone.Model.extend(
	{
		initialize : function() {
			_.bindAll(this, "resetOffline", "poll", "fetchError");
			
			// Settings
			this.settings = new Settings();
			this.settings.fetch();
			// @todo: Add check for admin / member later
			
			// Reports setup
			//this.reports = new OfflineReportCollection();
			//this.reports.fetch();
			
			this.onlinereports = new OnlineReportCollection();
			this.onlinereports.settings = this.settings;
			//this.onlinereports.bind('reset', this.resetOffline);
			this.reports = this.onlinereports;
			
			// Messages
			this.messages = new MessagesCollection();
			this.messages.settings = this.settings;
			this.messages.fetch();
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
		delay : 6000,
		poll : function() {
			if (this.settings.get('username') != '') {
				options = {
					username : this.settings.get('username'),
					password : this.settings.get('password'),
					error: this.fetchError,
					timeout: this.delay*0.75
				};
				
				this.reports.fetch(options);
				this.messages.fetch(options);
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
		fetchError : function(jqXHR, textStatus, errorThrown) {
			if (textStatus.statusText == 'timeout')
			{
				this.stopPolling();
				$('#offline').show();
			}
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
			
			_.bindAll(this, "reconnect");
			$('.reconnect').click(this.reconnect);
		},
		routes :
		{
			"" : "home",
			"reports" : "reports",
			"reports/view/:number" : "report_view",
			// @todo: handle actions with events
			"reports/delete/:number" : "report_remove",
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
		report_remove : function(cid) {
			this.model.stopPolling();
			
			//app.model.reports.getByCid(cid).destroy();
			this.navigate();
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
		},
		reconnect : function() {
			this.model.startPolling(50);
			$('#offline').hide();
			return false;
		},
	});

	var UshahidiApp = new AppRouter(
	{
		container : $('#content .bg')
	});
	window.app = UshahidiApp;
	Backbone.history.start();
	
});
