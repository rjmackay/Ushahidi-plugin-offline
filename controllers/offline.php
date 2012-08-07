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

class Offline_Controller extends Template_Controller {

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

		// Load cache
		$this->cache = new Cache;

		// Load session
		$this->session = new Session;

		// Load database
		$this->db = new Database();

		$this->auth = new Auth();
		$this->session = Session::instance();
		$this->auth->auto_login();

		// Themes Helper
		$this->themes = new Themes();

		// Admin is not logged in, or this is a member (not admin)
		/*if (!$this->auth->logged_in('login') OR $this->auth->logged_in('member'))
		{
			url::redirect('login');
		}*/

		// Set Table Prefix
		$this->table_prefix = Kohana::config('database.default.table_prefix');

		// Get the no. of items to display setting
		$this->items_per_page = (int)Kohana::config('settings.items_per_page_admin');

		// Get Session Information
		//$this->user = new User_Model($_SESSION['auth_user']->id);

		// Check if user has the right to see the admin panel
		/*if (admin::admin_access($this->user) == FALSE)
		{
			// This user isn't allowed in the admin panel
			url::redirect('/');
		}*/

		// Retrieve Default Settings
		$this->template->site_name = Kohana::config('settings.site_name');
		header('Cache-control: must-revalidate');
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
			$this->cache->set('offline_appcache_rev', $rev);
		}

		$content .= "# Rev: $rev\n";
		$content .= "CACHE:\n";

		$content .= "/offline\n";
		$content .= "/media/css/admin/all.css\n";
		$content .= "/media/img/admin/top-separator.gif
/media/img/admin/content-bg.gif
/media/img/admin/separator.gif
/media/img/admin/separator-1.gif
/media/img/admin/separator-2.gif
/media/img/admin/icon-rss.gif
/media/img/admin/icon-ok.gif
/media/img/admin/icon-none.gif
/media/img/admin/icon-mail.gif
/media/img/admin/icon-phone.gif
/media/img/admin/icon_sprite.png
/media/img/admin/icon-twitter.gif
/media/img/admin/dots.gif
/media/img/admin/report-icon.gif
/media/img/admin/category-icon.gif
/media/img/admin/locations-icon.gif
/media/img/admin/media-icon.gif
/media/img/admin/messages-icon.gif
/media/img/admin/alerts-icon.png
/media/img/admin/votes-icon.png
/media/img/admin/checkins-icon.png
/media/img/admin/locations-icon.gif
/media/img/admin/logo.gif
/media/img/admin/arrow.gif
/media/img/admin/drag.gif
/media/img/admin/footer-bg.jpg
/media/js/jquery.treeview.js
/media/js/jquery.validate.js
/media/css/jquery.treeview.css
";
		
		
		$plugindir = PLUGINPATH . 'offline';

		if (is_dir($plugindir . '/css'))
		{
			$dir = dir($plugindir . '/css');
			while (($file = $dir->read()) !== FALSE)
				if (preg_match("/\.css/i", $file))
				{
					$content .= "/plugins/offline/css/" . $file . "\n";
				}
		}

		if (is_dir($plugindir . '/js'))
		{
			$dir = dir($plugindir . '/js');
			while (($file = $dir->read()) !== FALSE)
				if (preg_match("/\.js/i", $file))
				{
					$content .= "/plugins/offline/js/" . $file . "\n";
				}
		}

		if (is_dir($plugindir . '/images'))
		{
			$dir = dir($plugindir . '/images');
			while (($file = $dir->read()) !== FALSE)
				if ($file != '.' AND $file != '..')
					$content .= "/plugins/offline/images/" . $file . "\n";
		}
		$content .= "NETWORK:\n";
		$content .= "/api\n";
		$content .= "*\n";
		$content .= "FALLBACK:\n";
		$content .= "/admin /offline\n";
		$content .= "/admin/* /offline\n";
		//$content .= "*\n";

		echo $content;

		exit();
	}

}
