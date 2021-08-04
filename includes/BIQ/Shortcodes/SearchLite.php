<?php
namespace BIQ\Shortcodes;

use BIQ\PluginSettings;

/**
 * BIQ SearchLite App Shortcode Handler
 *
 * @class SearchLite
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
     * Get the content to render SearchLite app
     *
     * @param array $atts Any shorcode attributes used
     * @param string $content Any additional content to render with
     * @return string The content to be rendered
     */
    public function render($atts, $content='')
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
    const biqAppAssetsURL = \'' . BIQ_PLUGIN_URL . '/assets/\';
    const biqAppDebugEnabled = ' . json_encode(BIQ_PLUGIN_DEBUG) . ';
    const biqSearchTarget = \'' . $search_target_permalink . '\';
</script>
<div id="biq-vue-app"></div>';
        // return the content to render
        return $content;
    }

    /**
     * Load scripts and styles for the SearchLite app
     */
    protected function enqueue_assets()
    {
        // include the vendor specific styles used
        //wp_enqueue_style("biq-vendors-vue");
        // include the vendor specific styles used
        wp_enqueue_style("biq-vendors");
        // include the scoped app styles generated
        wp_enqueue_style("biq-search-lite");
        // include the app script
        wp_enqueue_script("biq-search-lite");
    }
    
}
