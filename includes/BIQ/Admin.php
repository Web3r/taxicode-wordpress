<?php
namespace BIQ;

use BIQ\PluginSettings;

/**
 * BIQ Plugin Admin Menu Page Handler
 * 
 * @class Admin
 */
class Admin
{
    /**
     * @var string The Admin menu item icon (dashicons-text, dashicons-car, dashicons-dashboard)
     */
    const MENU_ICON = "dashicons-car";
    
    /**
     * @var string The Admin menu link slug to the admin page
     */
    const MENU_SLUG = "biq-client-app";
    
    /**
     * @var string The Admin menu display language block text
     */
    const MENU_DOMAIN_TEXT = "BIQ Client";

    /**
     * Add the BIQ Admin menu item
     */
    public function __construct()
    {
        add_action("admin_menu", [$this, "admin_menu"]);
    }

    /**
     * Register the BIQ Admin menu item with callback to invoke the  admin page rendering
     */
    public function admin_menu()
    {
        // the main menu item
        $main = add_menu_page(
            __(static::MENU_DOMAIN_TEXT, "textdomain"), 
            __(static::MENU_DOMAIN_TEXT, "textdomain"), 
            PluginSettings::ADMIN_CAPABILITY, 
            static::MENU_SLUG, 
            [$this, "render"], 
            static::MENU_ICON
        );
        // add the action callback to run when the menu item slug page is being loaded
        add_action("load-{$main}", [$this, "init_hooks"]);
        // $this->biq_settings_menu();
        // $this->map_settings_menu();
    }

    /**
     * Initialize the hooks for the BIQ Admin page
     */
    public function init_hooks()
    {
        add_action("admin_enqueue_scripts", [$this, "enqueue_scripts"]);
    }

    /**
     * Load scripts and styles for the app
     */
    public function enqueue_scripts()
    {
        // include the mapbox styles
        wp_enqueue_style('biq-mapbox');
        // include the scoped app styles generated
        wp_enqueue_style("biq-admin");
        // include the app script
        wp_enqueue_script("biq-admin");
    }

    /**
     * Render the BIQ Admin page
     */
    public function render()
    {
        $content = '
<script>
    const biqAppURL = \'' . BIQ_REST_URL . '\';
    const biqAppAssetsURL = \'' . BIQ_PLUGIN_URL . '/assets/\';
    const biqAppDebugEnabled = ' . json_encode(BIQ_PLUGIN_DEBUG) . ';
    const admin_nonce = \'' . wp_create_nonce("wp_rest") . '\';
</script>
<div class="wrap"><div id="biq-admin-vue-app"></div></div>';
        echo $content;
    }

    /**
     * Register the BIQ settings sub menu item
     */
    protected function biq_settings_menu()
    {
        // the main plugin settings sub page
        $biq = add_submenu_page( 
            static::MENU_SLUG, 
            'Settings', 
            'BIQ Settings', 
            PluginSettings::ADMIN_CAPABILITY, 
            static::MENU_SLUG . '-biq-settings', 
            [$this, "render"]
        );
        // add the action callback to run when the menu item slug page is being loaded
        add_action("load-{$biq}", [$this, "init_hooks"]);
    }

    /**
     * Register the BIQ settings sub menu item
     */
    protected function map_settings_menu()
    {
        // the optional maps section settings sub page
        $map = add_submenu_page( 
            static::MENU_SLUG, 
            'Map Settings', 
            'BIQ Map Settings', 
            PluginSettings::ADMIN_CAPABILITY, 
            static::MENU_SLUG . '-map-settings', 
            [$this, "render"]
        );
        // add the action callback to run when the menu item slug page is being loaded
        add_action("load-{$map}", [$this, "init_hooks"]);
    }
}
