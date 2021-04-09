<?php
namespace BIQ\RestRoutes;

use BIQ\PluginSettings;

/**
 * Plugin Public Settings REST_API controller
 */
class GetSettings extends RouteReadable
{

    /**
     * [__construct description]
     */
    public function __construct()
    {
        parent::__construct();
        $this->rest_base = "settings-get";
    }

    /**
     * Get the public exposable plugin options mapped to setting names.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_items($request)
    {
        return rest_ensure_response(PluginSettings::get_exposable_settings());
    }

}
