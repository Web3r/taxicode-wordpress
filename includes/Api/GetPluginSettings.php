<?php
namespace Taxicode\Api;

use WP_REST_Controller;

/**
 * REST_API Handler
 */
class GetPluginSettings extends WP_REST_Controller
{

    /**
     * [__construct description]
     */
    public function __construct()
    {
        $this->namespace = 'taxicode/v1';
        $this->rest_base = 'settings-get';
    }

    /**
     * Register the routes
     *
     * @return void
     */
    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            array(
                array(
                    'methods' => \WP_REST_Server::READABLE,
                    'callback' => array($this, 'get_items'),
                    'permission_callback' => array($this, 'get_items_permissions_check'),
                    'args' => $this->get_collection_params(),
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
    public function get_items($request)
    {
        $response = [
            'taxicode_public'       => get_option('tcplugin_taxicode_public'),
            'biq_api_host'          => get_option('tcplugin_biq_api_host'),
            'paypal_public'         => get_option('tcplugin_paypal_public'),
            'stripe_public'         => get_option('tcplugin_stripe_public'),
            'stripe_cardform_style' => get_option('tcplugin_stripe_cardform_style'),
            'quote_type'            => get_option('tcplugin_quote_type'),
            'complete_page_text'    => get_option('tcplugin_complete_page_text'),
            'custom_css'            => get_option('tcplugin_custom_css'),
            'test_mode'             => get_option('tcplugin_test_mode')
        ];

        $response = rest_ensure_response( $response );

        return $response;
    }

    public function get_items_permissions_check( $request ) {
        return true;
    }
}
