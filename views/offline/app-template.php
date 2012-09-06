			<h2>
				<?php echo Kohana::lang('ui_main.view_reports');?>
				<?php if (Kohana::config('offline.enable_editing')) { ?><a href="#reports/add"><?php echo Kohana::lang('ui_main.create_report');?></a><?php } ?>
			</h2>
			<!-- tabs -->
			<div class="tabs">
				<!-- tabset -->
				<ul class="tabset">
					<li><a href="#reports" class="<%- (filter == undefined ? 'active' : '') %> reports-filter-all"><?php echo Kohana::lang('ui_main.show_all');?></a></li>
					<li><a href="#reports/a" class="<%- (filter == 'a' ? 'active' : '') %> reports-filter-approved"><?php echo Kohana::lang('ui_main.awaiting_approval');?></a></li>
					<li><a href="#reports/v" class="<%- (filter == 'v' ? 'active' : '') %> reports-filter-verified"><?php echo Kohana::lang('ui_main.awaiting_verification');?></a></li>
					<li><a href="#reports/o" class="<%- (filter == 'o' ? 'active' : '') %> reports-filter-orphaned"><?php echo Kohana::lang('ui_main.uncategorized_reports');?></a></li>
				</ul>
				<!-- tab -->
				<?php if (Kohana::config('offline.enable_editing')) { ?>
				<div class="tab">
					<ul>
						<li><a href="#" class="mass-approve">
							<?php echo Kohana::lang('ui_main.approve');?></a>
						</li>
						<li><a href="#" class="mass-disapprove">
							<?php echo Kohana::lang('ui_main.disapprove');?></a>
						</li>
						<li><a href="#" class="mass-verify">
							<?php echo Kohana::lang('ui_admin.verify_unverify');?></a>
						</li>
						<li><a href="#" class="mass-delete">
							<?php echo Kohana::lang('ui_main.delete');?></a>
						</li>
					</ul>
				</div>
				<?php } ?>
			</div>
			<div class="table-holder">
				<form method="post">
					<table class="table">
						<thead>
							<tr>
								<th class="col-1"><?php if (Kohana::config('offline.enable_editing')) { ?><input id="checkallincidents" type="checkbox" class="check-box" /><?php } ?></th>
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
							<tr id='loading'><td colspan=4><b>No reports</b></td></tr>
						</tbody>
					</table>
				</form>
			</div>
			