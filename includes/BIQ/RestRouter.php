<?php
namespace BIQ;

use WP_REST_Controller;
use BIQ\RestRoutes\GetSettings;
use BIQ\RestRoutes\UpdateSettings;
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
        (new UpdateSettings())->register_routes();
        (new GetSettings())->register_routes();
        (new BookingDetailsProxy())->register_routes();
    }

}
