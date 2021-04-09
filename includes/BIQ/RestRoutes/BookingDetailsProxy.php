<?php
namespace BIQ\RestRoutes;

use BIQ\PluginSettings;

/**
 * BIQ Booking Details Proxy REST_API controller
 */
class BookingDetailsProxy extends RouteReadable
{
    /**
     * [__construct description]
     */
    public function __construct()
    {
        parent::__construct();
        $this->rest_base = "booking-details";
    }

    /**
     * Retrieves a collection of items.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_items($request)
    {
        $api_url = $this->get_api_booking_details_url($request["booking_ref"]);
        // $api_url = https://api.taxicode.com//booking/details/?key=soPSNg0BDHIGjgRr&secret=7nuH6cf4GW6JqF81&id=
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
     * Retrieves the query params for the items collection.
     *
     * @return array Collection parameters.
     */
    public function get_collection_params()
    {
        return [];
    }
    
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
        // $api_url = https://api.taxicode.com//booking/details/?key=soPSNg0BDHIGjgRr&secret=7nuH6cf4GW6JqF81&id=
        return $api_url;
    }
    
}
