/**
 * Models and collections
 */
var Report = Backbone.Model.extend(
{
	initialize : function(args) {
		//console.log(this);
	},
	validate : function(attrs) {
		/*if(attrs.title)
		{
			if(!_.isString(attrs.title) || attrs.title.length === 0)
			{
				return 'Title must be a string with a length';
			}
		}*/
	},
	parse : function(response) {
		//console.log(response);
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
		var date = new Date(this.attributes.incident_datetime);

		return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
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
	localStorage : new Backbone.LocalStorage("ReportCollection"), // Unique name within your app.
	model : Report,
	url : '/api',
	parse : function(response) {
		if(response.payload != undefined)
			return response.payload.incidents;
	},
	sync : Backbone.reportSync.sync
});
