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
			<input type='submit' value='Login' id='report-save' />
		</div>
	
		<div style="clear:both;"></div>
		<div id="auth-error" class="error" style="display:none;">Sorry, you could not be logged in. Check your username and password, and try again</div>
		</form>
	</div>
