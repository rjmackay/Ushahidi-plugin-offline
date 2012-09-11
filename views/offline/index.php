<!DOCTYPE html>
<html manifest="/offline/index.appcache">
	<head>
		<title>Ushahidi Offline Admin</title>
		
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
		<?php
		echo html::link($css, 'stylesheet', 'text/css');
		foreach ($js as $script)
		{
			$script = url::base().$script;
			echo "<script type=\"text/javascript\" src=\"$script\"></script>\n";
		}
		?>
		<script>
			var baseURL = '<?php echo url::base(); ?>';
			window.baseURL = baseURL;
			
			var categoryTree = <?php echo json_encode(category::get_category_tree_data(FALSE, $this->auth->admin_access())); ?>

			$(function() {
				var UshahidiApp = new AppRouter(
				{
					container : $('#content .bg'),
					baseURL : baseURL,
					categoryTree : categoryTree
				});
				window.app = UshahidiApp;
				Backbone.history.start();
			});
		</script>
	</head>
	<body>
		<div class="holder">
			<!-- header -->
			<div id="header">
				<!-- title -->
				<h1><?php echo $site_name
				?></h1>
				
				<div id="offline" class="error" style="display:none;"><?php echo Kohana::lang('offline.could_not_connect'); ?> <a class="reconnect" href="#"><?php echo Kohana::lang('offline.try_again'); ?></a></div>
				
				<div id="dirty" class="error" style="display:none;"><?php echo Kohana::lang('offline.unsynced_items'); ?> <a class="sync" href="#"><?php echo Kohana::lang('offline.sync_now'); ?></a></div>
				<div id="sync-done" class="error" style="display:none;"><?php echo Kohana::lang('offline.synchronized'); ?></div>
				
				<div id="appcache" class="error" style="display:none;"><?php echo Kohana::lang('offline.app_updates'); ?> <a class="reload" href="#"><?php echo Kohana::lang('offline.reload_to_update'); ?></a></div>
				
				<!-- nav-holder -->
				<div class="nav-holder">
					<!-- main-nav -->
					<ul class="main-nav">
						<li>
							<a href="<?php echo url::site();?>offline#reports" class="active reports"><?php echo Kohana::lang('ui_admin.reports'); ?></a>
						</li>
						<?php if (Kohana::config('offline.enable_editing')) { ?>
						<li>
							<a href="<?php echo url::site();?>offline#messages" class="messages"><?php echo Kohana::lang('ui_admin.messages'); ?></a>
						</li>
						<?php } ?>
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
