		<h2>
				<a href="#reports"><?php echo Kohana::lang('ui_main.view_reports');?></a>
				<% if(sid || id) { %><a href="#reports/add"><?php echo Kohana::lang('ui_main.create_report');?></a>
				<% } else { %><?php echo Kohana::lang('ui_main.create_report');?><% } %>
		</h2>
		<% if(sid || id) { %>
		<div class="tab"><ul>
			<li><a href="#reports/view/<%- id %>">View</a></li>
			<li><a class="active">Edit</a></li>
			<li><a href="#reports/delete/<%- id %>">Delete</a></li>
		</ul></div>
		<% } %>
		
		<div class="f-col-full"><form method="get" id="report-edit-form" class="report-form" action=''>
	
			<h2><% if(sid || id) { %><%- incident_title %> (#<%- sid %>) <% } else { %> New Report <% } %></h2>
	
			<div class="report-title">
				<label for="incident_title"><?php echo Kohana::lang('ui_main.title'); ?></label>
				<input type='text' name='incident_title' class='field-incident-title text title' value='<%- incident_title %>' />
			</div>
	
			<h4><?php echo Kohana::lang('ui_main.information_evaluation'); ?></h4>
	
			<div class="row">
				<label class="inline"><input type='checkbox' name='incident_verified' class='field-verified' value="1" <% (incident_verified == 1) ? print('checked="checked"') : '' %> /> <?php echo Kohana::lang('ui_main.verified'); ?></label>
			</div>
			<div  class="row">
				<label class="inline"><input type='checkbox' name='incident_active' class='field-approved' value="1" <% (incident_active == 1) ? print('checked="checked"') : '' %> /> <?php echo Kohana::lang('ui_main.approved'); ?></label>
			</div>
	
			<div class='row'>
				<label for="incident_date"><?php echo Kohana::lang('ui_main.date');?></label>
				<input type='text' name='incident_date' class='field-incident-date text' value='<%- incident_date %>' />
			</div>
	
			<div class="row">
				<label for="incident_description"><?php echo Kohana::lang('ui_main.reports_description');?></label>
				<textarea name="incident_description" class='field-incident-description' cols=80 rows=20><%- incident_description %></textarea>
			</div>
	
			<div class="report-category-list">
				<h4><?php echo Kohana::lang('ui_main.categories');?></h4>
				<%- categories %>
			</div>
	
			<div class='row'>
				<label for="location.location_name"><?php echo Kohana::lang('ui_main.location');?></label>
				<input type='text' name='location.location_name' class='field-location_name text' value='<%- location.location_name %>' />
				<label><?php echo Kohana::lang('ui_main.latitude');?>: <input type='text' name='location.latitude' class='field-latitude text' value='<%- location.latitude %>' /></label>
				<label><?php echo Kohana::lang('ui_main.longitude');?>: <input type='text' name='location.longitude' class='field-longitude text' value='<%- location.longitude %>' /></label>
				
			</div>
	
			<!-- start report media -->
			<div class="report-media">
					<h4><?php echo Kohana::lang('ui_main.reports_news');?></h4>
					<ul><% _.each( media.filter( function(item) { return item.media_type == 4; } ), function(item, key) { %>
						<li><input type='text' name='media[<%- key %>].media_link' class='field-media_link text' value='<%- item.media_link %>' /></li>
					<% }); %>
						<li><input type='text' name='media[].media_link' class='field-media_link text' value='' /></li>
					</ul>
					
					<h4><?php echo Kohana::lang('ui_main.external_video_link');?></h4>
					<ul><% _.each( media.filter( function(item) { return item.media_type == 2; } ), function(item, key) { %>
						<li><input type='text' name='media[<%- key %>].media_link' class='field-media_link text' value='<%- item.media_link %>' /></li>
					<% }); %>
						<li><input type='text' name='media[].media_link' class='field-media_link text' value='' /></li>
					</ul>
					
					<h4><?php echo Kohana::lang('ui_main.reports_photos');?> (Cannot be edited offline)</h4>
					<ul><% _.each( media.filter( function(item) { return item.media_type == 1; } ), function(item) { %>
						<li><%- item.media_link %></li>
					<% }); %></ul>
			</div>
			
		<div>
			<input type='submit' value='save' id='report-save' />
		</div>
	
		<div style="clear:both;"></div>
		</form>
	</div>
