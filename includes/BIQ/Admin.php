<?php
namespace BIQ;

use BIQ\PluginSettings;

/**
 * BIQ Plugin Admin Menu Page Handler
 */
class Admin
{
    /**
     * @var string The Admin menu item icon (dashicons-text, dashicons-car, dashicons-dashboard)
     */
    const MENU_ICON = "dashicons-car";
    
    /**
     * @var string The Admin menu link slug to the admin page
     * @todo remove legacy taxicode name reference
     */
    const MENU_SLUG = "taxicode-app";
    
    /**
     * @var string The Admin menu display language block text
     * @todo remove legacy taxicode name reference
     */
    const MENU_DOMAIN_TEXT = "Taxicode";

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
        $hook = add_menu_page(
            __(static::MENU_DOMAIN_TEXT, "textdomain"), 
            __(static::MENU_DOMAIN_TEXT, "textdomain"), 
            PluginSettings::ADMIN_CAPABILITY, 
            static::MENU_SLUG, 
            [$this, "render"], 
            static::MENU_ICON
        );
        // add the action callback to run when the menu item slug page is being loaded
        add_action("load-{$hook}", [$this, "init_hooks"]);
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
        // @todo remove legacy taxicode name reference
        wp_enqueue_style("biq-admin");
        wp_enqueue_script("biq-admin");
    }

    /**
     * Render the BIQ Admin page
     */
    public function render()
    {
        // @todo remove legacy taxicode name reference
        $content = '
<script>
    const biqAppURL = \'' . BIQ_REST_URL . '\';
    const biqAppDebugEnabled = ' . json_encode(BIQ_PLUGIN_DEBUG) . ';
    const biq_sk = \'' . PluginSettings::get_option("taxicode_private") . '\';
    const custom_css = ' . json_encode(PluginSettings::get_option("custom_css", '')) . ';
    const search_target_permalink = \'' . PluginSettings::get_option("search_target_permalink", "/booking-instant-quotes/") . '\';
</script>
<div class="wrap"><div id="biq-admin-vue-app"></div></div>';
        echo $content;
    }
}
