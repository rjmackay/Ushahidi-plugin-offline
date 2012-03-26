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
		<script src="/plugins/offline/js/networkDetection.js"></script>
		<script src="/plugins/offline/js/backbone-min.js"></script>
		<script src="/plugins/offline/js/backbone.localStorage.js"></script>
		
		<script type="text/template" id="app-template">
			<div class="tab"><ul><li><a href="#reports/add">add new report</a></li></ul></div>
			<div class="table-holder">
				<table class="table">
					<thead>
						<tr>
							<th class="col-1"><input id="checkallincidents" type="checkbox" class="check-box" onclick="CheckAll( this.id, 'incident_id[]' )" /></th>
							<th class="col-2"><?php echo Kohana::lang('ui_main.report_details');?></th>
							<th class="col-3"><?php echo Kohana::lang('ui_main.date');?></th>
							<th class="col-4"><?php echo Kohana::lang('ui_main.actions');?></th>
						</tr>
					</thead>
					<tfoot>
						<tr class="foot">
							<td colspan="4">
								
							</td>
						</tr>
					</tfoot>
					<tbody id="reportList">
						
					</tbody>
				</table>
			</div>
		</script>
		
		
		<script type="text/template" id="report-page-template">
			<%- incident_title %>
			<%- id %>
			<a href="#reports" class="more">
				&lt;- Back
			</a>
		</script>
		
		<script type="text/template" id="report-li-template">
				<td class="col-1">
					<input name="incident_id[]" id="incident" value="<%- id %>" type="checkbox" class="check-box"/>
				</td>
				<td class="col-2">
					<div class="post">
						<h4>
							<a href="#reports/view/<%- cid %>" class="more">
								<%- incident_title %>
							</a>
						</h4>
						<p><%- _(incident_description).escape().substr(0,150) %>... 
							<a href="#reports/view/<%- cid %>" class="more">
								<?php echo Kohana::lang('ui_main.more');?>
							</a>
						</p>
					</div>
					<ul class="info">
						<li class="none-separator"><?php echo Kohana::lang('ui_main.location');?>: 
							<strong><%- location_name %></strong>
						</li>
					</ul>
					<ul class="links">
						<li class="none-separator"><?php echo Kohana::lang('ui_main.categories');?>:
							<strong><%- categories %></strong>
						</li>
					</ul>
					<?php
					//echo $edit_log;
					?>
				</td>
				<td class="col-3"><%- incident_date %></td>
				<td class="col-4">
					<ul>
						<li class="none-separator"><a href="#reports/approve/<%- cid %>" <% if (incident_active == 1) print(" class=\"status_yes\"") %>><?php echo Kohana::lang('ui_main.approve');?></a></li>
						<li><a href="#reports/verify/<%- cid %>" <% if (incident_verified == 1) print(" class=\"status_yes\"") %> ><?php echo Kohana::lang('ui_main.verify');?></a></li>
						<li><a href="#reports/defete/<%- cid %>" class="del"><?php echo Kohana::lang('ui_main.delete');?></a></li>
					</ul>
				</td>
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
				<!-- nav-holder -->
				<div class="nav-holder">
					<!-- main-nav -->
					<ul class="main-nav">
						<li>
							<a href="<?php echo url::site();?>offline#reports" class="active"><?php echo Kohana::lang('ui_admin.reports'); ?></a>
						</li>
						<li>
							<a href="<?php echo url::site();?>offline#messages"><?php echo Kohana::lang('ui_admin.messages'); ?></a>
						</li>
					</ul>
					<!-- sub-nav -->
					<ul class="sub-nav">
						<li>
							<a href="<?php echo url::site();?>offline#settings"><?php echo Kohana::lang('ui_admin.settings'); ?></a>
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
