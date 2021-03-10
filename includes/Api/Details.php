<?php
namespace Taxicode\Api;

use WP_REST_Controller;

/**
 * REST_API Handler
 */
class Details extends WP_REST_Controller {

    /**
     * [__construct description]
     */
    public function __construct() {
        $this->namespace = 'taxicode/v1';
        $this->rest_base = 'booking-details';
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
    public function get_items( $request ) {

        $booking_ref = $request['booking_ref'];

        $url = get_option('tcplugin_biq_api_host') . '/booking/details/?key=' . get_option('tcplugin_taxicode_public') . '&secret=' . get_option('tcplugin_taxicode_private') . "&id={$booking_ref}";

        $response = json_decode(wp_remote_retrieve_body( wp_remote_get( $url ) ));


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
