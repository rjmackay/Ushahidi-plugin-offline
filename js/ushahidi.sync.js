/*
 * Custom Ushahidi Backbone.sync tweaks
 */

/* Create basic auth token */
function make_base_auth(user, password) {
	var tok = user + ':' + password;
	var hash = btoa(tok);
	return "Basic " + hash;
}

/*
 * Quick sync wrapper to add authentication.
 */
Offline.syncWithAuth = function(method, model, options, error) {
	var settings = model.settings || (model.collection ? model.collection.settings : window.app.model.settings);

	// Add username / password
	if (!options.username)
	{
		options.beforeSend = function(xhr, jqsettings) {
			xhr.setRequestHeader('Authorization', make_base_auth(settings.get('username'), settings.get('password')));
		}
	}

	Backbone.ajaxSync.apply(this, [method, model, options, error]);
};

// Override offline sync to use syncwithAuth
Offline.sync = function(method, model, options) {
	var store, _ref;
	store = model.storage || (( _ref = model.collection) != null ? _ref.storage :
	void 0);
	if (store && (store != null ? store.support :
	void 0))
	{
		return Offline.localSync(method, model, options, store);
	}
	else
	{
		return Offline.syncWithAuth(method, model, options);
	}
};

// Tweak the Backbone.offline ajax sync
Offline.Sync.prototype.ajax = function(method, model, options) {
	if (Offline.onLine())
	{
		this.prepareOptions(options);

		var settings = model.settings || (model.collection ? model.collection.settings : window.app.model.settings);

		// add username / password
		if (!options.username)
		{
			options.beforeSend = function(xhr, jqsettings) {
				xhr.setRequestHeader('Authorization', make_base_auth(settings.get('username'), settings.get('password')));
			}
		}

		return Backbone.ajaxSync(method, model, options);
	}
	else
	{
		return this.storage.setItem('offline', 'true');
	}
};

// Make sure we've got the right backbone sync.
Backbone.sync = Offline.sync;
