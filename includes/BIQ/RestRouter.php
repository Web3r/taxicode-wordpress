<?php
namespace BIQ;

use WP_REST_Controller;
use BIQ\RestRoutes\Settings;
use BIQ\RestRoutes\BookingDetailsProxy;

/**
 * BIQ REST API Router
 */
class RestRouter extends WP_REST_Controller
{
    /**
     * Add the register rest api routes action and define the plugin rest api url
     */
    public function __construct()
    {
        add_action("rest_api_init", [$this, "register_routes"]);
        // define the plugin REST API route base
        define("BIQ_REST_URL", get_rest_url(null, BIQ_REST_NAMESPACE));
    }

    /**
     * Register the API routes
     *
     * @return void
     */
    public function register_routes()
    {
        (new Settings())->register_routes();
        (new BookingDetailsProxy())->register_routes();
    }

}
