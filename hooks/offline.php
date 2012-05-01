<?php defined('SYSPATH') or die('No direct script access.');
/**
 * Offline Hook - Load All Events
 *
 * PHP version 5
 * LICENSE: This source file is subject to LGPL license 
 * that is available through the world-wide-web at the following URI:
 * http://www.gnu.org/copyleft/lesser.html
 * @author	   Ushahidi Team <team@ushahidi.com> 
 * @package	   Ushahidi - http://source.ushahididev.com
 * @copyright  Ushahidi - http://www.ushahidi.com
 * @license	   http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License (LGPL) 
 */

class offline {
	
	/**
	 * Registers the main event add method
	 */
	public function __construct()
	{
		// Hook into routing
		Event::add('system.pre_controller', array($this, 'add'));
		Event::add('ushahidi_action.config_routes', array($this, '_routes'));
	}
	
	/**
	 * Adds all the events to the main Ushahidi application
	 */
	public function add()
	{
		if (strripos(Router::$current_uri, "admin") !== false)
		{
			Event::add('ushahidi_action.header_nav', array($this, '_add_offline_tab_header'));	 //adds the mobile tab
		}
	}
	
	/*
	 * Modify custom routes
	 */
	public function _routes()
	{
		// Add custom routing for appcache file
		Event::$data['offline/index.appcache'] = 'offline/appcache';
	}
	

	public function _add_offline_tab_header()
	{
		echo "<li><a href=\"". url::site('offline')."\">". Kohana::lang('offline.switch_to_offline_version') ."</a></li>";
	}

}
new offline;
