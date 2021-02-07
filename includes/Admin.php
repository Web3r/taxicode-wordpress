<?php
namespace Taxicode;

/**
 * Admin Pages Handler
 */
class Admin {

    public function __construct() {
        add_action( 'admin_menu', [ $this, 'admin_menu' ] );
    }

    /**
     * Register our menu page
     *
     * @return void
     */
    public function admin_menu() {
        global $submenu;

        $capability = 'manage_options';
        $slug       = 'taxicode-app';

        $hook = add_menu_page( __( 'Taxicode', 'textdomain' ), __( 'Taxicode', 'textdomain' ), $capability, $slug, [ $this, 'plugin_page' ], 'dashicons-text' );

        /*if ( current_user_can( $capability ) ) {
            $submenu[ $slug ][] = array( __( 'App', 'textdomain' ), $capability, 'admin.php?page=' . $slug . '#/' );
            $submenu[ $slug ][] = array( __( 'Settings', 'textdomain' ), $capability, 'admin.php?page=' . $slug . '#/settings' );
        }*/

        add_action( 'load-' . $hook, [ $this, 'init_hooks'] );
    }

    /**
     * Initialize our hooks for the admin page
     *
     * @return void
     */
    public function init_hooks() {
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
    }

    /**
     * Load scripts and styles for the app
     *
     * @return void
     */
    public function enqueue_scripts() {
        wp_enqueue_style( 'taxicode-admin' );
        wp_enqueue_script( 'taxicode-admin' );
    }

    /**
     * Render our admin page
     *
     * @return void
     */
    public function plugin_page() {

        $content = '
<script>
    const biq_app_settings_url = "' . get_rest_url('','/taxicode/v1/settings-get/').'"
    const biq_save_app_settings_url = "' . get_rest_url('','/taxicode/v1/settings-save/').'"
    const tc_private_key = \'' . get_option('tcplugin_taxicode_private') . '\';
</script>
<div class="wrap"><div id="biq-admin-vue-app"></div></div>';
        echo $content;
    }
}
