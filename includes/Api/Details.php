<?php
namespace Taxicode\Api;

use WP_REST_Controller;

/**
 * REST_API Handler
 */
class Details extends WP_REST_Controller
{

    /**
     * [__construct description]
     */
    public function __construct()
    {
        $this->namespace = 'taxicode/v1';
        $this->rest_base = 'booking-details';
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
                    'methods'             => \WP_REST_Server::READABLE,
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
    public function get_items($request)
    {
        // define the API URL pattern for retrieving the booking details
        $api_uri_pattern = "%s/booking/details/?key=%s&secret=%s&id=%s";
        // fill out the parts of the API URL with the option values & the booking ref
        $api_url = sprintf(
            $api_uri_pattern, 
            get_option('tcplugin_biq_api_host'),
            get_option('tcplugin_taxicode_public'),
            get_option('tcplugin_taxicode_private'),
            $request['booking_ref']
        );
        // $api_url = https://api.taxicode.com//booking/details/?key=soPSNg0BDHIGjgRr&secret=7nuH6cf4GW6JqF81&id=

        // make the API call but no need to verify the SSL of the origin
        $api_call = wp_remote_get( $api_url, [ 'sslverify' => false ] );
        if(is_wp_error($api_call)) {
            $processed_response = wp_remote_retrieve_response_message($api_call);
        } else {
            // get the API response body (it's plain text JSON)
            $api_response = wp_remote_retrieve_body($api_call);
            // convert the response to assoc
            $processed_response = json_decode($api_response);
        }

        // make sure there is a response
        return rest_ensure_response($processed_response);
    }

    /**
     * Checks if a given request has access to read the items.
     *
     * @param  WP_REST_Request $request Full details about the request.
     *
     * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
     */
    public function get_items_permissions_check($request)
    {
        return true;
    }

    /**
     * Retrieves the query params for the items collection.
     *
     * @return array Collection parameters.
     */
    public function get_collection_params()
    {
        return [];
    }
}
