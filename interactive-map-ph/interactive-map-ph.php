<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://github.com/jillesp
 * @since             1.0.0
 * @package           Interactive_Map_Ph
 *
 * @wordpress-plugin
 * Plugin Name:       Interactive Map PH
 * Plugin URI:        https://github.com/jillesp/wp-interactive-maps
 * Description:       Interactive map
 * Version:           1.0.0
 * Author:            Gilles
 * Author URI:        https://github.com/jillesp
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       interactive-map-ph
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'PLUGIN_NAME_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-interactive-map-ph-activator.php
 */
function activate_interactive_map_ph() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-interactive-map-ph-activator.php';
	Interactive_Map_Ph_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-interactive-map-ph-deactivator.php
 */
function deactivate_interactive_map_ph() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-interactive-map-ph-deactivator.php';
	Interactive_Map_Ph_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_interactive_map_ph' );
register_deactivation_hook( __FILE__, 'deactivate_interactive_map_ph' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-interactive-map-ph.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_interactive_map_ph() {

	$plugin = new Interactive_Map_Ph();
	$plugin->run();

}
run_interactive_map_ph();
