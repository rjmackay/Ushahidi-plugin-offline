				<td class="col-1">
					<input name="message_id[]" value="<%- id %>" type="checkbox" class="check-box"/>
				</td>
				<td class="col-2">
					<div class="post">
						<%- message %>
					</div>
					<ul class="info">
						<li class="none-separator">Message ID: 
							<strong><%- id %> (<%- cid %>)</strong>
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
						<li class="none-separator"><?php echo Kohana::lang('ui_admin.create_report'); ?></li>
						<li class="none-separator"><?php echo Kohana::lang('ui_admin.view_report'); ?></li>
						<li><?php echo Kohana::lang('ui_main.delete'); ?></li>
					</ul>
				</td>