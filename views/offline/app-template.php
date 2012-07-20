			<h2>
				<?php echo Kohana::lang('ui_main.view_reports');?>
				<?php if (Kohana::config('offline.enable_editing')) { ?><a href="#reports/add"><?php echo Kohana::lang('ui_main.create_report');?></a><?php } ?>
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
							<th class="col-1"><input id="checkallincidents" type="checkbox" class="check-box" onclick="CheckAll( this.id, 'incident_id[]' )" /></th>
							<th class="col-2"><?php echo Kohana::lang('ui_main.report_details');?></th>
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
					<tbody id="reportList">
						<tr id='loading'><td colspan=4><b>Loading...</b></td></tr>
					</tbody>
				</table>
			</div>
			