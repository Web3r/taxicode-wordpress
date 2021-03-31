<?php
/*
Plugin Name: Taxicode BIQ API Client
Plugin URI: https://api.taxicode.com
Description: A search and checkout client for the Taxicode Booking Instant Quotes API
Version: 1.0.1
Author: Evil Wizard
Author URI: https://taxicode.com/
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: taxicode
Domain Path: /languages
*/

/**
 * Copyright (c) 2021 Evil Wizard Creations (email: evil.wizard95@googlemail.com). All rights reserved.
 *
 * Released under the GPL license
 * http://www.opensource.org/licenses/gpl-license.php
 *
 * This is an add-on for WordPress
 * http://wordpress.org/
 *
 * **********************************************************************
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * **********************************************************************
 */

// don't call the file directly
if ( !defined( 'ABSPATH' ) ) exit;

if( file_exists( dirname(__FILE__) . '/vendor/autoload.php')) {
    require_once plugin_dir_path(__FILE__) . '/vendor/autoload.php';
}


/**
 * Taxicode class
 *
 * @class Taxicode The class that holds the entire Taxicode plugin
 */
final class Taxicode
{

    /**
     * Plugin version
     *
     * @var string
     */
    public $version = '1.0.1';

    /**
     * Holds various class instances
     *
     * @var array
     */
    private $container = array();

    /**
     * Constructor for the Taxicode class
     *
     * Sets up all the appropriate hooks and actions
     * within our plugin.
     */
    public function __construct()
    {

        $this->define_constants();

        register_activation_hook( __FILE__, array( $this, 'activate' ) );
        register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );

        add_action( 'plugins_loaded', array( $this, 'init_plugin' ) );
    }

    /**
     * Initializes the Taxicode() class
     *
     * Checks for an existing Taxicode() instance
     * and if it doesn't find one, creates it.
     */
    public static function init()
    {
        static $instance = false;

        if (!$instance) {
            $instance = new Taxicode();
        }

        return $instance;
    }

    /**
     * Magic getter to bypass referencing plugin.
     *
     * @param $prop
     *
     * @return mixed
     */
    public function __get($prop)
    {
        if(array_key_exists($prop, $this->container)) {
            return $this->container[ $prop ];
        }

        return $this->{$prop};
    }

    /**
     * Magic isset to bypass referencing plugin.
     *
     * @param $prop
     *
     * @return mixed
     */
    public function __isset($prop)
    {
        return isset($this->{$prop}) || isset($this->container[$prop]);
    }

    /**
     * Define the constants
     *
     * @return void
     */
    public function define_constants()
    {
        define('TAXICODE_VERSION', $this->version);
        define('TAXICODE_FILE', __FILE__);
        define('TAXICODE_PATH', dirname(TAXICODE_FILE));
        define('TAXICODE_INCLUDES', TAXICODE_PATH . '/includes');
        define('TAXICODE_URL', plugins_url('', TAXICODE_FILE));
        define('TAXICODE_ASSETS', TAXICODE_URL . '/assets');
    }

    /**
     * Load the plugin after all plugis are loaded
     *
     * @return void
     */
    public function init_plugin()
    {
        $this->includes();
        $this->init_hooks();
    }

    /**
     * Placeholder for activation function
     *
     * Nothing being called here yet.
     */
    public function activate()
    {

        $installed = get_option('taxicode_installed');

        if(!$installed) {
            update_option('taxicode_installed', time());
        }

        update_option('taxicode_version', TAXICODE_VERSION);
    }

    /**
     * Placeholder for deactivation function
     *
     * Nothing being called here yet.
     */
    public function deactivate()
    {

    }

    /**
     * Include the required files
     *
     * @return void
     */
    public function includes()
    {

        require_once TAXICODE_INCLUDES . '/Assets.php';

        if($this->is_request('admin')) {
            require_once TAXICODE_INCLUDES . '/Admin.php';
        }

        if($this->is_request('frontend')) {
            require_once TAXICODE_INCLUDES . '/Frontend.php';
        }

        if($this->is_request('search_lite')) {
            require_once TAXICODE_INCLUDES . '/SearchLite.php';
        }

        if($this->is_request('ajax')) {
            // require_once TAXICODE_INCLUDES . '/class-ajax.php';
        }

        require_once TAXICODE_INCLUDES . '/Api.php';
    }

    /**
     * Initialize the hooks
     *
     * @return void
     */
    public function init_hooks()
    {

        add_action('init', array($this, 'init_classes'));

        // Localize our plugin
        add_action('init', array($this, 'localization_setup'));
    }

    /**
     * Instantiate the required classes
     *
     * @return void
     */
    public function init_classes()
    {

        if($this->is_request('admin')) {
            $this->container['admin'] = new Taxicode\Admin();
        }

        if($this->is_request( 'frontend')) {
            $this->container['frontend'] = new Taxicode\Frontend();
        }

        if($this->is_request( 'search_lite')) {
            $this->container['search_lite'] = new Taxicode\SearchLite();
        }

        if($this->is_request( 'ajax')) {
            // $this->container['ajax'] =  new Taxicode\Ajax();
        }

        $this->container['api'] = new Taxicode\Api();
        $this->container['assets'] = new Taxicode\Assets();
    }

    /**
     * Initialize plugin for localization
     *
     * @uses load_plugin_textdomain()
     */
    public function localization_setup()
    {
        load_plugin_textdomain('taxicode', false, dirname(plugin_basename(__FILE__)) . '/languages/');
    }

    /**
     * What type of request is this?
     *
     * @param  string $type admin, ajax, cron or frontend.
     *
     * @return bool
     */
    private function is_request($type)
    {
        switch ($type) {
            case 'admin' :
                return is_admin();
            case 'ajax' :
                return defined('DOING_AJAX');
            case 'rest' :
                return defined('REST_REQUEST');
            case 'cron' :
                return defined('DOING_CRON');
            case 'frontend' :
                return (!is_admin() || defined('DOING_AJAX')) && !defined('DOING_CRON');
            case 'search_lite' :
                return (!is_admin() || defined('DOING_AJAX')) && !defined('DOING_CRON');
        }
    }

} // Taxicode

$taxicode = Taxicode::init();
