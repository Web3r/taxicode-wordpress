<?php
namespace Taxicode;

/**
 * Frontend Pages Handler
 */
class Frontend {

    public function __construct() {
        add_shortcode( 'vue-app', [ $this, 'render_frontend' ] );
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
        /*
         * @todo: replace key with app config setting
         */
        $content .= '
                    <script src="https://js.stripe.com/v3/"></script>
                    <script>
                        let stripe = Stripe(\'pk_live_JMwJ7cLYnvUhJp1ic10DmHSO\'),
                            elements = stripe.elements(),
                            card = undefined;
                    </script>
                    ';

        $content .= '<div id="vue-frontend-app"></div>';

        return $content;
    }
}
