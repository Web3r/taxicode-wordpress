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
     * Perform the plugin install / update / conversion of settings to the new version
     * 
     * Around the update a parameter create
     * 
     * @param string $version The current plugin version number
     * @param string $installed The installed plugin version number (set to null to get the stored installed version, if any)
     * @param string $default The default version number to use when $installed is null
     * @return boolean true if the version match checks out
     */
    public static function startedTheCloneWarHas($version, $installed=null, $default="0.0.0")
    {
        if(!static::treason($version, $installed, $default)) {
            // no version change, so nothing to do
                return;
            }
        // It's treason then
        // execute order 66, well, install, update the plugin settings etc.
        return static::order66($version);
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
     * check if the update / conversion needs to happen
     * 
     * I detect the prescence of my old master
     * 
     * @return boolean true if the update / conversion needs to happen
     */
    public static function sensePresence($triggers)
    {
        // error_log(var_export($triggers, true));
        // check if the update / conversion needs to happen
        foreach($triggers as $setting_name) {
            // check if one of the update causing trigger settings is present in the wordpress options
            if(!is_null(get_option($setting_name, null))) {
                // I detect the prescence of my old master
                return true;
            }
        }
        return false;
    }
    
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
    protected static function treason($current, $installed, $default)
    {
        // determine where the installed version value is coming from
        $compare = (is_null($installed)) 
            // get the version from the stored option (if any)
            ? PluginSettings::get_option("version", $default)
            : $installed;
        // error_log(var_export($current, true));
        // error_log(var_export($installed, true));
        // error_log(var_export($default, true));
        // error_log(var_export($compare, true));
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
    protected static function order66($version)
    {
        // Hello There!
        static::generalPrevious($version);
        // update the stored plugin version 
        PluginSettings::update_option("version", $version);
        if(!PluginSettings::get_option("installed")) {
        // this plugin has not been installed (or update conversion installed)
            // install with the default plugin setting options
            static::doIt(PluginSettings::get_all_settings());
        }
    }

    /**
     * Perform any cleanup of previously installed lower version
     * 
     * So uncivilized
     * 
     * @param string $version The current plugin version number being installed / updated
     */
    protected static function generalPrevious($version)
    {
        $conf = PluginSettings::get_update_conf([ "BIQPluginUpdater", "sensePresence" ]);
        // error_log(var_export($conf, true));
        // check if there are previous setting values available 
        if(!$conf["previous"]) {
        // The plans are not on board sir
            return;
        }
        // holder for the new version plugin setting options
        $settings = [];
        // convert the old plugin version setting option names
        foreach($conf["previous"]["convert"] as $old_name => $new_name) {
        // These settings will make a fine addition to my own (cough, cough)
            // get the old version option value from wordpress
            $setting = get_option($old_name, null);
            if(is_null($setting)) {
            // not a good value
                // get the new version default value for the option
                $setting = PluginSettings::get_option_default($new_name);
            }
            // add the value under the new version name
            $settings[$new_name] = $setting;
            // add the old option to the remove stack now we're done converting it
            // You're shorter than I imagined
            $conf["previous"]["remove"][] = $old_name;
        }
        // add the new plugin setting options from this version
        foreach($conf["previous"]["add"] as $name) {
        // We're here to do a job Anakin
            // get the new version default value for the option
            $setting = PluginSettings::get_option_default($name);
            if(is_null($setting)) {
            // unknown setting / option name
                
            }
            // add the option value for the setting
            $settings[$name] = $setting;
        }
        // install with the old plugin options converted or added
        static::doIt($settings);
        // remove unused setting options from previous versions
        foreach($conf["previous"]["remove"] as $name) {
        // Kill the Jedi!
            // delete the previously stored plugin option from wordpress
            delete_option($name);
        }
    }

    /**
     * Install the supplied plugin setting options
     * 
     * Do It!
     * 
     * @param mixed $settings The plugin setting option values
     */
    protected static function doIt($settings)
    {
        // loop through the settings & set the values
        foreach($settings as $name => $value) {
            // update the plugin setting by forcing the difference in old value
            PluginSettings::update_option($name, $value, "OVERWRITE");
        }
        // set the installed time
        PluginSettings::update_option("installed", time());
    }

}