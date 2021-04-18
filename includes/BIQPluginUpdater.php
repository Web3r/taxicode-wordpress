<?php
use BIQ\PluginSettings;

/**
 * Static plugin update handler
 * 
 * @class BIQPluginUpdater
 */
class BIQPluginUpdater 
{
    /**
     * Check the intalled version of the plugin against the current version
     * 
     * I am the senate!
     * 
     * @param string $current The current plugin version number
     * @param string $installed The installed plugin version number (set to null to get the stored installed version, if any)
     * @param string $default The default version number to use when $installed is null
     * @return boolean true if the version match checks out
     */
    public static function treason($current, $installed=null, $default="0.0.0")
    {
        // determine where the installed version value is coming from
        $compare = (is_null($installed)) 
            // get the version from the stored option (if any)
            ? PluginSettings::get_option("version", $default)
            : $installed;
        // check the installed version (if any) against current version
        return version_compare($compare, $current, "!=");
    }

    /**
     * Install, update and clean up the plugin settings etc.
     * 
     * Kill the Jedi!
     * 
     * @param string $version The current plugin version number being installed / updated
     */
    public static function order66($version)
    {
        // Hello There! get rid of anything from previous version not used anymore
        static::generalPrevious();
        // update the stored plugin version 
        PluginSettings::update_option("version", $version);
        // check if the plugin has been installed
        if(!PluginSettings::get_option("installed")) {
            // do first time install actions
            static::firstOrderInstall();
        }
        // @todo convert any plugin option setting values that need changing
        // @todo set the plugin setting options that are new to this version
    }

    /**
     * Perform the deactivate plugin actions
     * 
     * Hey, hit the nose!
     */
    public static function hitTheNose()
    {
        // nothing really to do here this version
    }

    /**
     * Perform any cleanup of previously installed lower version
     * 
     * Your settings will make a fine addition to my collection
     */
    protected static function generalPrevious()
    {
        // @todo delete the [biq_version, biq_installed] stored options
        // @todo delete the legacy taxicode stored options
    }

    /**
     * Perform actions that only need to happen when it's a first time install
     * 
     * This is not going to go the way you think.
     */
    protected static function firstOrderInstall()
    {
        // set the installed time
        PluginSettings::update_option("installed", time());
        // get all the current plugin setting options (there wont be any, so it's the default values)
        $settings = PluginSettings::get_all_settings();
        // loop through the settings & set the default values
        foreach($settings as $name => $value) {
            // update the plugin setting by forcing the difference in value
            PluginSettings::update_option($name, $value, "OVERWRITE");
        }
    }

}