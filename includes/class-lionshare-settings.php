<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class LionShare_Settings {
	private static $instance;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	public function add_menu() {
		add_options_page(
			__( 'LionShare Settings', 'lionshare' ),
			__( 'LionShare', 'lionshare' ),
			'manage_options',
			'lionshare',
			array( $this, 'render_page' )
		);
	}

	public function register_settings() {
		register_setting(
			'lionshare_settings_group',
			'lionshare_settings',
			array(
				'type'              => 'array',
				'sanitize_callback' => array( $this, 'sanitize' ),
				'default'           => LionShare::defaults(),
			)
		);
	}

	public function sanitize( $input ) {
		$defaults = LionShare::defaults();
		$output   = array();
		$output['app_title'] = ! empty( $input['app_title'] ) ? sanitize_text_field( $input['app_title'] ) : $defaults['app_title'];
		foreach ( array( 'app_icon', 'favicon', 'logo' ) as $key ) {
			$output[ $key ] = ! empty( $input[ $key ] ) ? esc_url_raw( $input[ $key ] ) : $defaults[ $key ];
		}
		return $output;
	}

	public function enqueue_admin_assets( $hook ) {
		if ( 'settings_page_lionshare' !== $hook ) {
			return;
		}
		wp_enqueue_media();
		wp_enqueue_style( 'lionshare-admin', LIONSHARE_URL . 'assets/css/admin.css', array(), LIONSHARE_VERSION );
		wp_enqueue_script( 'lionshare-admin', LIONSHARE_URL . 'assets/js/admin.js', array( 'jquery' ), LIONSHARE_VERSION, true );
		wp_localize_script( 'lionshare-admin', 'LionShareAdmin', array( 'defaults' => LionShare::defaults() ) );
	}

	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$settings = LionShare::settings();
		?>
		<div class="wrap lionshare-admin-wrap">
			<h1><?php esc_html_e( 'LionShare Settings', 'lionshare' ); ?></h1>
			<p><?php esc_html_e( 'Use the shortcode [lionshare] on any page. Brand changes apply everywhere the shortcode appears.', 'lionshare' ); ?></p>
			<form method="post" action="options.php">
				<?php settings_fields( 'lionshare_settings_group' ); ?>
				<div class="lionshare-settings-card">
					<div class="lionshare-field">
						<label for="lionshare-app-title"><?php esc_html_e( 'App title', 'lionshare' ); ?></label>
						<input id="lionshare-app-title" class="regular-text" name="lionshare_settings[app_title]" type="text" value="<?php echo esc_attr( $settings['app_title'] ); ?>" required>
						<p class="description"><?php esc_html_e( 'Shown in the browser title, interface copy, footer, and accessibility labels.', 'lionshare' ); ?></p>
					</div>
					<?php
					$this->media_field( 'logo', __( 'Logo', 'lionshare' ), $settings['logo'], __( 'Recommended: a transparent horizontal PNG, or an SVG when your site permits SVG uploads.', 'lionshare' ) );
					$this->media_field( 'app_icon', __( 'App icon', 'lionshare' ), $settings['app_icon'], __( 'Recommended: a square 512 × 512 PNG.', 'lionshare' ) );
					$this->media_field( 'favicon', __( 'Favicon', 'lionshare' ), $settings['favicon'], __( 'Recommended: a square PNG, SVG, or ICO.', 'lionshare' ) );
					?>
				</div>
				<?php submit_button( __( 'Save LionShare Settings', 'lionshare' ) ); ?>
			</form>
		</div>
		<?php
	}

	private function media_field( $key, $label, $value, $description ) {
		?>
		<div class="lionshare-field lionshare-media-field" data-key="<?php echo esc_attr( $key ); ?>">
			<label for="lionshare-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></label>
			<div class="lionshare-media-row">
				<img class="lionshare-media-preview" src="<?php echo esc_url( $value ); ?>" alt="">
				<div>
					<input id="lionshare-<?php echo esc_attr( $key ); ?>" class="regular-text lionshare-media-url" name="lionshare_settings[<?php echo esc_attr( $key ); ?>]" type="url" value="<?php echo esc_url( $value ); ?>">
					<p>
						<button type="button" class="button lionshare-choose-media"><?php esc_html_e( 'Choose image', 'lionshare' ); ?></button>
						<button type="button" class="button-link lionshare-reset-media"><?php esc_html_e( 'Use default', 'lionshare' ); ?></button>
					</p>
				</div>
			</div>
			<p class="description"><?php echo esc_html( $description ); ?></p>
		</div>
		<?php
	}
}
