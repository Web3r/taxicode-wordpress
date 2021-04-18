<?php
namespace BIQ\RestRoutes;

use BIQ\PluginSettings;
use WP_REST_Server;

/**
 * Plugin Settings REST_API controller
 * 
 * @class BookingDetailsProxy
 */
class Settings extends Route
{
    /**
     * @var string The REST API route 
     */
    const ROUTE = "settings";

    /**
     * Register the settings routes
     */
    public function register_routes()
    {
        // register the get settings route method handler
        register_rest_route(
            $this->namespace,
            "/{$this->rest_base}/paypal-token",
            $this->_route_for("get_paypal_token", WP_REST_Server::READABLE, [])
        );
        // register the get settings route method handler
        register_rest_route(
            $this->namespace,
            "/{$this->rest_base}",
            $this->_route_for("get_settings", WP_REST_Server::READABLE, [])
        );
        // register the admin update settings route method handler
        register_rest_route(
            $this->namespace,
            "/{$this->rest_base}",
            $this->_route_for("update_settings", WP_REST_Server::EDITABLE, PluginSettings::get_update_rules())
        );
    }

    /**
     * Checks if a given request has access to the REST endpoint.
     *
     * @param  WP_REST_Request $request Full details about the request.
     * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
     * 
     * @todo allow for the method to be removed and fall back to the [get_items_permissions_check]
     *       with the [_route_for] update
     */
    public function get_paypal_token_permissions_check($request)
    {
        // no restrictions here
        return $this->get_items_permissions_check($request);
    }

    /**
     * Get the public exposable plugin options mapped to setting names.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_paypal_token($request)
    {
        return rest_ensure_response(["paypal_token" => PluginSettings::paypalClientToken()]);
    }

    /**
     * Checks if a given request has access to the REST endpoint.
     *
     * @param  WP_REST_Request $request Full details about the request.
     * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
     * 
     * @todo allow for the method to be removed and fall back to the [get_items_permissions_check]
     *       with the [_route_for] update
     */
    public function get_settings_permissions_check($request)
    {
        // no restrictions here
        return $this->get_items_permissions_check($request);
    }

    /**
     * Get the public exposable plugin options mapped to setting names.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_settings($request)
    {
        return rest_ensure_response(PluginSettings::get_exposable_settings());
    }

    /**
     * Checks if request has authority to update the plugin setting option values.
     *
     * @param  WP_REST_Request $request Full details about the request.
     * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
     */
    public function update_settings_permissions_check($request)
    {
        // perform the check that the user is a wordpress admin with the 
        // PluginSettings::ADMIN_CAPABILITY user capability cap
        return current_user_can(PluginSettings::ADMIN_CAPABILITY);
    }

    /**
     * update the setting option values & return the synced updated settings.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function update_settings($request)
    {
        // get all the current plugin setting options
        $old = PluginSettings::get_exposable_settings();
        // loop through the settings & update any that changed
        foreach($old as $name => $value) {
            // update the plugin setting if the new request value for setting has changed
            PluginSettings::update_option($name, $request[$name], $value);
        }
        // return the new synced version of the plugin settings
        return rest_ensure_response(PluginSettings::get_exposable_settings());
    }

}
