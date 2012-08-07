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

		<h2><%- incident_title %> (#<%- sid %>)</h1>
		<div class="f-col">
			<p class="<% (incident_verified == 1) ? print('r_verified') : print('r_unverified'); %>">
				<% (incident_verified == 1) ? print('<?php echo Kohana::lang('ui_main.verified'); ?>') : print('<?php echo Kohana::lang('ui_main.unverified'); ?>'); %> |
				<% (incident_active == 1) ? print('<?php echo Kohana::lang('ui_main.approved'); ?>') : print('<?php echo Kohana::lang('ui_admin.unapproved'); ?>'); %>
			</p>
	
			<div class='row'>
				<h4><?php echo Kohana::lang('ui_main.date');?></h4>
				<%- moment(incident_date).format('YYYY-MM-DD HH:mm:ss') %>
			</div>
	
			<div class="row">
				<h4><?php echo Kohana::lang('ui_main.reports_description');?></h4>
				<%= _(incident_description).escape().replace(/\n/g,'<br />') %>
			</div>
	
			<?php 
			// Hack to render custom fields - only supports default form for now
			echo View::factory('reports/detail_custom_forms')
				->set('form_field_names', customforms::get_custom_form_fields(FALSE, 1, FALSE, 'view'))
				->set('show_empty', TRUE)
				->render();
			?>
			
			<h4><?php echo Kohana::lang('ui_main.personal_information');?></h4>
			<div class="row">
				<h4><?php echo Kohana::lang('ui_main.first_name');?></h4>
				<%- incident_person.person_first != null ? incident_person.person_first : '' %>
			</div>
			<div class="row">
				<h4><?php echo Kohana::lang('ui_main.last_name');?></h4>
				<%- incident_person.person_last != null ? incident_person.person_last : '' %>
			</div>
			<div class="row">
				<h4><?php echo Kohana::lang('ui_main.email_address');?></h4>
				<%- incident_person.person_email != null ? incident_person.person_email : '' %>
			</div>
	
		</div>
		<div class="f-col-1">
	
			<div class="report-category-list">
				<h4><?php echo Kohana::lang('ui_main.categories');?></h4>
				<ul><% _.each(category, function(item) { %>
					<li><%- item.category_title %></li>
				<% }); %></ul>
			</div>
	
			<div class='row'>
				<h4><?php echo Kohana::lang('ui_main.location');?></h4>
				<%- location.location_name %>
				<div><img src="" id="report-<%- cid %>-img" /></div>
			</div>
	
			<!-- start report media -->
			<div class="report-media">
				<h4><?php echo Kohana::lang('ui_main.reports_news');?></h4>
				<ul><% _.each( media.filter( function(item) { return item.media_type == 4; } ), function(item) { %>
					<li><%- item.media_link %></li>
				<% }); %></ul>
				
				<h4><?php echo Kohana::lang('ui_main.external_video_link');?></h4>
				<ul><% _.each( media.filter( function(item) { return item.media_type == 2; } ), function(item) { %>
					<li><%- item.media_link %></li>
				<% }); %></ul>
				
				<h4><?php echo Kohana::lang('ui_main.reports_photos');?></h4>
				<ul><% _.each( media.filter( function(item) { return item.media_type == 1; } ), function(item) { %>
					<li><%- item.media_link %></li>
				<% }); %></ul>
			</div>
	
		<div style="clear:both;"></div>
	
	</div>
