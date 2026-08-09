<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class LionShare {
	private static $instance;
	private $assets_enqueued = false;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_shortcode( 'lionshare', array( $this, 'render_shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'maybe_enqueue_assets' ) );
		add_action( 'wp_head', array( $this, 'print_brand_head' ), 100 );
		add_filter( 'document_title_parts', array( $this, 'filter_document_title' ) );
	}

	public function maybe_enqueue_assets() {
		if ( $this->page_has_app() ) {
			$this->enqueue_assets();
		}
	}

	public static function defaults() {
		return array(
			'app_title' => 'LionShare',
			'app_icon'  => LIONSHARE_URL . 'assets/images/lionshare-icon.png',
			'favicon'   => LIONSHARE_URL . 'assets/images/lionshare-favicon.png',
			'logo'      => LIONSHARE_URL . 'assets/images/lionshare-logo.png',
		);
	}

	public static function activate() {
		if ( false === get_option( 'lionshare_settings', false ) ) {
			add_option( 'lionshare_settings', self::defaults() );
		}
	}

	public static function settings() {
		return wp_parse_args( (array) get_option( 'lionshare_settings', array() ), self::defaults() );
	}

	private function page_has_app() {
		if ( ! is_singular() ) {
			return false;
		}
		$post = get_queried_object();
		return $post instanceof WP_Post && has_shortcode( $post->post_content, 'lionshare' );
	}

	public function filter_document_title( $parts ) {
		if ( $this->page_has_app() ) {
			$settings       = self::settings();
			$parts['title'] = $settings['app_title'];
		}
		return $parts;
	}

	public function print_brand_head() {
		if ( ! $this->page_has_app() ) {
			return;
		}
		$settings = self::settings();
		if ( ! empty( $settings['favicon'] ) ) {
			printf( "\n<link rel=\"icon\" href=\"%s\" sizes=\"any\">\n", esc_url( $settings['favicon'] ) );
		}
		if ( ! empty( $settings['app_icon'] ) ) {
			printf( "<link rel=\"apple-touch-icon\" href=\"%s\">\n", esc_url( $settings['app_icon'] ) );
		}
	}

	private function enqueue_assets() {
		if ( $this->assets_enqueued ) {
			return;
		}

		$css_version = (string) filemtime( LIONSHARE_DIR . 'assets/css/app.css' );
		$js_version  = (string) filemtime( LIONSHARE_DIR . 'assets/js/app.js' );

		wp_enqueue_style( 'lionshare-app', LIONSHARE_URL . 'assets/css/app.css', array(), $css_version );
		wp_enqueue_script( 'lionshare-peerjs', LIONSHARE_URL . 'assets/vendor/peerjs.min.js', array(), '1.5.5', true );
		wp_enqueue_script( 'lionshare-jszip', LIONSHARE_URL . 'assets/vendor/jszip.min.js', array(), '3.10.1', true );
		wp_enqueue_script( 'lionshare-qrcode', LIONSHARE_URL . 'assets/vendor/qrcode.min.js', array(), '1.0.0', true );
		wp_enqueue_script(
			'lionshare-app',
			LIONSHARE_URL . 'assets/js/app.js',
			array( 'lionshare-peerjs', 'lionshare-jszip', 'lionshare-qrcode' ),
			$js_version,
			true
		);

		$settings = self::settings();
		wp_localize_script(
			'lionshare-app',
			'LionShareConfig',
			array(
				'title'      => $settings['app_title'],
				'logo'       => $settings['logo'],
				'icon'       => $settings['app_icon'],
				'version'    => LIONSHARE_VERSION,
				'pageUrl'    => get_permalink(),
				'peerConfig' => apply_filters( 'lionshare_peer_config', array() ),
			)
		);

		$this->assets_enqueued = true;
	}

	public function render_shortcode( $atts = array() ) {
		$this->enqueue_assets();
		$settings = self::settings();
		ob_start();
		include LIONSHARE_DIR . 'templates/app.php';
		return ob_get_clean();
	}
}
