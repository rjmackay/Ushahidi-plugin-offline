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
		
		<h2><% if(sid || id) { %><%- incident_title %> (#<%- sid %>) <% } else { %> New Report <% } %></h2>
		<form method="POST" id="report-edit-form" class="report-form" action=''>
		<div class="f-col">
	
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
				<input type='text' name='incident_date' class='field-incident-date text' value='<%- moment(incident_date).format('YYYY-MM-DD') %>' />
				<input type='text' name='incident_time' class='field-incident-time text' value='<%- moment(incident_date).format('HH:mm:ss') %>' />
			</div>
	
			<div class="row">
				<label for="incident_description"><?php echo Kohana::lang('ui_main.reports_description');?></label>
				<textarea name="incident_description" class='field-incident-description' cols=80 rows=20><%- incident_description %></textarea>
			</div>
	
			<?php 
			// Hack to render custom fields - only supports default form for now
			echo View::factory('reports/submit_custom_forms')
			->set('disp_custom_fields', customforms::get_custom_form_fields(FALSE, 1))
			->set('custom_field_mismatch', customforms::get_edit_mismatch(1))
			->render();
			?>
			
			<div class="row">
				<h4><?php echo Kohana::lang('ui_main.personal_information');?></h4>
				<label for="incident_person[person_first]"><?php echo Kohana::lang('ui_main.first_name');?></label>
				<input type='text' name='incident_person[person_first]' class='field-person-first text' value='<%- incident_person.person_first != null ? incident_person.person_first : '' %>' />
			</div>
			<div class="row">
				<label for="incident_person[person_last]"><?php echo Kohana::lang('ui_main.last_name');?></label>
				<input type='text' name='incident_person[person_last]' class='field-person-last text' value='<%- incident_person.person_last != null ? incident_person.person_last : '' %>' />
			</div>
			<div class="row">
				<label for="incident_person[person_email]"><?php echo Kohana::lang('ui_main.email_address');?></label>
				<input type='text' name='incident_person[person_email]' class='field-person-email text' value='<%- incident_person.person_email != null ? incident_person.person_email : '' %>' />
			</div>
			
		</div>
		<div class="f-col-1">
	
			<div class="report-category-list">
				<h4><?php echo Kohana::lang('ui_main.categories');?></h4>
				Selected: <%- categories %>
				<ul id="category-tree">
				<% _.each(category_tree, function(cat) { %>
					<li><label class="inline"><input type='checkbox' name='category[]' value='<%- cat.category_id %>' <% if(cat.children.length != 0) { print('disabled="disabled" ') } %><% if (cat.category_id == category_ids[cat.category_id]) { print('checked="checked"') } %>><%- cat.category_title %></label>
					<% if(cat.children.length != 0) { %>
						<ul>
						<% _.each(cat.children, function(child) { %>
							<li><label class="inline"><input type='checkbox' name='category[]' value='<%- child.category_id %>' <% if (child.category_id == category_ids[child.category_id]) { print('checked=checked') } %>><%- child.category_title %></label></li>
						<% }) %>
						</ul>
					<% } %>
					</li>
				<% }) %>
				</ul>
			</div>

			<div class='row location-row'>
				<label for="location[location_name]"><?php echo Kohana::lang('ui_main.location');?></label>
				<input type='text' name='location[location_name]' class='field-location_name text long' value='<%- location.location_name %>' /><br />
				<label for="location[latitude]" class="inline"><?php echo Kohana::lang('ui_main.latitude');?>:</label> <input type='text' name='location[latitude]' class='field-latitude text' value='<%- location.latitude %>' />
				<label for="location[longitude]" class="inline"><?php echo Kohana::lang('ui_main.longitude');?>:</label> <input type='text' name='location[longitude]' class='field-longitude text' value='<%- location.longitude %>' />
				
			</div>
	
			<!-- start report media -->
			<div class="report-media">
					<h4><?php echo Kohana::lang('ui_main.reports_news');?></h4>
					<% _.each( media.filter( function(item) { return item.media_type == 4; } ), function(item, key) { %>
					<div class="row"><input type='text' name='<%- (item.id != undefined) ? 'news_media_link['+item.id+']' : 'news_media_link_new[]' %>' class='field-media_link text long url' value='<%- item.media_link %>' /></div>
					<% }); %>
					<div class="row"><input type='text' name='news_media_link_new[]' class='field-media_link text long' value='' />
					<a href="#" class="add add-news">add</a></div>
					
					<h4><?php echo Kohana::lang('ui_main.external_video_link');?></h4>
					<% _.each( media.filter( function(item) { return item.media_type == 2; } ), function(item, key) { %>
					<div class="row"><input type='text' name='<%- (item.id != undefined) ? 'video_media_link['+item.id+']' : 'video_media_link_new[]' %>' class='field-media_link text long url' value='<%- item.media_link %>' /></div>
					<% }); %>
					<div class="row"><input type='text' name='video_media_link_new[]' class='field-media_link text long' value='' />
					<a href="#" class="add add-video">add</a></div>
					
					<h4><?php echo Kohana::lang('ui_main.reports_photos');?> (Cannot be edited offline)</h4>
					<ul><% _.each( media.filter( function(item) { return item.media_type == 1; } ), function(item) { %>
						<li><%- item.media_link %></li>
					<% }); %></ul>
			</div>
	</div>

	<div style="clear:both;"></div>

	<div class="btns-bottom">
		<input type='submit' value='<?php echo Kohana::lang('ui_main.save_report'); ?>' id='report-save' />
	</div>
	</form>
