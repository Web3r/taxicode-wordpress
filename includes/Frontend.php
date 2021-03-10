<?php
namespace Taxicode;
use \Braintree\Gateway;

/**
 * Frontend Pages Handler
 */
class Frontend
{

    public function __construct()
    {
        add_shortcode( 'taxicode-app', [ $this, 'render_frontend' ] );
    }

    /**
     * Render frontend app
     *
     * @param  array $atts
     * @param  string $content
     *
     * @return string
     */
    public function render_frontend($atts, $content='')
    {
        // include the vendor specific styles used
        wp_enqueue_style( 'taxicode-vendors' );
        // include the scoped app styles generated
        wp_enqueue_style( 'taxicode-frontend' );
        // include the app script
        wp_enqueue_script( 'taxicode-frontend' );
        if(isset($_POST['tcplugin_include_post']) && $_POST['tcplugin_include_post'] == 1) {
            $searchFormData = [
                "journey_type"  => $_POST['journey_type'],
                "pickup"  => $_POST['pickup'],
                "destination"  => $_POST['destination'],
                "via"  => $_POST['via'],
                "date"  => $_POST['date'],
                "time"  => $_POST['time'],
                "return_date"  => $_POST['return_date'],
                "return_time"  => $_POST['return_time'],
                "people"  => $_POST['people'],
            ];
            $search_on_load = true;
        } else {
            $searchFormData = null;
            $search_on_load = false;
        }
        try {
            // get a Braintree paypal gateway client token
            $paypalGateway = new Gateway(['accessToken' => get_option('tcplugin_paypal_public')]);
            $paypalClientToken = $paypalGateway->clientToken()->generate();
        } catch(Exception $ex) {
            $paypalClientToken = $ex->getMessage();
        }
        // define the plugin HTML content
        $content .= '
<style>
'.get_option('tcplugin_custom_css').'
</style>
<script src="https://js.stripe.com/v3/"></script>
<script>
    const biqAppURL = \'' . get_rest_url('', '/taxicode/v1/') . '\';
    const searchOnLoad = ' . json_encode($search_on_load) . ';
    const searchFormData = ' . json_encode($searchFormData) . ';
    const paypalClientToken = \'' . $paypalClientToken . '\';
    const biq_app_debug_enabled = false;

    // this is a string from the REST & doesn\'t parse to JSON well :(
    // but the echoed string here to be supplied as a prop to the
    // Checkout Page view via the global window variable is an object.
    // It\'s dirty, but needs must for now 2021
    const stripe_cardform_style = ' . get_option('tcplugin_stripe_cardform_css') . ';
</script>
<div id="biq-vue-app"></div>';

        return $content;
    }
    
}
