			
			<div class="tabs">
				<!-- tabset -->
				<ul class="tabset">
					<li><a href="#messages" class="<%- (filter == undefined ? 'active' : '') %> messages-filter-all"><?php echo Kohana::lang('ui_main.all');?></a></li>
					<li><a href="#messages/sms" class="<%- (filter == 'sms' ? 'active' : '') %> messages-filter-sms"><?php echo Kohana::lang('ui_main.sms');?></a></li>
					<li><a href="#messages/email" class="<%- (filter == 'email' ? 'active' : '') %> messages-filter-email"><?php echo Kohana::lang('ui_main.email');?></a></li>
					<li><a href="#messages/twitter" class="<%- (filter == 'twitter' ? 'active' : '') %> messages-filter-twitter"><?php echo Kohana::lang('ui_main.twitter');?></a></li>
				</ul>
				<!-- tab -->
				<div class="tab">
					<ul>
						<li><a href="#" class="mass-delete">
							<?php echo Kohana::lang('ui_main.delete');?></a>
						</li>
					</ul>
				</div>
			</div>
			<div class="table-holder"><form method="post">
				<table class="table">
					<thead>
						<tr>
							<th class="col-1"><input id="checkall" type="checkbox" class="check-box" /></th>
							<th class="col-2"><?php echo Kohana::lang('ui_main.message_details');?></th>
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
					<tbody id="messageList">
						<tr id='loading'><td colspan=4><b>Loading...</b></td></tr>
					</tbody>
				</table>
			</form></div>
			