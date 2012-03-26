
// Jquery plugin from here: http://jamiethompson.co.uk/web/2008/06/17/publish-subscribe-with-jquery/
var networkDetection = function (url, interval){
	var url = url ? url : '/';
	var interval = interval ? interval : 3000;
	online = false;
	//jQuery(document).bind('offline', this.browserOffline);
	this.StartPolling = function(){
		this.StopPolling();
		this.timer = setInterval(poll, interval);
		return this;
	};
	this.StopPolling = function(){
		clearInterval(this.timer);
		return this;
	};
	this.setPollInterval= function(i) {
		interval = i;
		return this;
	};
	this.setUrl= function(u) {
		url = u;
		return this;
	};
	this.getOnlineStatus = function(){
		return online;
	};
	this.browserOffline = function(){
		online = false;
		jQuery(document).trigger('status.networkDetection',[false]);
		// possibly stop polling?
	};
	function poll() {
		xhr = jQuery.ajax({
			type: "GET",
			url: url,
			dataType: "text"
		});
		xhr.error(function(){
			online = false;
			jQuery(document).trigger('status.networkDetection',[false]);
		});
		xhr.success(function(){
			online = true;
			jQuery(document).trigger('status.networkDetection',[true]);
		});
	};
	
	return this;
};
