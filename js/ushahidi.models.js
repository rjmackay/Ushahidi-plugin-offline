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
	urlRoot : '/api/rest/messages',
});
var MessagesCollection = Backbone.Collection.extend(
{
	model : Message,
	//localStorage : new Backbone.LocalStorage("MessagesCollection"),
	url : '/api/rest/messages',
});

var Report = Backbone.Model.extend(
{
	baseUrl : 'api/rest/incidents',
	initialize : function () {
		_.bindAll(this, 'saveMap','getMap','displayMap');
		// If offline report get the map
		//if (this.collection.sync ==  Backbone.LocalStorage.sync) this.getMap();
	},
	incident_date : function() {
		var date = new moment(this.attributes.incident_datetime);
		return date.format('YYYY/MM/DD');
	},
	categories : function() {
		incident_category = [];
		for(c in this.attributes.incident_category)
		{
			incident_category.push(this.attributes.incident_category[c].category.title);
		}
		return incident_category.join(',');
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
	}
});

var ReportCollection = Backbone.Collection.extend(
{
	model : Report,
	localStorage : new Backbone.LocalStorage("ReportCollection")
});

var OnlineReportCollection = ReportCollection.extend(
{
	url : '/api/rest/incidents',
	sync : Backbone.ajaxSync
});

var OfflineReportCollection = ReportCollection.extend(
{
	localStorage : new Backbone.LocalStorage("ReportCollection"),
	sync : Backbone.LocalStorage.sync
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
