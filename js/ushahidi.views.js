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
 * Helper for saving links
 */
var addHttp = function ()
{
	if (this.indexOf('http://') == -1 && this.indexOf('https://') == -1)
	{
		return 'http://'+this;
	}
	return this;
}
String.prototype.addHttp = addHttp;

jQuery.validator.addMethod('moment', function(value, element) {
	return this.optional(element) || moment(value).isValid();
}, 'Please enter a valid date.');


jQuery.validator.addMethod('moment-datetime', function(value, element) {
	var datetime = $(".field-incident-date").val() +'T'+ $(".field-incident-time").val();
	return this.optional(element) || moment(datetime).isValid();
}, 'Please enter a valid date.');

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
	render : function() {
		var context = _.extend(this.model.toJSON(),
		{
			cid : this.model.cid,
			id : this.model.id,
		});
		this.$el.html(this.template(context));
		//this.model.getMap();
		
		// Set values for custom fields
		// Slight hack since we're using field generated from customforms helper
		var el = this.$el
		_.each(this.model.get('custom_field'), function(data, key) {
			$('.custom_field_'+key+' .answer', el).text(_.escape(data));
		});
		
		return this;
	}
});
var ReportEditView = ReportView.extend(
{
	template : _.template($("#report-form-template").html()),
	initialize : function() {
		_.bindAll(this, "save");
		
		// Hack to re-render if category tree not loaded
		if (window.app.model.categoryTree.get('categories').length == 0)
		{
			window.app.model.categoryTree.sync = Offline.syncWithAuth;
			window.app.model.categoryTree.fetch({success : function(model, response) { model.sync = Backbone.LocalStorage.sync; model.save(); this.render(); } });
		}
	},
	events : {
		'click .add-news' : 'addNews',
		'click .add-video' : 'addVideo'
	},
	render : function() {
		var context = _.extend(this.model.toJSON(),
		{
			cid : this.model.cid,
			id : this.model.id,
			category_ids : this.model.category_ids(),
			categories : this.model.categories(),
			category_tree : window.app.model.categoryTree.get('categories'),
		});
		this.$el.html(this.template(context));
		
		// Set up category tree
		$("#category-tree", this.$el).treeview({
			persist: "location",
			collapsed: true,
			unique: false
		});
		
		// Add form validation
		$('form', this.$el).validate({
			submitHandler : this.save,
			rules : {
				incident_title :  { required:true, rangelength: [3,200]},
				incident_date : 'required moment-datetime',
				incident_time : 'required moment-datetime',
				incident_description : 'required',
				'incident_person[person_email]' : { email:true, rangelength: [3,100]},
				'incident_person[person_first]' : { rangelength: [2,100]},
				'incident_person[person_last]' : { rangelength: [2,100]},
				'category[]' : { required: true, minlength: 1, number:true },
				'news_media_link_new[]' : 'url',
				'video_media_link_new[]' : 'url',
				'location[location_name]' : { required:true, rangelength: [3,200]},
				'location[latitude]' : { required:true, number:true, range: [-90,90]},
				'location[longitude]' : { required:true, number:true, range: [-180,180]},
				'incident_active' : { range: [0,1]},
				'incident_verified' : { range: [0,1]}
			},
			groups: {
				date: "incident_date incident_time"
			},
			debug : true
		});
		
		// Set values for custom fields
		// Slight hack since we're using field generated from customforms helper
		var el = this.$el
		_.each(this.model.get('custom_field'), function(data, key) {
			$('[name="custom_field['+key+']"]', el).val(data);
		});
		
		return this;
	},
	addNews : function() {
		this.$('.add-news').before("<input type='text' name='news[].media_link' class='field-media_link text long' value='' />");
		return false;
	},
	addVideo : function() {
		this.$('.add-video').before("<input type='text' name='video[].media_link' class='field-media_link text long' value='' />");
		return false;
	},
	save : function(form) {
		rawdata = $('form', this.$el).toJSON();
		data = _.clone(rawdata);
		
		// Use extend to only overwrite the field present in the form and keep others
		data.location = _.extend(this.model.get('location'), rawdata.location);
		data.custom_field = _.extend(this.model.get('custom_field'), rawdata.custom_field);
		data.incident_person = _.extend(this.model.get('incident_person'), rawdata.incident_person);
		
		if (data.incident_verified == undefined)
			data.incident_verified = 0;
		if (data.incident_active == undefined)
			data.incident_active = 0;
		
		cat_ids = this.model.category_ids();
		data.category = this.model.get('category');
		// Ugly hacks to keep current category objects and add fake ones
		// @todo add full category objects or never store them to start with
		_.each(data.category, function(cat, key) {
			// Remove unchecked categories
			if (_.indexOf(rawdata.category, cat.id.toString()) == -1) // conversion to string since form values are strings
			{
				delete data.category[key];
			}
		});
		_.each(rawdata.category, function (cat, key) {
			// Skip existing categories to keep full object
			if (_.indexOf(cat_ids, parseInt(cat, 10)) == -1) // conversion to int since cat_ids array contains ints
			{
				data.category.push({
					id : cat,
					category_title : 'Category '+cat
				});
			}
		});
		
		// Remove fake media fields
		delete data.news_media_link;
		delete data.video_media_link;
		delete data.news_media_link_new;
		delete data.video_media_link_new;
		// Keep photos regardless
		data.media = this.model.get('media').filter( function(item) { return item.media_type == 1; } );
		// Process existing media
		_.each(this.model.get('media'), function(item, key) {
			if (rawdata.news_media_link[item.id] != undefined && rawdata.news_media_link[item.id] != "") {
				item.media_link = rawdata.news_media_link[item.id].addHttp();
				data.media.push(item);
			}
			else if (rawdata.video_media_link[item.id] != undefined && rawdata.video_media_link[item.id] != "") {
				item.media_link = rawdata.video_media_link[item.id].addHttp();
				data.media.push(item);
			}
		});
		// Add new media
		_.each(rawdata.news_media_link_new, function(value, key) {
			if (value != "") {
				data.media.push({ media_link: value.addHttp(), media_type : 4 });
			}
		});
		_.each(rawdata.video_media_link_new, function(value, key) {
			if (value != "") {
				data.media.push({ media_link: value.addHttp(), media_type : 2 });
			}
		});
		
		// Format date
		data.incident_date = moment(rawdata.incident_date+'T'+rawdata.incident_time).format();
		delete data.incident_time;
		
		this.model.set(data);
		
		if (this.model.id == null)
		{
			window.app.model.reports.add(this.model);
			if (this.model.get('message_id') != undefined)
			{
				var success = function(model, response) {
					var message = window.app.model.messages.getBySid(this.model.get('message_id'));
					incident_id = (model.get('sid') != undefined) ? model.get('sid') : model.get('id')
					message.set('incident_id', incident_id);
					message.save();
				}
			}
		}
		
		this.model.save({success: success});
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
	render : function() {
		this.$el.html(this.template());
		
		$('form', this.$el).validate({
			submitHandler : this.save,
			rules : {
				username : 'required',
				password : 'required'
			}
		});
		
		return this;
	},
	save : function() {
		var username = this.$('.field-username').val();
		var password = this.$('.field-password').val();
		
		options = {}
		options.url = window.baseURL+'api/rest?admin=1';

		options.beforeSend = function(xhr, jqsettings) {
			xhr.setRequestHeader('Authorization', make_base_auth(username, password));
		}
		options.success = function() {
			window.app.model.authenticated = true;
			window.app.navigate('reports', {trigger: true});
		};
		options.error = function() {
			window.app.model.authenticated = false;
			console.log('auth failed')
			//window.app.navigate('settings/edit', {trigger: true});
		};
		
		jQuery.ajax(options);

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
			cid : this.model.cid,
			id : this.model.id,
			report : this.model.getReport()
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
		_.bindAll(this, "addReport", "addAll", 'massApprove', 'massDisapprove', 'massVerify', 'massDelete', 'checkAll');
		this.model.bind('add', this.addReport);
		this.model.bind('reset', this.addAll);
		this.filter = options.filter;
	},
	events : {
		'click .mass-approve' : 'massApprove',
		'click .mass-disapprove' : 'massDisapprove',
		'click .mass-verify' : 'massVerify',
		'click .mass-delete' : 'massDelete',
		'change #checkallincidents' : 'checkAll'
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
	},
	massApprove : function() {
		rawdata = $('form', this.$el).toJSON();
		if (rawdata.incident_id == undefined) return false;
		
		var answer = confirm('Are you sure you want to approve '+rawdata.incident_id.length+' reports?');
		if (answer) {
			_.each(rawdata.incident_id, function (id) {
				this.model.get(id).set('incident_active', 1).save();
			}, this);
		}
		return false;
	},
	massDisapprove : function() {
		rawdata = $('form', this.$el).toJSON();
		if (rawdata.incident_id == undefined) return false;
		
			
		var answer = confirm('Are you sure you want to dis-approve '+rawdata.incident_id.length+' reports?');
		if (answer) {
			_.each(rawdata.incident_id, function (id) {
				this.model.get(id).set('incident_active', 0).save();
			}, this);
		}
		return false;
	},
	massVerify : function() {
		rawdata = $('form', this.$el).toJSON();
		if (rawdata.incident_id == undefined) return false;
		
		var answer = confirm('Are you sure you want to verify '+rawdata.incident_id.length+' reports?');
		if (answer) {
			_.each(rawdata.incident_id, function (id) {
				this.model.get(id).toggleVerified();
			}, this);
		}
		return false;
		
	},
	massDelete : function() {
		rawdata = $('form', this.$el).toJSON();
		if (rawdata.incident_id == undefined) return false;
		
			
		var answer = confirm('Are you sure you want to delete '+rawdata.incident_id.length+' reports?');
		if (answer) {
			_.each(rawdata.incident_id, function (id) {
				this.model.get(id).destroy({wait: true});
			}, this);
		}
		return false;
	},
	checkAll : function() {
		$('form input.mass-select', this.$el).prop('checked', $('form input#checkallincidents', this.$el).prop('checked'));
	}
});

/*
 *  Message list view
 */
var MessageAppView = Backbone.View.extend(
{
	template : _.template($("#message-app-template").html()),
	initialize : function(options) {
		_.bindAll(this, "addMessage", "addAll", 'massDelete', 'checkAll');
		this.model.bind('add', this.addMessage);
		this.model.bind('reset', this.addAll);
		this.filter = options.filter;
	},
	events : {
		'click .mass-delete' : 'massDelete',
		'change #checkall' : 'checkAll'
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
	},
	massDelete : function() {
		rawdata = $('form', this.$el).toJSON();
		if (rawdata.message_id == undefined) return false;
		
			
		var answer = confirm('Are you sure you want to delete '+rawdata.message_id.length+' messages?');
		if (answer) {
			_.each(rawdata.message_id, function (id) {
				this.model.get(id).destroy({wait: true});
			}, this);
		}
		return false;
	},
	checkAll : function() {
		$('form input.mass-select', this.$el).prop('checked', $('form input#checkall', this.$el).prop('checked'));
	}
});
