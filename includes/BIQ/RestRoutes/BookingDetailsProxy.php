<?php
namespace BIQ\RestRoutes;

use BIQ\PluginSettings;
use WP_REST_Server;

/**
 * BIQ Booking Details Proxy REST_API controller
 * 
 * @class BookingDetailsProxy
 */
class BookingDetailsProxy extends Route
{
    /**
     * @var string The REST API route 
     */
    const ROUTE = "booking-details";

    /**
     * Register the booking details proxy routes
     */
    public function register_routes()
    {
        // register the booking details route method handler
        register_rest_route(
            $this->namespace,
            "/{$this->rest_base}",
            $this->_route_for("get_api_booking_details", WP_REST_Server::READABLE, $this->get_api_booking_details_collection_params())
        );
    }

    /**
     * Retrieves the request params for the booking details collection.
     *
     * @return array Collection parameters.
     */
    public function get_api_booking_details_collection_params()
    {
        return [
            // make sure the booking ref was set with the request
            "booking_ref" => [
                "type"              => "string",
                "required"          => true,
                "sanitize_callback" => "sanitize_text_field"
            ],
        ];
    }

    /**
     * Checks if a given request has access to read the items.
     *
     * @param  WP_REST_Request $request Full details about the request.
     * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
     * 
     * @todo allow for the method to be removed and fall back to the [get_items_permissions_check]
     *       with the [_route_for] update
     */
    public function get_api_booking_details_permissions_check($request)
    {
        // no restrictions here
        return $this->get_items_permissions_check($request);
    }

    /**
     * Get the booking details from the BIQ API using the affiliate private key authentication.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_api_booking_details($request)
    {
        $api_url = $this->get_api_booking_details_url($request["booking_ref"]);
        // make the API call but no need to verify the SSL of the origin
        $api_call = wp_remote_get($api_url, ["sslverify" => false] );
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
     * Get the BIQ API booking details URL to call using the affiliate private key authentication.
     * 
     * @param string $booking_ref The booking ref to get the details for
     * @return string The BIQ API booking details URL to call
     */
    protected function get_api_booking_details_url($booking_ref) 
    {
        // define the API URL pattern for retrieving the booking details
        $api_uri_pattern = "%s/booking/details/?key=%s&secret=%s&id=%s";
        // fill out the parts of the API URL with the option values & the booking ref
        $api_url = sprintf(
            $api_uri_pattern, 
            // set the BIQ API host being used
            PluginSettings::get_option("biq_api_host"),
            // add the affiliate API keys to the BIQ API call
            PluginSettings::get_option("taxicode_public"),
            PluginSettings::get_option("taxicode_private"),
            // set the booking ref to get the details for
            $booking_ref
        );
        // $api_url = https://api.taxicode.com/booking/details/?key=XXXXXX&secret=XXXXXX&id=
        return $api_url;
    }
    
}
