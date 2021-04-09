<?php
namespace BIQ\RestRoutes;

use WP_REST_Controller;
use WP_REST_Server;

/**
 * Plugin readable route REST_API controller
 */
abstract class Route extends WP_REST_Controller
{
    /**
     * @var string The REST API route 
     */
    const ROUTE = "error";

    /**
     * [__construct description]
     */
    public function __construct()
    {
        $this->namespace = BIQ_REST_NAMESPACE;
        $this->rest_base = static::ROUTE;
    }

    /**
     * Register the routes
     */
    public function register_routes()
    {
        // register a basic get_items route method handler
        register_rest_route(
            $this->namespace,
            "/{$this->rest_base}",
            $this->_route_for("get_items", WP_REST_Server::READABLE, $this->get_collection_params())
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

    /**
     * Generate the array for a [register_rest_route] route
     * 
     * @param string $callback The name of the method to handle the route request
     * @param mixed $methods The request type methods available to access the route
     * @param array $args List of request params defined for the route
     * @return array Config for the route
     */
    protected function _route_for($callback, $methods=WP_REST_Server::READABLE, $args=[])
    {
        // @todo add validation that the callback method exists & is public callable
        // @todo do the same for the permission check but fall back to [get_items_permissions_check]
        return [
            "methods"             => $methods,
            "permission_callback" => [$this, "{$callback}_permissions_check"],
            "callback"            => [$this, "{$callback}"],
            "args"                => $args
        ];
    }

}
