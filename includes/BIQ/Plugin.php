<?php
namespace BIQ;

use BIQPluginUpdater;
use BIQ\Shortcodes\SearchLite;
use BIQ\Shortcodes\Frontend;

/**
 * The entire BIQ plugin
 *
 * @class Plugin
 */
class Plugin
{
    /**
     * @var string The plugin version string
     */
    const VERSION = "1.0.1";
    
    /**
     * @var string The registered REST namespace base for routes
     */
    const REST_NAMESPACE = "biq/v1/";
    
    /**
     * @var string The language text domain to register 
     */
    const TEXT_DOMAIN = "biq";
    
    /**
     * @var string The prefix to all the plugin wp options saved settings
     */
    const OPTIONS_NAME_PREFIX = "biqplugin_";

    /**
     * Define the type of requests the plugin can handle
     */
    const REQUEST_TYPE_ADMIN = "admin";
    const REQUEST_TYPE_CRON = "cron";
    const REQUEST_TYPE_AJAX = "ajax";
    const REQUEST_TYPE_REST = "rest";
    const REQUEST_TYPE_FRONTEND = "frontend";
    const REQUEST_TYPE_SEARCH_LITE = "search_lite";
    
    /**
     * @var string Plugin version
     */
    public $version = null;
    
    /**
     * @var BIQ_Plugin The static self single instance
     */
    protected static $instance = null;

    /**
     * @var array Holds various class instances
     */
    protected $container = [];

    /**
     * Sets up the activate, deactivate hooks and the plugin loaded actions
     */
    public function __construct()
    {
        // register the activation & deactivation hooks (also used in plugin update)
        register_activation_hook(BIQ_PLUGIN, [$this, "activate"]);
        register_deactivation_hook(BIQ_PLUGIN, [$this, "deactivate"]);
        // add an action when the plugin is loaded
        add_action("plugins_loaded", [$this, "init_plugin"]);
    }

    /**
     * Initializes the BIQ Plugin instance
     *
     * Checks for an existing BIQ Plugin instance
     * and if it doesn't find one, creates it.
     * @return static The single static self instance of the plugin
     */
    public static function getInstance()
    {
        if(is_null(static::$instance)) {
            // create the single static self instance
            static::$instance = new static();
        }
        // return the single static self instance of the BIQ plugin
        return static::$instance;
    }

    /**
     * Magic getter to bypass referencing plugin.
     *
     * @param $prop string The property name being accessed
     * @return mixed The property value is any
     */
    public function __get($prop)
    {
        if(array_key_exists($prop, $this->container)) {
            return $this->container[$prop];
        }
        return $this->{$prop};
    }

    /**
     * Magic isset to bypass referencing plugin.
     *
     * @param $prop
     * @return mixed
     */
    public function __isset($prop)
    {
        return isset($this->{$prop}) || isset($this->container[$prop]);
    }
    
    /**
     * Initialise the BIQ wordpress plugin
     * 
     * @param boolean $debugging Flag to indicate debugging status
     */
    public function init($debugging=false)
    {
        // define the plugin constants
        $this->define_constants($debugging);
    }

    /**
     * Define the constants to make it easier for the plgin code
     * 
     * @param boolean $debugging Flag to indicate debugging status
     */
    public function define_constants($debugging)
    {
        $this->version = static::VERSION;
        // set the namespace to use when registering REST routes
        define("BIQ_OPTIONS_NAME_PREFIX", static::OPTIONS_NAME_PREFIX);
        // set the plugin version constant
        define("BIQ_VERSION", static::VERSION);
        // set the namespace to use when registering REST routes
        define("BIQ_REST_NAMESPACE", static::REST_NAMESPACE);
        // define the plugins location on the web
        define("BIQ_PLUGIN_URL", plugins_url('', BIQ_PLUGIN));
        // set the plugin debugging status constant
        define("BIQ_PLUGIN_DEBUG", $debugging);
    }

    /**
     * Load the plugin after all plugins are loaded
     */
    public function init_plugin()
    {
        $this->init_hooks();
    }

    /**
     * Add the initialize hooks
     */
    public function init_hooks()
    {
        // allow the required classes to be included & initialised
        add_action("init", [$this, "init_classes"]);
        // allow for language localisation inside the plugin
        add_action("init", [$this, "localization_setup"]);
    }

    /**
     * Instantiate the required classes and add it to the list of containers
     */
    public function init_classes()
    {
        // set the REST API router & asset resource register
        $this->container["router"] = new RestRouter();
        $this->container["assets"] = new AssetRegister();
        // see if the admin environment request (admin menu item or admin page itself)
        if($this->is_request(static::REQUEST_TYPE_ADMIN)) {
            $this->container[static::REQUEST_TYPE_ADMIN] = new Admin();
        }
        // register the main frontend shortcode app
        if($this->is_request(static::REQUEST_TYPE_FRONTEND)) {
            $this->container[static::REQUEST_TYPE_FRONTEND] = new Frontend();
        }
        // register the search lite shortcode app
        if($this->is_request(static::REQUEST_TYPE_SEARCH_LITE)) {
            $this->container[static::REQUEST_TYPE_SEARCH_LITE] = new SearchLite();
        }
    }

    /**
     * Initialize plugin for localization
     */
    public function localization_setup()
    {
        load_plugin_textdomain(
            static::TEXT_DOMAIN, 
            false, 
            BIQ_PLUGIN_LOCATION . "languages/"
        );
    }

    /**
     * what to do when the plugin is activated / updated
     */
    public function activate()
    {
        if(!BIQPluginUpdater::treason(static::VERSION, null, "0.0.0")) {
        // no version change, so nothing to do
            return;
        }
        // It's treason then
        // execute order 66, well, install, update the plugin settings etc.
        return BIQPluginUpdater::order66(static::VERSION);
    }

    /**
     * Perform the deactivate plugin actions
     */
    public function deactivate()
    {
        BIQPluginUpdater::hitTheNose();
    }

    /**
     * What type of request is this?
     *
     * @param  string $type admin, ajax, cron or frontend.
     * @return boolean 
     */
    protected function is_request($type)
    {
        // this is equivelant to none of the above
        $what_she_said = (!is_admin() || defined("DOING_AJAX")) && !defined("DOING_CRON");
        switch($type) {
            case static::REQUEST_TYPE_ADMIN :
                return is_admin();
            case static::REQUEST_TYPE_AJAX :
                return defined("DOING_AJAX");
            case static::REQUEST_TYPE_REST :
                return defined("REST_REQUEST");
            case static::REQUEST_TYPE_CRON :
                return defined("DOING_CRON");
            case static::REQUEST_TYPE_FRONTEND :
                return $what_she_said;
            case static::REQUEST_TYPE_SEARCH_LITE :
                return $what_she_said;
            default :
                return false;
        }
    }

}
