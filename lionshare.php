<?php
/**
 * Plugin Name: LionShare File Sharing Utility
 * Plugin URI:  https://nucleardynamics.com/lionshare/
 * Description: Privacy-first, browser-to-browser file sharing with expiring links, previews, QR codes, and white-label branding.
 * Version:     1.0.0
 * Author:      NuclearDynamics.com
 * License:     MIT
 * License URI: https://opensource.org/license/mit
 * Text Domain: lionshare
 * Requires at least: 6.2
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LIONSHARE_VERSION', '1.0.0' );
define( 'LIONSHARE_FILE', __FILE__ );
define( 'LIONSHARE_DIR', plugin_dir_path( __FILE__ ) );
define( 'LIONSHARE_URL', plugin_dir_url( __FILE__ ) );

require_once LIONSHARE_DIR . 'includes/class-lionshare.php';
require_once LIONSHARE_DIR . 'includes/class-lionshare-settings.php';

register_activation_hook( __FILE__, array( 'LionShare', 'activate' ) );

LionShare::instance();
LionShare_Settings::instance();
