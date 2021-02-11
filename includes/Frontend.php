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
        wp_enqueue_style( 'taxicode-frontend' );
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
        //wp_enqueue_script( 'taxicode-config' );
        /*
         * @todo: replace key with app config setting
         */
        $paypalGateway = new Gateway(['accessToken' => get_option('tcplugin_paypal_public')]);
        $content .= '
<style>
'.get_option('tcplugin_custom_css').'
</style>
<script src="https://js.stripe.com/v3/"></script>
<script>
    const biq_app_debug_enabled = true;
    const biq_app_url = \'' . get_rest_url('', '/taxicode/v1/') . '\';
    const paypal_client_token = \'' . $paypalGateway->clientToken()->generate() . '\';
    const search_on_load = ' . json_encode($search_on_load) . ';
    const searchFormData = ' . json_encode($searchFormData) . ';

    // this is a string from the REST & does not parse to JSON well :(
    // so use the supplied string as a direct JS object declaration to supply a valid prop version
    const stripe_cardform_style = ' . get_option('tcplugin_stripe_cardform_css') . ';

    const biq_app_settings_url = \'' . get_rest_url('', '/taxicode/v1/settings-get/') . '\';
    const tc_public_key = \'' . get_option('tcplugin_taxicode_public') . '\';
    const biq_api_host = \'' . get_option('tcplugin_biq_api_host') . '\';
    const paypal_key = \'' . $paypalGateway->clientToken()->generate() . '\';
    const gateway_api_key = \'' . get_option('tcplugin_stripe_public') . '\';
    const quote_type = \'' . get_option('tcplugin_quote_type') . '\';
    const complete_page_text = \'' . get_option('tcplugin_complete_page_text') . '\';
    const test_mode = ' . json_encode(boolval(get_option('tcplugin_test_mode'))) . ';
</script>
<div id="biq-vue-app"></div>';

        return $content;
    }
    
}
