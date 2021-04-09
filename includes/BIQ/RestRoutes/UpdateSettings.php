<?php
namespace BIQ\RestRoutes;

use WP_REST_Controller;
use WP_REST_Server;
use BIQ\PluginSettings;

/**
 * Admin Update Plugin Settings REST_API controller
 */
class UpdateSettings extends WP_REST_Controller
{

    /**
     * [__construct description]
     */
    public function __construct()
    {
        $this->namespace = BIQ_REST_NAMESPACE;
        $this->rest_base = "settings-save";
    }

    /**
     * Register the routes
     */
    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            "/{$this->rest_base}",
            [
                [
                    "methods"             => WP_REST_Server::EDITABLE,
                    "callback"            => [$this, "get_items"],
                    "permission_callback" => [$this, "get_items_permissions_check"],
                    "args"                => $this->get_collection_params(),
                ]
            ]
        );
    }

    /**
     * Retrieves a collection of items.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_items($request)
    {
        // update any plugin settings that have changed
        $this->update_plugin_settings($request);
        // return the new synced version of the plugin settings
        return rest_ensure_response(PluginSettings::get_exposable_settings());
    }

    /**
     * Checks if a given request has access to read the items.
     *
     * @param  WP_REST_Request $request Full details about the request.
     * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
     */
    public function get_items_permissions_check($request)
    {
        // @todo perform the check that the user is a wordpress admin with the 
        // PluginSettings::ADMIN_CAPABILITY user capability cap
        return true;
    }

    /**
     * Retrieves the query params for the items collection.
     * @return array Collection parameters.
     */
    public function get_collection_params()
    {
        return [];
    }
    
    /**
     * Update the plugin settings options if they have changed.
     *
     * @param WP_REST_Request $request Full details about the request.
     */
    protected function update_plugin_settings($request)
    {
        // get all the current plugin setting options
        // @todo get it to include all the settings with an admin capability check
        $old = PluginSettings::get_all_settings();
        // loop through the settings & update any that changed
        foreach($old as $name => $value) {
            // update the plugin setting if the new request value for setting has changed
            PluginSettings::update_option($name, $request[$name], $value);
        }
    }
    
}
