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
						<li class="none-separator">Incident ID: 
							<strong><%- id %> (<%- cid %>)</strong>
						</li>
					</ul>
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
					<ul><!--
						<li class="none-separator"><a href="#reports/approve/<%- cid %>" <% if (incident_active == 1) print(" class=\"status_yes\"") %>><?php echo Kohana::lang('ui_main.approve');?></a></li>
						<li><a href="#reports/verify/<%- cid %>" <% if (incident_verified == 1) print(" class=\"status_yes\"") %> ><?php echo Kohana::lang('ui_main.verify');?></a></li>
						<li><a href="#reports/defete/<%- cid %>" class="del"><?php echo Kohana::lang('ui_main.delete');?></a></li>-->
					</ul>
				</td>