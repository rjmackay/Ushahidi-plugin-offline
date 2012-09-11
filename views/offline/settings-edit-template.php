		<div class="tab"><ul>
			<li></li>
		</ul></div>
		
		<div class="f-col-full"><form method="post" id="settings-form" action=''>

		<div class="username">
			<label for="username"><?php echo Kohana::lang('ui_main.username'); ?></label>
			<input type='text' name='username' class='field-username' value='' />
		</div>
	
		<div class="password">
			<label for="password"><?php echo Kohana::lang('ui_main.password'); ?></label>
			<input type='password' name='password' class='field-password' value='' />
		</div>

		<div>
			<input type='submit' value='<?php echo Kohana::lang('ui_main.login'); ?>' id='report-save' />
		</div>
	
		<div style="clear:both;"></div>
		<div id="auth-error" class="error" style="display:none;"><?php echo Kohana::lang('offline.login_error'); ?></div>
		</form>
	</div>
