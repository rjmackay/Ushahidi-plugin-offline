/**
 * Models and collections
 */
var Settings = Backbone.Model.extend({
	localStorage : new Backbone.LocalStorage("UshahidiSettings"),
	sync : Backbone.LocalStorage.sync,
});

var Message = Backbone.Model.extend({
});

var Report = Backbone.Model.extend(
{
	initialize : function () {
		_.bindAll(this, 'saveMap','getMap','displayMap');
		// If offline report get the map
		//if (this.collection.sync ==  Backbone.LocalStorage.sync) this.getMap();
	},
	parse : function(response) {
		// Check if we're dealing with an API response or localstorage
		if (response.incident == undefined)
		{
			return response;
		}
		
		// Parse json data into the format the API expects posted back
		data =
		{
		}
		
		data.id = response.incident.incidentid;
		//data.incident_id = response.incident.incidentid;
		data.incident_title = response.incident.incidenttitle;
		data.incident_description = response.incident.incidentdescription;
		data.incident_datetime = response.incident.incidentdate;
		data.incident_mode = response.incident.incidentmode;
		data.incident_active = response.incident.incidentactive;
		data.incident_verified = response.incident.incidentverified;
		data.location_id = response.incident.locationid;
		data.location_name = response.incident.locationname;
		data.location_latitude = response.incident.locationlatitude;
		data.location_longitude = response.incident.locationlongitude;
		data.incident_category = response.categories;
		
		return data;
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
	url : '/api',
	parse : function(response) {
		if(response.payload != undefined)
			return response.payload.incidents;
	},
	sync : Backbone.reportSync.sync
});

var OfflineReportCollection = ReportCollection.extend(
{
	localStorage : new Backbone.LocalStorage("ReportCollection"),
	sync : Backbone.LocalStorage.sync
});

var MessagesCollection = Backbone.Collection.extend(
{
	model : Message,
	localStorage : new Backbone.LocalStorage("MessagesCollection")
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
