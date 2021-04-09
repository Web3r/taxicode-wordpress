<?php
namespace BIQ;

/**
 * Asset register for enqueuing Scripts and Styles Class
 */
class AssetRegister
{
    /**
     * @var integer The action priority for the enqueue_scripts action register
     */
    const SCRIPTS_ACTION_PRIORITY = 5;

    /**
     * Add the assets enqueue register action
     */
    public function __construct()
    {
        $enque_action = (is_admin()) ? "admin_enqueue_scripts" : "wp_enqueue_scripts";
        add_action($enque_action, [$this, "register"], static::SCRIPTS_ACTION_PRIORITY);
    }

    /**
     * Register our app scripts and styles
     */
    public function register()
    {
        $this->register_scripts($this->get_scripts());
        $this->register_styles($this->get_styles());
    }

    /**
     * Register scripts
     *
     * @param  array $scripts
     */
    protected function register_scripts($scripts)
    {
        foreach($scripts as $handle => $script) {
            // check if the script has any dependancies listed
            $deps = isset($script["deps"]) 
                    ? $script["deps"] 
                    : false;
            // check if the script should appear in the document footer
            $in_footer = isset($script["in_footer"]) 
                    ? $script["in_footer"] 
                    : false;
            // check what the script provided version is
            $version = isset($script["version"]) 
                    ? $script["version"] 
                    : BIQ_VERSION;
            // register the script sources with wordpress
            wp_register_script($handle, $script["src"], $deps, $version, $in_footer);
        }
    }

    /**
     * Register styles
     *
     * @param  array $styles
     */
    protected function register_styles($styles)
    {
        foreach($styles as $handle => $style) {
            // check if the styles have any dependancies
            $deps = isset($style["deps"]) 
                ? $style["deps"] 
                : false;
            // register the style sources with wordpress
            wp_register_style($handle, $style["src"], $deps, BIQ_VERSION);
        }
    }

    /**
     * Get all registered scripts
     *
     * @return array
     */
    protected function get_scripts()
    {
        $prefix = defined("SCRIPT_DEBUG") && SCRIPT_DEBUG ? ".min" : '';
        // @todo remove legacy taxicode name reference
        $common_deps = [
            "taxicode-vendor", 
            "taxicode-runtime"
        ];
        $asset_location = BIQ_PLUGIN_LOCATION . "/assets/js/";
        $asset_url = BIQ_PLUGIN_URL . "/assets/js/";
        // @todo remove legacy taxicode name reference
        $scripts = [
            // webpack initial runtime (kickstart the app & lazy imports etc.)
            "taxicode-runtime" => [
                "src"       => "{$asset_url}runtime.js",
                "version"   => filemtime("{$asset_location}runtime.js"),
                "in_footer" => true
            ],
            // when webpack has split the vendors vue* chunk from the vendors chunck
            "biq-vue" => [
                "src"       => "{$asset_url}vue.js",
                "version"   => filemtime("{$asset_location}vue.js"),
                "in_footer" => true
            ],
            // the webpack split chunck for the app vendors code
            "taxicode-vendor" => [
                "src"       => "{$asset_url}vendors.js",
                "version"   => filemtime("{$asset_location}vendors.js"),
                "in_footer" => true
            ],
            // the webpack split chunck for the main BIQ app code
            "taxicode-frontend" => [
                "src"       => "{$asset_url}frontend.js",
                "deps"      => $common_deps,
                "version"   => filemtime("{$asset_location}frontend.js"),
                "in_footer" => true
            ],
            // the webpack split chunck for the cut down BIQ search form only lite app code
            "biq-search-lite" => [
                "src"       => "{$asset_url}search_lite.js",
                "deps"      => $common_deps,
                "version"   => filemtime("{$asset_location}search_lite.js"),
                "in_footer" => true
            ],
            // yeah, not sure & target file doesn't exist
            "taxicode-config" => [
                "src"       => BIQ_PLUGIN_URL . "/settings.php",
                "version"   => filemtime("{$asset_location}frontend.js"),
                "in_footer" => false
            ],
            // the webpack split chunck for the BIQ Admin app code
            "biq-admin" => [
                "src"       => "{$asset_url}admin.js",
                "deps"      => array_merge(["jquery"], $common_deps),
                "version"   => filemtime("{$asset_location}admin.js"),
                "in_footer" => true
            ]
        ];

        return $scripts;
    }

    /**
     * Get registered styles
     *
     * @return array
     */
    protected function get_styles()
    {
        $asset_location = BIQ_PLUGIN_URL . "/assets/css/";
        // @todo remove legacy taxicode name reference
        $styles = [
            "taxicode-style" => [
                "src" =>  "{$asset_location}style.css"
            ],
            "taxicode-frontend" => [
                "src" =>  "{$asset_location}frontend.css"
            ],
            "biq-search-lite" => [
                "src" =>  "{$asset_location}search_lite.css"
            ],
            "taxicode-vendors" => [
                "src" =>  "{$asset_location}vendors.css"
            ],
            "biq-admin" => [
                "src" =>  "{$asset_location}admin.css"
            ],
        ];

        return $styles;
    }

}
