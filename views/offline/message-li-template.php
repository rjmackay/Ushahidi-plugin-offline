				<td class="col-1">
					<input name="message_id[]" value="<%- id %>" type="checkbox" class="check-box"/>
				</td>
				<td class="col-2">
					<div class="post">
						<%- message %>
					</div>
					<ul class="info">
						<li class="none-separator">Message ID:
							<strong><%- sid %> (<%- id %>)</strong>
						</li>
					</ul>
					<ul class="info">
						<li class="none-separator"><?php echo Kohana::lang('ui_main.from');?>: 
							<strong><%- message_from %></strong>
						</li>
					</ul>
				</td>
				<td class="col-3"><%- message_date %></td>
				<td class="col-4">
					<ul>
						<?php if (Kohana::config('offline.enable_editing')) { ?>
						<% if (incident_id == 0) { %>
							<li class="none-separator"><a href="#reports/add/from_message/<%- id %>"><?php echo Kohana::lang('ui_admin.create_report'); ?></a></li>
						<% } else { %>
							<% if (report != undefined) { %>
								<li class="none-separator"><a href="#reports/view/<%- report.id %>" class="status_yes"><?php echo Kohana::lang('ui_admin.view_report'); ?></a></li>
							<% } else { %>
								<li class="none-separator"><?php echo Kohana::lang('offline.report_not_available'); ?></li>
							<% } %>
						<% } %>
						<li><a href="#messages/delete/<%- id %>" class="del"><?php echo Kohana::lang('ui_main.delete'); ?></a></li>
						<?php } ?>
					</ul>
				</td>