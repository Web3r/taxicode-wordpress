<?php
namespace BIQ;

use Braintree\Gateway as PaypalGateway;
use Exception;

/**
 * Static plugin settings handler
 * 
 * @class PluginSettings
 */
class PluginSettings
{
    /**
     * @var string The required wordpress user capability for plugin admin
     */
    const ADMIN_CAPABILITY = "manage_options";

    /**
     * @var array List of wordpress stored options without the plugin prefix and 
     *            the default value for the option
     */
    protected static $_default_options = [
        // @todo remove legacy taxicode name reference
        "taxicode_public"           => '',
        "biq_api_host"              => "",
        "paypal_public"             => '',
        "stripe_public"             => '',
        "stripe_cardform_style"     => "",
        "test_mode"                 => '1',
        "quote_type"                => "all",
        "recommend_upgrade"         => '0',
        "complete_page_text"        => "Thank you for booking with us.",
        // below are options that should not in the public scope
        // @todo remove legacy taxicode name reference
        "taxicode_private"          => '',
        "search_target_permalink"   => "/booking-instant-quotes/",
        "custom_css"                => '',
        // below are plugin version constants and are immutable
        "version"                   => "0.0.0",
        "installed"                 => ''
    ];
    
    /**
     * @var array List of wordpress stored options available for clientside exposure 
     *            exposed name => option name (without prefix)
     */
    protected static $_exposable_settings_map = [
        // @todo remove legacy taxicode name reference
        "taxicode_public"       => "taxicode_public",
        "biq_api_host"          => "biq_api_host",
//        "paypal_public"         => "paypal_public",
        "stripe_public"         => "stripe_public",
        "stripe_cardform_style" => "stripe_cardform_style",
        "test_mode"             => "test_mode",
        "quote_type"            => "quote_type",
        "recommend_upgrade"     => "recommend_upgrade",
        "complete_page_text"    => "complete_page_text"
    ];

    /**
     * Retrieves the request params for the admin updatable settings items collection.
     *
     * @return array Collection parameters.
     */
    public static function get_update_rules()
    {
        // @todo set the option settings definitions & rules
        return [

        ];
    }

    /**
     * Get all the plugin option settings.
     * Including restricted ones if the current user has the capability.
     *
     * @return array The list of plugin setting options values.
     */
    public static function get_all_settings()
    {
        $settings = static::get_exposable_settings();
        // add the immutable plugin setting options
        $settings["version"] = static::get_option("version", static::$_default_options["version"]);
        $settings["installed"] = static::get_option("installed", static::$_default_options["installed"]);
        // return all the settings
        return $settings;
    }

    /**
     * Get the exposable plugin option settings.
     * Including restricted ones if the current user has the capability.
     *
     * @return array The list of plugin setting options values.
     */
    public static function get_exposable_settings()
    {
        $settings = [];
        foreach(static::$_exposable_settings_map as $expose => $option) {
            $settings[$expose] = static::get_option($option, static::$_default_options[$option]);
        }
        // add the non exposed scope plugin options settings with an admin capability check
        if(current_user_can(static::ADMIN_CAPABILITY)) {
            // @todo remove legacy taxicode name reference
            $settings["paypal_public"] = static::get_option("paypal_public", static::$_default_options["paypal_public"]);
            $settings["taxicode_private"] = static::get_option("taxicode_private", static::$_default_options["taxicode_private"]);
            $settings["search_target_permalink"] = static::get_option("search_target_permalink", static::$_default_options["search_target_permalink"]);
            $settings["custom_css"] = static::get_option("custom_css", static::$_default_options["custom_css"]);
        }
        return $settings;
    }
     
    /**
     * Get a plugin setting from wordpress
     * 
     * @param string $name The plugin option name without the prefix
     * @param mixed $default The default value if the option doesn't exist
     * @return mixed
     */
    public static function get_option($name, $default=false)
    {
        if(!in_array($name, array_keys(static::$_default_options))) {
        // unknown setting / option name, just return what the default would be
            return $default;
        }
        // get the prefixed plugin setting option from wordpress
        return get_option(sprintf("%s{$name}", BIQ_OPTIONS_NAME_PREFIX), $default);
    }
    
    /**
     * update a plugin setting in wordpress
     * 
     * @param string $name The plugin option name without the prefix
     * @param mixed $new The new value for the option
     * @param mixed $old The old value of the option if any
     * @return mixed
     */
    public static function update_option($name, $new, $old=false)
    {
        $save_value = trim($new);
        if($save_value == $old) {
        // no change in value so nothing to do
            return;
        }
        // see if the option name needs reverse mapping from the exposed public name
        $option_name = (array_key_exists($name, static::$_exposable_settings_map)) 
                ? static::$_exposable_settings_map[$name]
                : $name;
        // update the plugin setting option value in wordpress (with option name prefix added)
        return update_option(sprintf("%s{$option_name}", BIQ_OPTIONS_NAME_PREFIX), $save_value);
    }

    /**
     * Generate a Paypal Gateway client token
     * 
     * @return string The generated token or an error string (deal with it, frontend lol)
     */
    public static function paypalClientToken()
    {
        try {
            // get a Braintree paypal gateway client token
            $paypalGateway = new PaypalGateway(["accessToken" => static::get_option("paypal_public")]);
            $paypalClientToken = $paypalGateway->clientToken()
                                                ->generate();
        } catch(Exception $ex) {
        // something went wrong
            // @todo look at logging this in the wordpress error logs
            $paypalClientToken = $ex->getMessage();
        }
        return $paypalClientToken;
    }

}
