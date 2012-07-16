/*
 * View objects
 */

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
}

/*
 * Report
 */
var ReportView = Backbone.View.extend(
{
	initialize : function(args) {
		_.bindAll(this, "update", "remove");
		this.model.bind('change', this.update);
		this.model.bind('remove', this.remove)
	},
	render : function() {
		var context = _.extend(this.model.toJSON(),
		{
			cid : this.model.cid,
			id : this.model.id,
			categories : this.model.categories()
		});
		this.$el.html(this.template(context));
		return this;
	},
	remove : function() {
		this.$el.remove();
	},
	update : function(report) {
		this.render();
	},
	onClose : function() {
		this.model.unbind('change', this.update);
		this.model.unbind('remove', this.remove);
	}
});
var ReportLIView = ReportView.extend(
{
	tagName : 'tr',
	template : _.template($("#report-li-template").html())
});
var ReportPageView = ReportView.extend(
{
	template : _.template($("#report-page-template").html()),
	
	/*render : function() {
		var context = _.extend(this.model.toJSON(),
		{
			cid : this.model.cid,
			id : this.model.id,
			categories : this.model.categories()
		});
		this.$el.html(this.template(context));
		this.model.getMap();
		return this;
	},*/
});
var ReportEditView = ReportView.extend(
{
	template : _.template($("#report-form-template").html()),
	initialize : function() {
		_.bindAll(this, "save");
	},
	events : {
		'submit form' : 'save'
	},
	render : function() {
		var context = _.extend(this.model.toJSON(),
		{
			cid : this.model.cid,
			id : this.model.id,
			incident_date : this.model.incident_date(),
			categories : this.model.categories()
		});
		this.$el.html(this.template(context));
		return this;
	},
	save : function() {
		console.log('saving');
		var title = this.$('.field-incident-title').val();

		this.model.set('incident_title', title);
		window.app.navigate('reports/view/'+this.model.id, {trigger: true});
		return false;
	}
});

var SettingsEditView = Backbone.View.extend(
{
	template : _.template($("#settings-edit-template").html()),
	initialize : function() {
		_.bindAll(this, "save");
	},
	events : {
		'submit form' : 'save'
	},
	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	save : function() {
		var username = this.$('.field-username').val();
		var password = this.$('.field-password').val();
		this.model.set('username', username);
		if (password != '') this.model.set('password', password);
		this.model.save();

		window.app.navigate('reports',{trigger: true});
		return false;
	}
});

var MessageLIView = Backbone.View.extend(
{
	
	tagName : 'tr',
	template : _.template($("#message-li-template").html()),
	initialize : function(args) {
		_.bindAll(this, "update", "remove");
		this.model.bind('change', this.update);
		this.model.bind('remove', this.remove)
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
		this.$el.remove();
	},
	update : function(report) {
		this.render();
	},
	onClose : function() {
		this.model.unbind('change', this.update);
		this.model.unbind('remove', this.remove);
	}
});

/*
 *  Report list view
 */
var ReportAppView = Backbone.View.extend(
{
	template : _.template($("#app-template").html()),
	initialize : function() {
		_.bindAll(this, "addReport", "addAll");
		this.model.reports.bind('add', this.addReport);
		this.model.reports.bind('reset', this.addAll);
	},
	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.reportList = this.$('#reportList');
		if (this.model.reports.length > 0)
		{
			this.addAll();
		}
		
		return this;
	},
	addReport : function(report) {
		var view = new ReportLIView(
		{
			model : report,
			id : 'report-' + report.cid
		});
		this.$('#loading').hide();
		this.reportList.append(view.render().el);
		report.view = view;
	},
	addAll : function() {
		this.reportList.empty();
		this.model.reports.each(this.addReport);
	},
	onClose : function() {
		this.model.reports.unbind('add', this.addReport);
		this.model.reports.unbind('reset', this.addAll);
		// Destroy report views
		this.model.reports.each(function(model) { model.view.close() });
	}
});

/*
 *  Message list view
 */
var MessageAppView = Backbone.View.extend(
{
	template : _.template($("#message-app-template").html()),
	initialize : function() {
		_.bindAll(this, "addMessage", "addAll");
		this.model.messages.bind('add', this.addMessage);
		this.model.messages.bind('reset', this.addAll);
	},
	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.messageList = this.$('#messageList');
		if (this.model.messages.length > 0)
		{
			this.addAll();
		}
		
		return this;
	},
	addMessage : function(message) {
		var view = new MessageLIView(
		{
			model : message,
			id : 'message-' + message.cid
		});
		this.$('#loading').hide();
		this.messageList.append(view.render().el);
		message.view = view;
	},
	addAll : function() {
		this.messageList.empty();
		this.model.messages.each(this.addMessage);
	},
	onClose : function() {
		this.model.messages.unbind('add', this.addMessage);
		this.model.messages.unbind('reset', this.addAll);
		// Destroy report views
		this.model.messages.each(function(model) { model.view.close() });
	}
});
