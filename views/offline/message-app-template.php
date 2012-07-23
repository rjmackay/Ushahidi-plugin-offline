			<h2>
				<a href="#messages" class="<%- (filter == undefined ? 'active' : '') %> messages-filter-all"><?php echo Kohana::lang('ui_main.all');?></a>
				<a href="#messages/sms" class="<%- (filter == 'sms' ? 'active' : '') %> messages-filter-sms"><?php echo Kohana::lang('ui_main.sms');?></a>
				<a href="#messages/email" class="<%- (filter == 'email' ? 'active' : '') %> messages-filter-email"><?php echo Kohana::lang('ui_main.email');?></a>
				<a href="#messages/twitter" class="<%- (filter == 'twitter' ? 'active' : '') %> messages-filter-twitter"><?php echo Kohana::lang('ui_main.twitter');?></a>
				<!--<a href="#reports/add"><?php echo Kohana::lang('ui_main.create_report');?></a>-->
			</h2>
			<!--<div class="tab"><ul>
				<li><a href="#reports"><?php echo Kohana::lang('ui_main.show_all');?></a></li>
				<li><a href="#reports/a"><?php echo Kohana::lang('ui_main.awaiting_approval');?></a></li>
				<li><a href="#reports/v"><?php echo Kohana::lang('ui_main.awaiting_verification');?></a></li>
				<li><a href="#reports/o"><?php echo Kohana::lang('ui_main.orphaned_reports');?></a></li>
			</ul></div>-->
			<div class="table-holder">
				<table class="table">
					<thead>
						<tr>
							<th class="col-1"><input id="checkall" type="checkbox" class="check-box" onclick="CheckAll( this.id, 'message_id[]' )" /></th>
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
			</div>
			