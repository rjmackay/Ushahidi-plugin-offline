loggingEnabled = false;

var cacheStatusValues = [];
cacheStatusValues[0] = 'uncached';
cacheStatusValues[1] = 'idle';
cacheStatusValues[2] = 'checking';
cacheStatusValues[3] = 'downloading';
cacheStatusValues[4] = 'updateready';
cacheStatusValues[5] = 'obsolete';

var cache = window.applicationCache;
cache.addEventListener('cached', logEvent, false);
cache.addEventListener('checking', logEvent, false);
cache.addEventListener('downloading', logEvent, false);
cache.addEventListener('error', logEvent, false);
cache.addEventListener('noupdate', logEvent, false);
cache.addEventListener('obsolete', logEvent, false);
cache.addEventListener('progress', logEvent, false);
cache.addEventListener('updateready', logEvent, false);

function logEvent(e) {
	var online, status, type, message;
	online = (navigator.onLine) ? 'yes' : 'no';
	status = cacheStatusValues[cache.status];
	type = e.type;
	message = 'online: ' + online;
	message += ', event: ' + type;
	message += ', status: ' + status;
	if (type == 'error' && navigator.onLine)
	{
		message += ' (prolly a syntax error in manifest)';
	}
	loggingEnabled && console.log(message);
}

window.applicationCache.addEventListener('updateready', function() {
	window.applicationCache.swapCache();
	loggingEnabled && console.log('swap cache has been called');
	$('#appcache').show();
}, false);

$(function() {
	$('#appcache .reload').click(function() {
		window.location.reload(true);
		return false;
	});
	
	setInterval(function() {
		window.applicationCache.update()
	}, 10000);
});
