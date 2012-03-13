<?php defined('SYSPATH') or die('No direct script access.');
/**
 * Offline Controller
 *
 * PHP version 5
 * LICENSE: This source file is subject to LGPL license 
 * that is available through the world-wide-web at the following URI:
 * http://www.gnu.org/copyleft/lesser.html
 * @author     Ushahidi Team <team@ushahidi.com> 
 * @package    Ushahidi - http://source.ushahididev.com
 * @copyright  Ushahidi - http://www.ushahidi.com
 * @license    http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License (LGPL) 
 */

class Offline_Controller extends Main_Controller
{

	/**
	 * Automatically render the views loaded in this controller
	 * @var bool
	 */
	public $auto_render = TRUE;

	/**
	 * Whether the current controller is cacheable - defaults to FALSE
	 * @var bool
	 */
	public $is_cachable = FALSE;

	/**
	 * Name of the template view
	 * @var string
	 */
	public $template = 'offline/index';

	public function __construct()
	{
		parent::__construct();
		$this->template->this_page = 'offline';
		
	}
	
	/**
	 * Index controller
	 * Does nothing as everything is just html
	 **/
	public function index()
	{
		// Do nothing - everything is static html!
		//$this->template->content = new View('offline/index');
		//$this->template->content->title = Kohana::lang('ui_admin.settings');
		
	}
	
	/**
	 * Generate index.appcache
	 **/
	public function appcache()
	{
		header('content-type: text/cache-manifest');
		$content = "CACHE MANIFEST\n";
		$rev = $this->cache->get('offline_appcache_rev');
		if (!$rev)
		{
			$rev = time();
			$this->cache->set('offline_appcache_rev',$rev);
		}
		
		$content .= "# Rev: $rev\n";
		$content .= "CACHE\n";
		
		$content .= "/offline\n";
		//$content .= "/offline/\n";
		$content .= "/media/js/jquery.js\n";
		
		$plugindir = PLUGINPATH.'offline';
		
		if ( is_dir($plugindir.'/css') )
		{
			$dir = dir($plugindir.'/css');
			while (($file = $dir->read()) !== FALSE)
				if (preg_match("/\.css/i", $file))
				{
					$content .= "/plugins/offline/css/".$file."\n";
				}
		}
		
		if ( is_dir($plugindir.'/js') )
		{
			$dir = dir($plugindir.'/js');
			while (($file = $dir->read()) !== FALSE)
				if (preg_match("/\.js/i", $file))
				{
					$content .= "/plugins/offline/js/".$file."\n";
				}
		}
		
		if ( is_dir($plugindir.'/css') )
		{
			$dir = dir($plugindir.'/images');
			while (($file = $dir->read()) !== FALSE)
				if ($file != '.' AND $file != '..')
					$content .= "/plugins/offline/images/".$file."\n";
		}
		$content .= "NETWORK\n";
		$content .= "/api\n";
		$content .= "*\n";
		
		echo $content;
		
		exit();
	}
	
}
