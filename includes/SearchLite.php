<?php
namespace Taxicode;

/**
 * SearchLite Pages Handler
 */
class SearchLite
{

    public function __construct()
    {
        add_shortcode('taxicode-app-search-lite', [$this, 'render_search_lite' ]);
    }

    /**
     * Render SearchLite app
     *
     * @param  array $atts
     * @param  string $content
     *
     * @return string
     */
    public function render_search_lite($atts, $content='')
    {
        // include the vendor specific styles used
        wp_enqueue_style( 'taxicode-vendors-vue' );
        // include the vendor specific styles used
        wp_enqueue_style( 'taxicode-vendors' );
        // include the scoped app styles generated
        wp_enqueue_style( 'taxicode-search-lite' );
        // include the app script
        wp_enqueue_script( 'taxicode-search-lite' );
        // define the plugin HTML content
        $content .= '
<style>
'.get_option('tcplugin_custom_css').'
</style>
<script>
    const biqAppURL = \'' . get_rest_url('', '/taxicode/v1/') . '\';
    const biqAppDebugEnabled = false;
</script>
<div id="biq-vue-app"></div>';

        return $content;
    }
    
}
