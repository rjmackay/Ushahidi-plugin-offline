		<div class="tab"><ul>
			<li></li>
		</ul></div>
		
		<div class="f-col-full"><form method="get" id="settings-form" action=''>
	
		<div class="username">
			<label for="username"><?php echo Kohana::lang('ui_main.username'); ?></label>
			<input type='text' name='username' class='field-username' value='<%- username %>' />
		</div>
	
		<div class="password">
			<label for="password"><?php echo Kohana::lang('ui_main.password'); ?></label>
			<input type='password' name='password' class='field-password' value='' />
		</div>

		<div>
			<input type='submit' value='save' id='report-save' />
		</div>
	
		<div style="clear:both;"></div>
		</form>
	</div>