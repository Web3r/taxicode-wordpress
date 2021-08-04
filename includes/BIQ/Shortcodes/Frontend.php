<?php
namespace BIQ\Shortcodes;

use BIQ\PluginSettings;
use Braintree\Gateway;

/**
 * BIQ Frontend App Shortcode Handler
 *
 * @class Frontend
 */
class Frontend
{
    /**
     * @var string The shortcode to invoke the rendering
     */
    const SHORTCODE = "biq-frontend-app";

    /**
     * Add the Shortcode to use to invoke the rendering
     */
    public function __construct()
    {
        add_shortcode(static::SHORTCODE, [$this, "render"]);
    }

    /**
     * Get the content to render the BIQ frontend app
     *
     * @param array $atts Any shorcode attributes used
     * @param string $content Any additional content to render with
     * @return string The content to be rendered
     */
    public function render($atts, $content='')
    {
        $this->enqueue_assets();
        try {
            // get a Braintree paypal gateway client token
            $paypalGateway = new Gateway(["accessToken" => PluginSettings::get_option("paypal_public")]);
            $paypalClientToken = $paypalGateway->clientToken()->generate();
        } catch(Exception $ex) {
            $paypalClientToken = $ex->getMessage();
        }
        // define the plugin HTML content
        $content .= '
<style>
' . PluginSettings::get_option("custom_css", '') . '
</style>
<script>
    const biqAppURL = \'' . BIQ_REST_URL . '\';
    const biqAppAssetsURL = \'' . BIQ_PLUGIN_URL . '/assets/\';
    const biqAppDebugEnabled = ' . json_encode(BIQ_PLUGIN_DEBUG) . ';
    const paypalClientToken = \'' . $paypalClientToken . '\';

    // this is a string from the REST & doesn\'t parse to JSON well :(
    // but the echoed string here to be supplied as a prop to the
    // Checkout Page view via the global window variable is an object.
    // It\'s dirty, but needs must for now 2021
    const stripe_cardform_style = ' . PluginSettings::get_option("stripe_cardform_style", 0) . ';
</script>
<div id="biq-vue-app"></div>';
        // return the content to render
        return $content;
    }

    /**
     * Load scripts and styles for the BIQ frontend app
     */
    protected function enqueue_assets()
    {
        // include the vendor specific styles used
        //wp_enqueue_style("biq-vendors-vue");
        // include the vendor specific styles used
        wp_enqueue_style("biq-vendors");
        // include the mapbox styles
        wp_enqueue_style('biq-mapbox');
        // include the scoped app styles generated
        wp_enqueue_style("biq-frontend");
        // include the app script
        wp_enqueue_script("biq-frontend");
        // include the stripe dependency
        wp_enqueue_script("biq-stripe");
    }
}
