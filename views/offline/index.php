<!DOCTYPE html>
<html manifest="/offline/index.appcache">
	<head>
		<title>Ushahidi Offline Admin</title>
		<link rel="stylesheet" type="text/css" href="/media/css/admin/all.css" />
		<link rel="stylesheet" type="text/css" href="/media/css/jquery.treeview.css" />
		<link rel="stylesheet" type="text/css" href="/plugins/offline/css/offline.css" />
		<!-- -->
		<script src="/plugins/offline/js/jquery-1.7.1.min.js"></script>
		<script src="/plugins/offline/js/moment.min.js"></script>
		<script src="/plugins/offline/js/json2.js"></script>
		<script src="/plugins/offline/js/jquery.to_json.js"></script>
		<script src="/plugins/offline/js/underscore-min.js"></script>
		<script src="/plugins/offline/js/backbone-min.js"></script>
		<script src="/plugins/offline/js/backbone.localStorage.js"></script>
		<script src="/plugins/offline/js/backbone_offline.js"></script>
		<script src="/media/js/jquery.treeview.js"></script>
		
		<script type="text/template" id="app-template">
	<?php include('app-template.php'); ?>
		</script>
		
		<script type="text/template" id="message-app-template">
	<?php include('message-app-template.php'); ?>
		</script>
		
		<script type="text/template" id="report-page-template">
	<?php include('report-page-template.php'); ?>
		</script>
		
		<script type="text/template" id="report-li-template">
	<?php include('report-li-template.php'); ?>
		</script>
		
		<script type="text/template" id="message-li-template">
	<?php include('message-li-template.php'); ?>
		</script>
		
		<script type="text/template" id="report-form-template">
	<?php include('report-form-template.php'); ?>
		</script>
		
		<script type="text/template" id="settings-edit-template">
	<?php include('settings-edit-template.php'); ?>
		</script>
		<script>
			var baseURL = '<?php echo url::base(); ?>';
			window.baseURL = baseURL;
		</script>
		<script src="/plugins/offline/js/ushahidi.sync.js"></script>
		<script src="/plugins/offline/js/ushahidi.models.js"></script>
		<script src="/plugins/offline/js/ushahidi.views.js"></script>
		<script src="/plugins/offline/js/ushahidi.app.js"></script>
	</head>
	<body>
		<div class="holder">
			<!-- header -->
			<div id="header">
				<!-- title -->
				<h1><?php echo $site_name
				?></h1>
				
				<div id="offline" class="error" style="display:none;">Couldn't connect to server... <a class="reconnect" href="#">try again</a></div>
				
				<!-- nav-holder -->
				<div class="nav-holder">
					<!-- main-nav -->
					<ul class="main-nav">
						<li>
							<a href="<?php echo url::site();?>offline#reports" class="active reports"><?php echo Kohana::lang('ui_admin.reports'); ?></a>
						</li>
						<li>
							<a href="<?php echo url::site();?>offline#messages" class="messages"><?php echo Kohana::lang('ui_admin.messages'); ?></a>
						</li>
					</ul>
					<!-- sub-nav -->
					<ul class="sub-nav">
						<li>
							<a href="<?php echo url::site();?>offline#settings/edit" class="settings"><?php echo Kohana::lang('ui_admin.settings'); ?></a>
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
