/*
 * Custom Ushahidi Backbone.sync tweaks
 */

/* Create basic auth token */
function make_base_auth(user, password) {
	var tok = user + ':' + password;
	var hash = btoa(tok);
	return "Basic " + hash;
}

// Make sure we've got the right backbone sync.
Backbone.sync = Offline.sync;
