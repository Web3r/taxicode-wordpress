<?php
namespace Taxicode\Api;

use WP_REST_Controller;

/**
 * REST_API Handler
 */
class Settings extends WP_REST_Controller {

    /**
     * [__construct description]
     */
    public function __construct() {
        $this->namespace = 'taxicode/v1';
        $this->rest_base = 'settings-save';
    }

    /**
     * Register the routes
     *
     * @return void
     */
    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            array(
                array(
                    'methods'             => \WP_REST_Server::EDITABLE,
                    'callback'            => array( $this, 'get_items' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                    'args'                => $this->get_collection_params(),
                )
            )
        );
    }

    /**
     * Retrieves a collection of items.
     *
     * @param WP_REST_Request $request Full details about the request.
     *
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_items( $request ) {

        $taxicode_public =  $request['taxicode_public'];
        $taxicode_private =  $request['taxicode_private'];
        $stripe_public =  $request['stripe_public'];
        $stripe_private =  $request['stripe_private'];
        $paypal_public = $request['paypal_public'];
        $mapbox_api = $request['mapbox_api'];
        $quote_type = $request['quote_type'];
        $complete_page_text = $request['complete_page_text'];
        $custom_css = $request['custom_css'];
        $test_mode = $request['test_mode'];

        if(trim($taxicode_public)!='')
        {
            update_option('tcplugin_taxicode_public', $taxicode_public);
        }
        if(trim($taxicode_private)!='')
        {
            update_option('tcplugin_taxicode_private', $taxicode_private);
        }
        if(trim($stripe_public)!='')
        {
            update_option('tcplugin_stripe_public', $stripe_public);

        }
        if(trim($stripe_private)!='')
        {
            update_option('tcplugin_stripe_private', $stripe_private);
        }
        if(trim($paypal_public)!='')
        {
            update_option('tcplugin_paypal_public', $paypal_public);
        }
        if(trim($mapbox_api)!='')
        {
            update_option('tcplugin_mapbox_api', $mapbox_api);
        }

        if(trim($quote_type)!='')
        {
            update_option('tcplugin_quote_type', $quote_type);
        }

        if(trim($complete_page_text)!='')
        {
            update_option('tcplugin_complete_page_text', $complete_page_text);
        }

        if(trim($custom_css)!='')
        {
            update_option('tcplugin_custom_css', $custom_css);
        }

        if(trim($test_mode)!='')
        {
            update_option('tcplugin_test_mode', $test_mode);
        }



        $response = [
            'taxicode_public' => get_option('tcplugin_taxicode_public'),
            'taxicode_private' => get_option('tcplugin_taxicode_private'),
            'stripe_public' => get_option('tcplugin_stripe_public'),
            'stripe_private' => get_option('tcplugin_stripe_private'),
            'paypal_public' => get_option('tcplugin_paypal_public'),
            'mapbox_api' => get_option('tcplugin_mapbox_api'),
            'quote_type' => get_option('tcplugin_quote_type'),
            'complete_page_text' => get_option('tcplugin_complete_page_text'),
            'custom_css' => get_option('tcplugin_custom_css'),
            'test_mode' => get_option('tcplugin_test_mode')
        ];

        $response = rest_ensure_response( $response );

        return $response;
    }

    /**
     * Checks if a given request has access to read the items.
     *
     * @param  WP_REST_Request $request Full details about the request.
     *
     * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
     */
    public function get_items_permissions_check( $request ) {
        return true;
    }

    /**
     * Retrieves the query params for the items collection.
     *
     * @return array Collection parameters.
     */
    public function get_collection_params() {
        return [];
    }
}
