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
		
		$this->auth = Auth::instance();

		// Retrieve Default Settings
		$this->template->site_name = Kohana::config('settings.site_name');
		header('Cache-control: must-revalidate');
		header('Expires: '.gmdate('D, d M Y H:i:s \G\M\T', time()+1));
	}

	/**
	 * Index controller
	 * Does nothing as everything is just html
	 **/
	public function index()
	{
		// Do nothing - everything is static html!
		$css = array();
		$css[] = "media/css/admin/all.css";
		$css[] = "media/css/jquery.treeview.css";
		$css[] = $this->_hash_file("plugins/offline/css/offline.css");
		
		$js = array();
		$js[] = $this->_hash_file("plugins/offline/js/jquery-1.7.1.min.js");
		$js[] = $this->_hash_file("plugins/offline/js/moment.min.js");
		$js[] = $this->_hash_file("plugins/offline/js/json2.js");
		$js[] = $this->_hash_file("plugins/offline/js/jquery.to_json.js");
		$js[] = $this->_hash_file("plugins/offline/js/underscore-min.js");
		$js[] = $this->_hash_file("plugins/offline/js/backbone-min.js");
		$js[] = $this->_hash_file("plugins/offline/js/backbone.localStorage.js");
		$js[] = $this->_hash_file("plugins/offline/js/backbone_offline.js");
		$js[] = "media/js/jquery.treeview.js";
		$js[] = "media/js/jquery.validate.min.js";
		$js[] = $this->_hash_file("plugins/offline/js/ushahidi.sync.js");
		$js[] = $this->_hash_file("plugins/offline/js/ushahidi.models.js");
		$js[] = $this->_hash_file("plugins/offline/js/ushahidi.views.js");
		$js[] = $this->_hash_file("plugins/offline/js/ushahidi.app.js");
		$js[] = $this->_hash_file("plugins/offline/js/appcache.js");
		
		$this->template->css = $css;
		$this->template->js = $js;
		
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
		// Hardcoded revision ID - bump for each release
		$rev = '0.2.1';

		$content .= "# Rev: $rev\n";
		$content .= "CACHE:\n";

		//$content .= "/offline\n";
		$content .= "/media/css/admin/all.css
/media/img/admin/top-separator.gif
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
/media/js/jquery.validate.min.js
/media/css/jquery.treeview.css
/media/img/treeview-default-line.gif
/media/img/treeview-default.gif
/media/img/icon-plus.gif
";
		
		$plugin_files = array();
		
		$plugindir = PLUGINPATH . 'offline';

		if (is_dir($plugindir . '/css'))
		{
			$dir = dir($plugindir . '/css');
			while (($file = $dir->read()) !== FALSE)
				if (preg_match("/\.css/i", $file))
				{
					$plugin_files[] = "/plugins/offline/css/" . $file;
				}
		}

		if (is_dir($plugindir . '/js'))
		{
			$dir = dir($plugindir . '/js');
			while (($file = $dir->read()) !== FALSE)
				if (preg_match("/\.js/i", $file))
				{
					$plugin_files[] = "/plugins/offline/js/" . $file;
				}
		}

		if (is_dir($plugindir . '/images'))
		{
			$dir = dir($plugindir . '/images');
			while (($file = $dir->read()) !== FALSE)
				if ($file != '.' AND $file != '..')
					$content .= "/plugins/offline/images/" . $file . "\n";
		}
		
		$plugin_files = $this->_hash_files($plugin_files);
		$content .= implode("\n",$plugin_files);
		
		$content .= "\nNETWORK:\n";
		$content .= "/api\n";
		$content .= "*\n";
		$content .= "FALLBACK:\n";
		$content .= "/admin /offline\n";
		$content .= "/admin/* /offline\n";
		//$content .= "*\n";

		echo $content;

		exit();
	}

	private function _hash_files($files)
	{
		$output = array();
		foreach ($files as $file)
		{
			$output[] = $this->_hash_file($file);
		}
		return $output;
	}

	private function _hash_file($file)
	{
		$hash = md5_file(DOCROOT . $file);
		$ext = substr($file, strrpos($file, '.'));
		$file = substr($file, 0, strrpos($file, '.'));
		return "$file.$hash$ext";
	}

}
