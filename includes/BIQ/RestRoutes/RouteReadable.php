<?php
namespace BIQ\RestRoutes;

use WP_REST_Controller;
use WP_REST_Server;

/**
 * Plugin readable route REST_API controller
 */
abstract class RouteReadable extends WP_REST_Controller
{

    /**
     * [__construct description]
     */
    public function __construct()
    {
        $this->namespace = BIQ_REST_NAMESPACE;
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
                    "methods"             => WP_REST_Server::READABLE,
                    "callback"            => [$this, "get_items"],
                    "permission_callback" => [$this, "get_items_permissions_check"],
                    "args"                => $this->get_collection_params(),
                ]
            ]
        );
    }

    /**
     * Checks if a given request has access to read the items.
     *
     * @param  WP_REST_Request $request Full details about the request.
     * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
     */
    public function get_items_permissions_check($request)
    {
        return true;
    }

    /**
     * Retrieves a collection of items.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_items($request)
    {
        return [];
    }

}
