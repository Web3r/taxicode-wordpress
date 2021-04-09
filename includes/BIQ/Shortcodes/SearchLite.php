<?php
namespace BIQ\Shortcodes;

use BIQ\PluginSettings;

/**
 * SearchLite Shortcode Handler
 */
class SearchLite
{
    /**
     * @var string The shortcode to invoke the rendering
     */
    const SHORTCODE = "biq-app-search-lite";

    /**
     * Add the Shortcode to use to invoke the rendering
     */
    public function __construct()
    {
        add_shortcode(static::SHORTCODE, [$this, "render"]);
    }

    /**
     * Render SearchLite app
     *
     * @param  array $atts
     * @param  string $content
     * @return string
     */
    public function render($atts, $content=null)
    {
        // get the search page target for the search form action in order of precedence either from
        // the shortcode usage attribute
        // the plugin option setting
        // the plugin default value for the option setting
        extract(
            shortcode_atts([
                "search_target_permalink" => PluginSettings::get_option("search_target_permalink", "/booking-instant-quotes/")
            ], $atts)
        );
        $this->enqueue_assets();
        // define the plugin HTML content
        $content .= '
<style>
' . PluginSettings::get_option("custom_css", '') . '
</style>
<script>
    const biqAppURL = \'' . BIQ_REST_URL . '\';
    const biqAppDebugEnabled = ' . json_encode(BIQ_PLUGIN_DEBUG) . ';
    const biqSearchTarget = \'' . $search_target_permalink . '\';
</script>
<div id="biq-vue-app"></div>';

        return $content;
    }

    /**
     * Load scripts and styles for the SearchLite app
     */
    protected function enqueue_assets()
    {
        // @todo remove legacy taxicode name reference
        // include the vendor specific styles used
        //wp_enqueue_style("biq-vendors-vue");
        // include the vendor specific styles used
        wp_enqueue_style("taxicode-vendors");
        // include the scoped app styles generated
        wp_enqueue_style("biq-search-lite");
        // include the app script
        wp_enqueue_script("biq-search-lite");
    }
    
}
