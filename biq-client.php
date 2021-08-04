<?php
/*
Plugin Name: Booking Instant Quotes Client
Plugin URI: https://api.taxicode.com
Description: A Booking Instant Quotes search and checkout client using the Taxicode API
Version: 1.0.1
Author: Evil Wizard
Author URI: https://taxicode.com/
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
@todo remove legacy taxicode name reference
Text Domain: taxicode
Domain Path: /languages
*/

/**
 * Copyright (c) 2021 Evil Wizard Creations (email: evil.wizard95@googlemail.com). All rights reserved.
 *
 * Released under the GPL license
 * http://www.opensource.org/licenses/gpl-license.php
 *
 * This is an add-on for WordPress
 * http://wordpress.org/
 *
 * **********************************************************************
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * **********************************************************************
 */

// don't call the file directly
if (!defined("ABSPATH")) {
    exit;
}
// define the actual plugin file absolute 
define("BIQ_PLUGIN", __FILE__);
// define the plugins location on the server
define("BIQ_PLUGIN_LOCATION", plugin_dir_path(BIQ_PLUGIN));
// a flag to allow the plugin clientside apps to be debugged
$debugging = false;

/**
 * Autoload namespaced classes.
 * 
 * @param string $class_name The fully class name being requested.
 * @return boolean true if the class was auto loaded.
 */
function biq_autoloader($class_name) {
    // replace escaped namespace sections
    $namespaced_class = str_replace("\\", '/', $class_name);
    // get the FQCN
    $full_file_path = BIQ_PLUGIN_LOCATION . "includes/{$namespaced_class}.php";
    if(!file_exists($full_file_path)) {
    // namespace file not found, look elsewhere
        return false;
    }
    // return the result of requiring the file
    return require($full_file_path);
}
// allow for autoloading without composer (when bundled as production ready)
spl_autoload_register("biq_autoloader");
// check if there's a vendors autoload to include
if(file_exists(BIQ_PLUGIN_LOCATION . "vendor/autoload.php")) {
    require_once BIQ_PLUGIN_LOCATION . "vendor/autoload.php";
}


/**
 * BIQClient Extend and customised the BIQ plugin
 *
 * @class BIQClient
 */
final class BIQClient extends BIQ\Plugin
{
    /**
     * @var string The plugin version string
     */
    const VERSION = "1.0.1";
    
    /**
     * @var string The registered REST namespace base for routes
     */
    const REST_NAMESPACE = "biq-client/v1/";

}

BIQClient::getInstance()
        ->init($debugging);
