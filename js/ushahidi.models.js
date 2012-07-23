// Callbacks
// ---------

// Marionette style callbacks
// A simple way of managing a collection of callbacks
// and executing them at a later point in time, using jQuery's
// `Deferred` object.
Backbone.Callbacks = function(){
  this.deferred = $.Deferred();
  this.promise = this.deferred.promise();
};

_.extend(Backbone.Callbacks.prototype, {

  // Add a callback to be executed. Callbacks added here are
  // guaranteed to execute, even if they are added after the 
  // `run` method is called.
  add: function(callback, contextOverride){
    this.promise.done(function(context, options){
      if (contextOverride){ context = contextOverride; }
      callback.call(context, options);
    });
  },

  // Run all registered callbacks with the context specified. 
  // Additional callbacks can be added after this has been run 
  // and they will still be executed.
  run: function(options, context){
    this.deferred.resolve(context, options);
  }
});

/**
 * Models and collections
 */
var Settings = Backbone.Model.extend({
	localStorage : new Backbone.LocalStorage("UshahidiSettings"),
	sync : Backbone.LocalStorage.sync,
	defaults : {
		username : '',
		password : '',
		id: 1
	},
	initialize : function () {
		// Always ID 1
		this.set({id: 1});
		// Avoid any undefined values
		if (!this.get("username")) {
			this.set({"username": this.defaults.username});
		}
		if (!this.get("password")) {
			this.set({"password": this.defaults.password});
		}
	}
});

var Message = Backbone.Model.extend({
	urlRoot : '/api/rest/messages'
});
var MessagesCollection = Backbone.Collection.extend(
{
	model : Message,
	url : '/api/rest/messages',
	initialize : function (models, options)
	{
		this.storage = new Offline.Storage('MessagesCollection', this, {autoPush: true});
		
		// Add callback for initial reset
		this.resetCallback = new Backbone.Callbacks();
		this.on('reset', this.resetCallback.run, this.resetCallback);
	},
	comparator : function(report) {
		return - new moment(report.get('message_date')).unix();
	}
});

var Report = Backbone.Model.extend(
{
	baseUrl : 'api/rest/incidents',
	defaults : {
		'incident_title' : '',
		'incident_description' : '',
		'incident_date' : '',
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
		'incident_persion' : {
			'person_first' : '',
			'person_last' : '',
			'person_phone' : '',
			'person_email' : ''
		},
		'media' : [],
		'user' : {},
	},
	initialize : function () {
		_.bindAll(this, 'saveMap','getMap','displayMap');
		// If offline report get the map
		//if (this.collection.sync ==  Backbone.LocalStorage.sync) this.getMap();
	},
	incident_date : function() {
		var date = new moment(this.get('incident_date'));
		return date.format('YYYY/MM/DD');
	},
	categories : function() {
		categories = [];
		_.each(this.get('category'), function(cat) {
			categories.push(cat.category_title);
		});
		return categories.join(', ');
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
		this.storage = new Offline.Storage('ReportCollection', this, {autoPush: true});
		
		// Add callback for initial reset
		this.resetCallback = new Backbone.Callbacks();
		this.on('reset', this.resetCallback.run, this.resetCallback);
	},
	comparator : function(report) {
		return - new moment(report.get('incident_date')).unix();
	}
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
