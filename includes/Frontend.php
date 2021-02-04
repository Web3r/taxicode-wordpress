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
        $paypalGateway = new Gateway(['accessToken' => get_option('tcplugin_paypal_public')]);
        if(isset($_POST['tcplugin_include_post']) && $_POST['tcplugin_include_post'] == 1) {
            $post_js = 'let postData = {
                search_on_load: "true",
                journey_type: "' . $_POST['journey_type'] . '",
                pickup: "' . $_POST['pickup'] . '",
                destination: "' . $_POST['destination'] . '",
                via: "' . $_POST['via'] . '",
                date: "' . $_POST['date'] . '",
                time: "' . $_POST['time'] . '",
                return_date: "' . $_POST['return_date'] . '",
                return_time: "'.$_POST['return_time'].'",
                people: "' . $_POST['people'] . '"
            }';
        } else {
            $post_js = 'let postData = {}';
        }
        //wp_enqueue_script( 'taxicode-config' );
        /*
         * @todo: replace key with app config setting
         */
        $content .= '
                    <script src="https://js.stripe.com/v3/"></script>
                    <style>
                    '.get_option('tcplugin_custom_css').'
                    </style>
                    <script>
                        const gateway_api_key = \'' . get_option('tcplugin_stripe_public') . '\';
                        const stripe_cardform_css = ' . get_option('tcplugin_stripe_cardform_css') . ';
                        const tc_public_key = \'' . get_option('tcplugin_taxicode_public') . '\';
                        const paypal_token = \'' . $paypalGateway->clientToken()->generate() . '\';
                        const quote_settings = \'' . get_option('tcplugin_quote_type') . '\';
                        const complete_page_text = \'' . get_option('tcplugin_complete_page_text') . '\';
                        const test_mode = \'' . get_option('tcplugin_test_mode') . '\';
                        ' . $post_js . '
                    </script>
                    ';

        $content .= '<div id="vue-frontend-app"></div>';

        return $content;
    }
    
}
