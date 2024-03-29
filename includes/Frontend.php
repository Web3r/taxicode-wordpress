<?php
namespace Taxicode;
use \Braintree\Gateway;

/**
 * Frontend Pages Handler
 */
class Frontend {

    public function __construct() {
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
    public function render_frontend( $atts, $content = '' ) {
        wp_enqueue_style( 'taxicode-frontend' );
        wp_enqueue_script( 'taxicode-frontend' );
        $temp_token = 'access_token$production$fp5wb8q4wmhgkhyq$9d779c202302e7ed1ed0408bfc6f64cb';
        $gateway = new Gateway([
            'accessToken' => $temp_token,
            //'accessToken' => get_option('tcplugin_paypal_public'),
        ]);
        $clientToken = $gateway->clientToken()->generate();


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
                        let stripe = Stripe(\''.get_option('tcplugin_stripe_public').'\'),
                            elements = stripe.elements(),
                            card = undefined;
                        let tc_public_key = \''.get_option('tcplugin_taxicode_public').'\';
                        let paypal_token = \''.$clientToken.'\';
                        let quote_settings = \''.get_option('tcplugin_quote_type').'\';
                        let complete_page_text = \''.get_option('tcplugin_complete_page_text').'\';
                        let test_mode = \''.get_option('tcplugin_test_mode').'\';
                    </script>
                    ';

        $content .= '<div id="vue-frontend-app"></div>';

        return $content;
    }
}
