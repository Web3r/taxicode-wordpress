<?php
namespace Taxicode;

/**
 * Scripts and Styles Class
 */
class Assets {

    function __construct() {

        if ( is_admin() ) {
            add_action( 'admin_enqueue_scripts', [ $this, 'register' ], 5 );
        } else {
            add_action( 'wp_enqueue_scripts', [ $this, 'register' ], 5 );
        }
    }

    /**
     * Register our app scripts and styles
     *
     * @return void
     */
    public function register() {
        $this->register_scripts( $this->get_scripts() );
        $this->register_styles( $this->get_styles() );
    }

    /**
     * Register scripts
     *
     * @param  array $scripts
     *
     * @return void
     */
    private function register_scripts( $scripts ) {
        foreach ( $scripts as $handle => $script ) {
            $deps      = isset( $script['deps'] ) ? $script['deps'] : false;
            $in_footer = isset( $script['in_footer'] ) ? $script['in_footer'] : false;
            $version   = isset( $script['version'] ) ? $script['version'] : TAXICODE_VERSION;

            wp_register_script( $handle, $script['src'], $deps, $version, $in_footer );
        }
    }

    /**
     * Register styles
     *
     * @param  array $styles
     *
     * @return void
     */
    public function register_styles( $styles ) {
        foreach ( $styles as $handle => $style ) {
            $deps = isset( $style['deps'] ) ? $style['deps'] : false;

            wp_register_style( $handle, $style['src'], $deps, TAXICODE_VERSION );
        }
    }

    /**
     * Get all registered scripts
     *
     * @return array
     */
    public function get_scripts() {
        $prefix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '.min' : '';

        $scripts = [
            'taxicode-runtime' => [
                'src'       => TAXICODE_ASSETS . '/js/runtime.js',
                'version'   => filemtime( TAXICODE_PATH . '/assets/js/runtime.js' ),
                'in_footer' => true
            ],
            'taxicode-vendor' => [
                'src'       => TAXICODE_ASSETS . '/js/vendors.js',
                'version'   => filemtime( TAXICODE_PATH . '/assets/js/vendors.js' ),
                'in_footer' => true
            ],
            'taxicode-frontend' => [
                'src'       => TAXICODE_ASSETS . '/js/frontend.js',
                'deps'      => [ 'jquery', 'taxicode-vendor', 'taxicode-runtime' ],
                'version'   => filemtime( TAXICODE_PATH . '/assets/js/frontend.js' ),
                'in_footer' => true
            ],
            'taxicode-config' => [
                'src'       => TAXICODE_URL . '/settings.php',
                'version'   => filemtime( TAXICODE_PATH . '/assets/js/frontend.js' ),
                'in_footer' => false
            ],
            'taxicode-admin' => [
                'src'       => TAXICODE_ASSETS . '/js/admin.js',
                'deps'      => [ 'jquery', 'taxicode-vendor', 'taxicode-runtime' ],
                'version'   => filemtime( TAXICODE_PATH . '/assets/js/admin.js' ),
                'in_footer' => true
            ]
        ];

        return $scripts;
    }

    /**
     * Get registered styles
     *
     * @return array
     */
    public function get_styles() {

        $styles = [
            'taxicode-style' => [
                'src' =>  TAXICODE_ASSETS . '/css/style.css'
            ],
            'taxicode-frontend' => [
                'src' =>  TAXICODE_ASSETS . '/css/vendors.css'
            ],
            'taxicode-admin' => [
                'src' =>  TAXICODE_ASSETS . '/css/admin.css'
            ],
        ];

        return $styles;
    }

}
