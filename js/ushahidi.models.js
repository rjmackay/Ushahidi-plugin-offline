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
		data.location_latitude = response.incident.locationlongitude;
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