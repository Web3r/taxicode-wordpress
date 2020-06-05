<?php
namespace Taxicode;

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
        //wp_enqueue_script( 'taxicode-config' );
        /*
         * @todo: replace key with app config setting
         */
        $content .= '
                    <script src="https://js.stripe.com/v3/"></script>
                    <script>
                        let stripe = Stripe(\''.get_option('tcplugin_stripe_public').'\'),
                            elements = stripe.elements(),
                            card = undefined;
                        let tc_public_key = \''.get_option('tcplugin_taxicode_public').'\';
                    </script>
                    ';

        $content .= '<div id="vue-frontend-app"></div>';

        return $content;
    }
}
