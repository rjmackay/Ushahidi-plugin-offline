/*
* Custom Ushahidi Backbone.sync
*/

// Reset sync to use ajaxSync, not localStorage
//Backbone.sync = Backbone.ajaxSync;

/**
 * OnlineOffline sync 
 **/
Backbone.OnlineOffline = function(onlinesync, offlinesync) {
  this.offlinesync = offlinesync;
  this.onlinesync = onlinesync;
};

_.extend(Backbone.OnlineOffline.prototype, {
	sync: function (method, model, options, error) {
		Backbone.ajaxSync.apply(this, arguments);
		return Backbone.LocalStorage.sync.apply(this, arguments);
	}
});



