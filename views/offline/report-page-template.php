		<h2>
				<a href="#reports"><?php echo Kohana::lang('ui_main.view_reports');?></a>
				<?php if (Kohana::config('offline.enable_editing')) { ?><a href="#reports/add"><?php echo Kohana::lang('ui_main.create_report');?></a><?php } ?>
		</h2>
		<?php if (Kohana::config('offline.enable_editing')) { ?>
		<div class="tab"><ul>
			<li><a class="active">View</a></li>
			<li><a href="#reports/edit/<%- id %>">Edit</a></li>
			<li><a href="#reports/delete/<%- id %>">Delete</a></li>
		</ul></div>
		<?php } ?>

		<div class="f-col-full">
	
			<h1 class="report-title"><%- incident_title %> (#<%- sid %>)</h1>
	
			<p class="<% (incident_verified == 1) ? print('r_verified') : print('r_unverified'); %>">
				<% (incident_verified == 1) ? print('<?php echo Kohana::lang('ui_main.verified'); ?>') : print('<?php echo Kohana::lang('ui_main.unverified'); ?>'); %> |
				<% (incident_active == 1) ? print('<?php echo Kohana::lang('ui_main.approved'); ?>') : print('<?php echo Kohana::lang('ui_admin.unapproved'); ?>'); %>
			</p>
	
			<div class='row'>
				<h4><?php echo Kohana::lang('ui_main.date');?></h4>
				<%- incident_date %>
			</div>
	
			<div class="row">
				<h4><?php echo Kohana::lang('ui_main.reports_description');?></h4>
				<%= _(incident_description).escape().replace(/\n/g,'<br />') %>
			</div>
	
			<div class="report-category-list">
				<h4><?php echo Kohana::lang('ui_main.categories');?></h4>
				<%- categories %>
			</div>
	
			<div class='row'>
				<h4><?php echo Kohana::lang('ui_main.location');?></h4>
				<%- location.location_name %>
				<div><img src="" id="report-<%- cid %>-img" /></div>
			</div>
	
			<!-- start report media -->
			<div class="report-media">
				<h4><?php echo Kohana::lang('ui_main.media');?></h4>
				<% _.each(media, function(item) { %>
					<li><%= item.media_link %></li>
				<% }); %>
			</div>
	
		<div style="clear:both;"></div>
	
	</div>
