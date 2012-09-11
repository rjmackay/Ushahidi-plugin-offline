// Custom enhancements to Backbone Collections
_.extend(Backbone.Collection.prototype, {
	// Add method for getting models by server id
	getBySid : function (sid)
	{
		if (sid == null) return void 0;
		return this.find(function(item) {
			return item.get('sid') === sid;
		});
	},
	// Add reset callback to ALL collections
	initialize : function (models, options)
	{
		// Add callback for initial reset
		dfd = $.Deferred();
		this.resetCallback = dfd.promise();
		this.on('reset', dfd.resolve);
	}
});

/**
 * Date comparator helper
 * Creates a comparator function based on field / order passed
 * 
 * Example:
 *   MyCollection = Backbone.Collection.extend({
 *     comparator: new date_comparator('record_date', 'asc'),
 *   });
 * 
 * @param String field - date field name to sort by
 * @param String order - Sort order asc/desc
 * @return function( - comparator function
 **/
var date_comparator = function (field, order)
{
	// Defaults
	if (field == undefined) field = 'id';
	if (order == undefined) order = 'desc';
	
	order_multiplier = (order == 'asc') ? 1 : -1;
	
	return function (model)
	{
		if (model.get(field) == null) return new moment().unix();
			return order_multiplier * new moment(model.get(field)).unix();
	}
}

// Quick hack for storing category tree
var CategoryTree = Backbone.Model.extend({
	localStorage : new Backbone.LocalStorage("CategoryTree"),
	sync : Backbone.LocalStorage.sync,
	defaults : {
		categories : {},
		id: 1
	},
	url : '/api/rest/categories/tree',
	initialize : function ()
	{
		// Always ID 1
		this.set({id: 1});
	},
	parse : function (data)
	{
		if (this.sync == Backbone.ajaxSync)
		{
			attr = {};
			attr.categories = data;
			return attr;
		}
		else
		{
			return data;
		}
	},
	// Update categoryTree from remote
	// Switches sync to ajaxSync, syncs then restore localstorage.sync
	fetchRemote : function(options)
	{
		this.sync = Backbone.ajaxSync;
		var success = options.success;
		options.success = function(model, resp) {
			model.sync = Backbone.LocalStorage.sync;
			model.save();
			if (success) success(model, resp);
		};
		return this.fetch(options);
	}
});

var Message = Backbone.Model.extend({
	urlRoot : '/api/rest/messages',
	getReport : function ()
	{
		if (this.get('incident_id') == 0) return;
		if (typeof this.get('incident_id') == 'string') return window.app.model.reports.get(this.get('incident_id'));
		
		return window.app.model.reports.getBySid(this.get('incident_id'));
	}
});
var MessagesCollection = Backbone.Collection.extend(
{
	model : Message,
	url : '/api/rest/messages',
	initialize : function (models, options)
	{
		this.constructor.__super__.initialize.apply(this, arguments);
		this.storage = new Offline.Storage('MessagesCollection', this, {autoPush: true});
	},
	comparator : new date_comparator('message_date', 'desc')
});

var Report = Backbone.Model.extend(
{
	baseUrl : 'api/rest/incidents',
	defaults : {
		'incident_title' : '',
		'incident_description' : '',
		'incident_date' : moment().format(),
		'incident_dateadd' : moment().format(),
		'incident_verified' : 0,
		'incident_active' : 0,
		'sid' : null,
		'id' : null,
		'location' : {
			'location_name' : '',
			'latitude' : 0,
			'longitude' : 0,
			'country_id' : null,
		},
		'category' : [],
		'incident_person' : {
			'person_first' : '',
			'person_last' : '',
			'person_phone' : '',
			'person_email' : ''
		},
		'media' : [],
		'user' : {},
		'custom_field' : []
	},
	initialize : function () {
		_.bindAll(this, 'saveMap','getMap','displayMap');
		// If offline report get the map
		//if (this.collection.sync ==  Backbone.LocalStorage.sync) this.getMap();
	},
	categories : function() {
		categories = [];
		_.each(this.get('category'), function(cat) {
			if (cat.id == null) return;
			categories.push(cat.category_title);
		});
		return categories.join(', ');
	},
	category_ids : function() {
		ids = [];
		_.each(this.get('category'), function(cat) {
			if (cat.id == null) return;
			ids[cat.id] = parseInt(cat.id, 10);
		});
		return ids;
	},
	// Map image handling;
	getMap : function() {
		if (this.get('location_latitude') != undefined && this.get('location_longitude') != undefined)
		{
			if (this.get('map') == undefined)
			{
				getImageFile('/gmaps/staticmap?markers='+this.get('location_latitude')+','+this.get('location_longitude')+'&zoom=15&maptype=road&sensor=false&size=500x500', this.saveMap);
			}
			else 
			{
				this.displayMap();
			}
		}
	},
	saveMap : function(file) {
		this.set('map',file);
		this.save();
		this.displayMap();
	},
	displayMap : function()
	{
		imgEl = $('#report-'+this.cid+'-img');
		
		if(imgEl != undefined)
		{
			imgEl.attr('src',this.get('map'));
		}
	},
	// Actions
	toggleVerified : function()
	{
		if (this.get('incident_verified') == 1)
		{
			this.set('incident_verified', 0);
		}
		else
		{
			this.set('incident_verified', 1);
		}
		this.save();
	},
	toggleActive : function()
	{
		if (this.get('incident_active') == 1)
		{
			this.set('incident_active', 0);
		}
		else
		{
			this.set('incident_active', 1);
		}
		this.save();
	}
});

var ReportCollection = Backbone.Collection.extend(
{
	model : Report,
	url : '/api/rest/incidents',
	initialize : function (models, options)
	{
		this.constructor.__super__.initialize.apply(this, arguments);
		this.storage = new Offline.Storage('ReportCollection', this, {autoPush: true});
	},
	comparator : new date_comparator('incident_date', 'desc')
});

// Getting a file through XMLHttpRequest as an arraybuffer and creating a Blob
function getImageFile(url, callback)
{
	// Create XHR, BlobBuilder and FileReader objects
	var xhr = new XMLHttpRequest(), fileReader = new FileReader();

	xhr.open("GET", url, true);
	// Set the responseType to arraybuffer. "blob" is an option too, rendering BlobBuilder unnecessary, but the support for "blob" is not widespread enough yet
	xhr.responseType = "blob";

	xhr.addEventListener("load", function () {
		if (xhr.status === 200) {
			// onload needed since Google Chrome doesn't support addEventListener for FileReader
			fileReader.onload = function (evt) {
				// Read out file contents as a Data URL
				var result = evt.target.result;
				// Store Data URL in localStorage
				callback(result);
			};
			// Load blob as Data URL
			fileReader.readAsDataURL(xhr.response);
		}
	}, false);
	// Send XHR
	xhr.send();
}
