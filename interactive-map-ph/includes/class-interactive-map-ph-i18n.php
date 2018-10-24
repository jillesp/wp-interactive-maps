<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://github.com/jillesp
 * @since      1.0.0
 *
 * @package    Interactive_Map_Ph
 * @subpackage Interactive_Map_Ph/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Interactive_Map_Ph
 * @subpackage Interactive_Map_Ph/includes
 * @author     GILLESP <tkmdrhtt@yahoo.com>
 */
class Interactive_Map_Ph_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'interactive-map-ph',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
