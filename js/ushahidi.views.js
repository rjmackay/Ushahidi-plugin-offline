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
			categories : this.model.categories(),
		});
		this.$el.html(this.template(context));
		//this.model.getMap();
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
			categories : this.model.categories()
		});
		this.$el.html(this.template(context));
		return this;
	},
	save : function() {
		console.log('saving');
		data = {};
		_.each(this.$('form').serializeArray(), function (item) { data[item.name] = item.value; } );
		
		data.location = this.model.get('location')
		data.location.location_name = data['location.location_name'],
		data.location.latitude = data['location.latitude'];
		data.location.longitude = data['location.longitude'];
		
		delete data['location.location_name'];
		delete data['location.latitude'];
		delete data['location.longitude'];
		
		if (data.incident_verified == undefined)
			data.incident_verified = 0;
		if (data.incident_active == undefined)
			data.incident_active = 0;
		
		this.model.set(data);
		
		if (this.model.id == null)
			window.app.model.reports.add(this.model);
		
		this.model.save();
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
	initialize : function(options) {
		_.bindAll(this, "addReport", "addAll");
		this.model.bind('add', this.addReport);
		this.model.bind('reset', this.addAll);
		this.filter = options.filter;
	},
	render : function() {
		this.$el.html(this.template({
			filter : this.filter
		}));
		this.reportList = this.$('#reportList');
		if (this.model.length > 0)
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
		this.model.each(this.addReport);
	},
	onClose : function() {
		this.model.unbind('add', this.addReport);
		this.model.unbind('reset', this.addAll);
		// Destroy report views
		this.model.each(function(model) { model.view.close() });
	}
});

/*
 *  Message list view
 */
var MessageAppView = Backbone.View.extend(
{
	template : _.template($("#message-app-template").html()),
	initialize : function(options) {
		_.bindAll(this, "addMessage", "addAll");
		this.model.bind('add', this.addMessage);
		this.model.bind('reset', this.addAll);
		this.filter = options.filter;
	},
	render : function() {
		this.$el.html(this.template({
			filter : this.filter
		}));
		this.messageList = this.$('#messageList');
		if (this.model.length > 0)
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
		this.model.each(this.addMessage);
	},
	onClose : function() {
		this.model.unbind('add', this.addMessage);
		this.model.unbind('reset', this.addAll);
		// Destroy report views
		this.model.each(function(model) { model.view.close() });
	}
});
