/**
 *  Routing and app code
 **/
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
		this.reports.fetch({local : true});
		
		// Messages
		this.messages = new MessagesCollection();
		this.messages.settings = this.settings;
		this.messages.fetch({local : true});
		
		// Category Tree
		this.categoryTree = new CategoryTree();
		this.categoryTree.settings = this.settings;
		this.categoryTree.fetch();
	},
	delay : 6000,
	poll : function() {
		if (this.settings.get('username') != '') {
			// Bind via reset callback to make sure localstorage loads first
			this.reports.resetCallback.add(function () { this.reports.storage.sync.incremental({data : {limit : 300}}) }, this);
			this.messages.resetCallback.add(function () { this.messages.storage.sync.incremental({data : {limit : 300}}) }, this);
		
			// Hack to populate categoryTree
			this.categoryTree.sync = Offline.syncWithAuth;
			this.categoryTree.fetch({success : function(model, response) { model.sync = Backbone.LocalStorage.sync; model.save() } });
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
		"reports/:filter" : "reports",
		"reports/view/:number" : "report_view",
		"reports/edit/:number" : "report_edit",
		"reports/add" : "report_add",
		"reports/approve/:number" : "report_approve",
		"reports/verify/:number" : "report_verify",
		"reports/delete/:number" : "report_delete",
		"settings/edit" : "settings_edit",
		"messages/:type" : "messages",
		"messages" : "messages",
		"messages/:filter" : "messages"
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
	reports : function(filter) {
		this.model.startPolling(50);
		
		if (this.model.settings.get('username') == '')
		{
			this.navigate('settings/edit',{trigger: true});
			return;
		}
		
		var reports;
		if (filter == 'a')
			reports = new ReportCollection(this.model.reports.where({'incident_active' : 0}));
		else if (filter == 'v')
			reports = new ReportCollection(this.model.reports.where({'incident_verified' : 0}));
		else if (filter == 'o')
			reports = new ReportCollection(this.model.reports.where({'category' : []}));
		else
			reports = this.model.reports;
		
		this.model.reports.resetCallback.add(function () {
			var reportAppView = new ReportAppView(
			{
				model : reports,
				filter: filter
			});
			this.appView.showView(reportAppView);
			this.appView.setTab('reports');
		}, this);
	},
	report_view : function(id) {
		this.model.stopPolling();
		
		this.model.reports.resetCallback.add(function() {
			var model = this.model.reports.get(id);
			var reportPageView = new ReportPageView({
				model : model
			});
			this.appView.showView(reportPageView);
		}, this);
	},
	report_edit : function(id) {
		this.model.stopPolling();
		
		this.model.reports.resetCallback.add(function() {
			var model = this.model.reports.get(id);
			var reportEditView = new ReportEditView({
				model : model
			});
			this.appView.showView(reportEditView);
		}, this);
	},
	report_add : function(id) {
		this.model.reports.resetCallback.add(function() {
			var model = new Report();
			var reportEditView = new ReportEditView({
				model : model
			});
			this.appView.showView(reportEditView);
		}, this);
	},
	report_approve : function(id) {
		this.model.reports.resetCallback.add(function() {
			var model = this.model.reports.get(id);
			model.toggleActive();
			this.navigate('reports',{trigger: true});
		}, this);
	},
	report_verify : function(id) {
		this.model.reports.resetCallback.add(function() {
			var model = this.model.reports.get(id);
			model.toggleVerified();
			this.navigate('reports',{trigger: true});
		}, this);
	},
	report_delete : function(id) {
		this.model.reports.resetCallback.add(function() {
			var model = this.model.reports.get(id);
			
			var answer = confirm('Are you sure you want to delete?');
			if (answer) {
				model.destroy({wait: true});
			}
			this.navigate('reports',{trigger: true});
		}, this);
	},
	settings_edit : function() {
		this.model.stopPolling();
		
		var settingsEditView = new SettingsEditView({
			model : this.model.settings
		});
		this.appView.showView(settingsEditView);
		this.appView.setTab('settings');
	},
	messages : function(filter) {
		this.model.startPolling(50);
		
		if (this.model.settings.get('username') == '')
		{
			this.navigate('settings/edit',{trigger: true});
			return;
		}
		
		var messages;
		if (filter == 'twitter')
			messages = new MessagesCollection(this.model.messages.where({'message_service' : 'Twitter'}));
		else if (filter == 'sms')
			messages = new MessagesCollection(this.model.messages.where({'message_service' : 'SMS'}));
		else if (filter == 'email')
			messages = new MessagesCollection(this.model.messages.where({'message_service' : 'Email'}));
		else
			messages = this.model.messages;
		
		this.model.messages.resetCallback.add(function() {
			var messageAppView = new MessageAppView(
			{
				model : messages,
				filter: filter
			});
			this.appView.showView(messageAppView);
			this.appView.setTab('messages');
		}, this);
	}
});


$(function() {
	var UshahidiApp = new AppRouter(
	{
		container : $('#content .bg')
	});
	window.app = UshahidiApp;
	// @todo only trigger start after initial model load?
	Backbone.history.start();
	
});
