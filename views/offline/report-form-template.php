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
		    <?php /*
					// if there are images, show them
					if (count($incident_photos) > 0)
					{
						echo '<div id="report-images">';
						foreach ($incident_photos as $photo)
						{
							echo '<a class="photothumb" rel="lightbox-group1" href="' . $photo['large'] . '"><img src="' . $photo['thumb'] . '"/></a> ';
						};
						echo '</div>';
					}
	
					// if there are videos, show those too
					if (count($incident_videos) > 0)
					{
						echo '<div id="report-video"><ol>';
	
						// embed the video codes
						foreach ($incident_videos as $incident_video)
						{
							echo '<li>';
							$videos_embed->embed($incident_video, '');
							echo '</li>';
						};
						echo '</ol></div>';
	
					}*/
		    ?>
			</div>
	
	
				<!-- start news source link -->
				<?php /*if( count($incident_news) > 0 ) { ?>
				<div class="credibility">
				<h5><?php echo Kohana::lang('ui_main.reports_news');?></h5>
						<?php
							foreach( $incident_news as $incident_new)
							{
								?>
								<a href="<?php echo $incident_new;?> " target="_blank"><?php
									echo $incident_new;
								?></a>
								<br/>
								<?php
									}
				?>
				</div>
				<?php }*/?>
				<!-- end news source link -->
	
				<?php /*if ($features_count)
				{
					?>
					<br /><br /><h5><?php echo Kohana::lang('ui_main.reports_features');?></h5>
					<?php
					foreach ($features as $feature)
					{
						echo ($feature->geometry_label) ?
						 	"<div class=\"feature_label\"><a href=\"javascript:getFeature($feature->id)\">$feature->geometry_label</a></div>" : "";
						echo ($feature->geometry_comment) ?
							"<div class=\"feature_comment\">$feature->geometry_comment</div>" : "";
					}
				}*/?>
	
				<?php /*<div class="credibility">
					<table class="rating-table" cellspacing="0" cellpadding="0" border="0">
	          <tr>
	            <td><?php echo Kohana::lang('ui_main.credibility');?>:</td>
	            <td><a href="javascript:rating('<?php echo $incident_id;?>','add','original','oloader_<?php echo $incident_id;?>')"><img id="oup_<?php echo $incident_id;?>" src="<?php echo url::file_loc('img');?>media/img/up.png" alt="UP" title="UP" border="0" /></a></td>
	            <td><a href="javascript:rating('<?php echo $incident_id;?>','subtract','original')"><img id="odown_<?php echo $incident_id;?>" src="<?php echo url::file_loc('img');?>media/img/down.png" alt="DOWN" title="DOWN" border="0" /></a></td>
	            <td><a href="" class="rating_value" id="orating_<?php echo $incident_id;?>"><?php echo $incident_rating;?></a></td>
	            <td><a href="" id="oloader_<?php echo $incident_id;?>" class="rating_loading" ></a></td>
	          </tr>
	        </table>
				</div>
			</div>*/?>
			
		<div>
			<input type='submit' value='save' id='report-save' />
		</div>
	
		<div style="clear:both;"></div>
		</form>
	</div>
