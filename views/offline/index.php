<!DOCTYPE html>
<html <?php /*manifest="./index.appcache"*/?>>
	<head>
		<title>Ushahidi Report Tool</title>
		<link rel="stylesheet" type="text/css" href="/media/css/admin/all.css" />
		<!-- geo location -->
		<script src="http://code.google.com/apis/gears/gears_init.js" type="text/javascript" charset="utf-8"></script>
		<script src="/plugins/offline/js/geo.js" type="text/javascript" charset="utf-8"></script>
		<!-- -->
		<script src="/plugins/offline/js/jquery-1.7.1.min.js"></script>
		<script src="/plugins/offline/js/json2.js"></script>
		<script src="/plugins/offline/js/underscore-min.js"></script>
		<script src="/plugins/offline/js/backbone-min.js"></script>
		<script src="/plugins/offline/js/backbone.localStorage.js"></script>
		<script type="text/template" id="app-template">
			<h1>Report App</h1>
			<a href="#reports/add">add new report</a>
			<ul id="reportList"></ul>
		</script>
		<script type="text/template" id="report-template">
			<li id="report_<%= cid %>"><span class="title"><%= incident_title %></span> <a href="#reports/remove/<%= cid %>">x</a></li>
		</script>
		<script src="/plugins/offline/js/ushahidi.app.js"></script>
		<?php 
		// Header Nav
		//echo html::script(url::file_loc('js').'media/js/global', true);
		//echo html::stylesheet(url::file_loc('css').'media/css/global','',true);
		?>
	</head>
	<body>
		<div class="holder">
			<!-- header -->
			<div id="header">
				<!-- title -->
				<h1><?php echo $site_name
				?></h1>
				<!-- nav-holder -->
				<div class="nav-holder">
					<!-- main-nav -->
					<ul class="main-nav">
						<li>
							<a href="<?php echo url::site();?>offline#page/reports" class="active"><?php echo Kohana::lang('ui_admin.reports'); ?></a>
						</li>
						<li>
							<a href="<?php echo url::site();?>offline#page/messages"><?php echo Kohana::lang('ui_admin.messages'); ?></a>
						</li>
					</ul>
					<!-- sub-nav -->
					<ul class="sub-nav">
						<li>
							<a href="<?php echo url::site();?>offline#page/settings"><?php echo Kohana::lang('ui_admin.settings'); ?></a>
						</li>
					</ul>
				</div>
			</div>
			<!-- content -->
			<div id="content">
				<div class="bg">
					
					
					
				</div>
			</div>
		</div>
		<div id="footer">
			<div class="holder">
				<strong> <a href="http://www.ushahidi.com" target="_blank" title="Ushahidi Engine" alt="Ushahidi Engine"> <sup><?php echo Kohana::config('version.ushahidi_version');?></sup> </a> </strong>
			</div>
		</div>
	</body>
</html>
