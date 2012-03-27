		<h2>
				<a href="#reports"><?php echo Kohana::lang('ui_main.view_reports');?></a>
				<!--<a href="#reports/add"><?php echo Kohana::lang('ui_main.create_report');?></a>-->
		</h2>
		<div class="tab"><ul><li></li></ul></div>
		<!--<%- incident_title %>
		<%- id %>-->
		<div class="f-col-full">
	
			<h1 class="report-title"><%- incident_title %></h1>
	
			<p class="<% (incident_verified == 1) ? print('r_verified') : print('r_unverified'); %>">
				<% (incident_verified == 1) ? print('<?php echo Kohana::lang('ui_main.verified'); ?>') : print('<?php echo Kohana::lang('ui_main.unverified'); ?>'); %> |
				<% (incident_active == 1) ? print('<?php echo Kohana::lang('ui_main.approved'); ?>') : print('<?php echo Kohana::lang('ui_main.unapproved'); ?>'); %>
			</p>
	
			<div class='row'>
				<h4><?php echo Kohana::lang('ui_main.date');?></h4>
				<%- incident_datetime %>
			</div>
	
			<div class="row">
				<h4><?php echo Kohana::lang('ui_main.reports_description');?></h4>
				<%- incident_description %>
			</div>
	
			<div class='row'>
				<h4><?php echo Kohana::lang('ui_main.location');?></h4>
				<%- location_name %>
			</div>
	
			<div class="report-category-list">
				<h4><?php echo Kohana::lang('ui_main.categories');?></h4>
				<%- categories %>
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
	
		<div style="clear:both;"></div>
	
	</div>
