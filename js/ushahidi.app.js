/**
 *  Routing and app code
 **/
var AppModel = Backbone.Model.extend(
{
	initialize : function(params) {
		_.bindAll(this, "poll", 'dirty', 'checkDirty');
		
		this.authenticated = false;
		
		// Reports setup
		this.reports = new ReportCollection();
		this.reports.fetch({local : true});
		
		// Messages
		this.messages = new MessagesCollection();
		this.messages.fetch({local : true});
		
		// Category Tree
		this.categoryTree = new CategoryTree();
		this.categoryTree.set({categories: params.categoryTree})
		this.categoryTree.fetch();
		
		var context = this;
		$('#dirty .sync').click(_.debounce(function() {
			context.startPolling(0);
			return false;
		}, 1000, true));
		this.checkDirty();
	},
	delay : 10000,
	poll : function() {
		var context = this
		
		jQuery.getJSON(window.baseURL+'api/rest?admin=1').success( function(xhr) {
			// If we weren't authenticated already:
			// Set authenticated flag and poll server again
			if (!context.authenticated) 
			{
				context.authenticated = true;
				context.startPolling(0);
			}
		}).error( function(xhr) {
			// If auth fails, redirect (ignoring other error codes, in case we're just offline)
			if (xhr.status == 401)
			{
				context.authenticated = false;
				window.app.navigate('settings/edit', {trigger: true});
			}
		});
		
		if (this.authenticated) {
			// Bind via reset callback to make sure localstorage loads first
			this.reports.resetCallback.add(function () { this.reports.storage.sync.incremental({data : {limit : 200, admin : 1}}) }, this);
			this.messages.resetCallback.add(function () { this.messages.storage.sync.incremental({data : {limit : 200, admin : 1}}) }, this);
		
			// Hack to populate categoryTree
			this.categoryTree.sync = Backbone.ajaxSync;
			this.categoryTree.fetch({data : {admin : 1}, success : function(model, response) { model.sync = Backbone.LocalStorage.sync; model.save() } });
		}
		// @todo move reset delay to after fetch finishes
		this.startPolling();
	},
	startPolling : function(delay) {
		// Only reset polling if we're not polling already OR delay is passed
		if (this.pollTimeout == null || typeof delay !== 'undefined')
		{
			// Trigger poll immediately if we're not polling already
			if (this.pollTimeout == null && typeof delay === 'undefined') delay = 0;
			delay = typeof delay !== 'undefined' ? delay : this.delay;
			// Clear existing timeout
			this.stopPolling();
			this.pollTimeout = _.delay(this.poll, delay);
		}
	},
	stopPolling : function() {
		clearTimeout(this.pollTimeout);
		this.pollTimeout = null;
	},
	dirty : function() {
		var dirtyCount = this.reports.storage.sync.collection.dirty().length;
		dirtyCount += this.messages.storage.sync.collection.dirty().length;
		if (dirtyCount == 0) return false;
		return dirtyCount;
	},
	checkDirty : function() {
		count = this.dirty();
		if (count)
		{
			$('#dirty').show();
			$('#dirty span').text(count);
		}
		else
		{
			$('#dirty').hide();
		}
		_.delay(this.checkDirty, 500);
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
		this.model = new AppModel({
			categoryTree: params.categoryTree
		});
		this.model.startPolling(5);
	},
	routes :
	{
		"" : "home",
		"reports" : "reports",
		"reports/add" : "report_add",
		"reports/view/:id" : "report_view",
		"reports/edit/:id" : "report_edit",
		"reports/approve/:id" : "report_approve",
		"reports/verify/:id" : "report_verify",
		"reports/delete/:id" : "report_delete",
		"reports/:filter" : "reports",
		"settings/edit" : "settings_edit",
		"messages" : "messages",
		"messages/:filter" : "messages",
		"messages/delete/:id" : "message_delete",
		"reports/add/from_message/:id" : "message_to_report"
	},
	home : function() {
		//if (this.model.settings.get('username') != '')
		//{
			this.navigate('reports',{trigger: true});
		//}
		//else
		//{
		//	this.navigate('settings/edit',{trigger: true});
		//}
	},
	reports : function(filter) {
		this.model.startPolling();
		
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
			if (model == undefined)
			{
				this.navigate('reports',{trigger: true});
			}
			
			var reportPageView = new ReportPageView({
				model : model
			});
			this.appView.showView(reportPageView);
			this.appView.setTab('reports');
		}, this);
	},
	report_edit : function(id) {
		this.model.stopPolling();
		
		this.model.reports.resetCallback.add(function() {
			var model = this.model.reports.get(id);
			if (model == undefined)
			{
				this.navigate('reports',{trigger: true});
			}
			
			var reportEditView = new ReportEditView({
				model : model
			});
			this.appView.showView(reportEditView);
			this.appView.setTab('reports');
		}, this);
	},
	report_add : function() {
		this.model.stopPolling();
		
		this.model.reports.resetCallback.add(function() {
			var model = new Report();
			var reportEditView = new ReportEditView({
				model : model
			});
			this.appView.showView(reportEditView);
			this.appView.setTab('reports');
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
		
		var settingsEditView = new SettingsEditView();
		this.appView.showView(settingsEditView);
		this.appView.setTab('settings');
	},
	messages : function(filter) {
		this.model.startPolling();
		
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
	},
	message_delete : function(id) {
		this.model.messages.resetCallback.add(function() {
			var model = this.model.messages.get(id);
			
			var answer = confirm('Are you sure you want to delete?');
			if (answer) {
				model.destroy({wait: true});
			}
			this.navigate('messages',{trigger: true});
		}, this);
	},
	message_to_report : function(id) {
		this.model.messages.resetCallback.add(function() {
			this.model.reports.resetCallback.add(function() {
				var message = this.model.messages.get(id);
				if (message == undefined ||
					message.get('incident_id') != 0)
				{
					this.navigate('messages',{trigger: true});
				}
				
				var model = new Report({
					'message_id' : message.get('sid'),
					'incident_title' : message.get('message'),
					'incident_description' : (message.get('message_detail') != null) ? message.get('message_detail') : message.get('message'),
					'incident_date' : message.get('message_date'),
				});
				
				// person
				if (message.get('reporter') != undefined)
				{
					reporter = message.get('reporter');
					person = model.get('incident_person');
					person.person_first = reporter.reporter_first;
					person.person_last = reporter.reporter_last;
					person = model.set('incident_person', person);
				}
				
				// location
				if (message.get('latitude') != undefined && message.get('longitude') != undefined)
				{
					location = model.get('location');
					location.latitude = message.get('latitude');
					location.longitude = message.get('longitude');
					location.location_name = (message.get('location_name') != undefined) ? message.get('location_name') : '';
					location = model.set('location', location);
				}
				
				var reportEditView = new ReportEditView({
					model : model
				});
				this.appView.showView(reportEditView);
				this.appView.setTab('reports');
			}, this);
		}, this);
	}
});
