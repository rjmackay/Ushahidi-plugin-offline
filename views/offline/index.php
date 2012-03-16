<!DOCTYPE html>
<html <?php /*manifest="./index.appcache"*/?>>
	<head>
		<title>Ushahidi Report Tool</title>
		<!-- geo location -->
		<script src="http://code.google.com/apis/gears/gears_init.js" type="text/javascript" charset="utf-8"></script>
		<script src="/plugins/offline/js/geo.js" type="text/javascript" charset="utf-8"></script>
		<!-- -->
		<script src="/plugins/offline/js/jquery-1.7.1.min.js"></script>
		<script src="/plugins/offline/js/json2.js"></script>
		<script src="/plugins/offline/js/underscore-min.js"></script>
		<script src="/plugins/offline/js/backbone-min.js"></script>
		<script src="/plugins/offline/js/backbone.localStorage-min.js"></script>
		
		<script type="text/template" id="app-template">
			<h1>Report App</h1>
			<a href="#reports/add">add new report</a>
			<ul id="reportList"></ul>
		</script>
		
		<script type="text/template" id="report-template">
			<li id="report_<%= cid %>"><span class="title"><%= title %></span> <span><%= format %></span> <a href="#reports/remove/<%= cid %>">x</a></li>
		</script>
		
		<script src="/plugins/offline/js/ushahidi.app.js" defer></script>
	</head>
	<body>
		
	</body>
</html>
