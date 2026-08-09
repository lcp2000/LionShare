<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="lionshare-app" data-lionshare-app>
	<div class="lionshare-top-controls">
		<button class="ls-control" type="button" data-ls-action="language">Español</button>
		<button class="ls-control" type="button" data-ls-action="theme">Dark Mode</button>
	</div>

	<div class="lionshare-main">
		<section class="lionshare-preview" data-ls-preview hidden aria-live="polite">
			<h2 data-ls-text="previewTitle">Secure file viewer</h2>
			<div class="lionshare-file-meta" data-ls-file-meta></div>
			<div class="lionshare-timer" data-ls-timer hidden>
				<div><span data-ls-text="timeRemaining">Viewing time remaining:</span><strong data-ls-time>--:--</strong></div>
				<progress data-ls-life-bar value="100" max="100"></progress>
			</div>
			<div class="lionshare-file-content" data-ls-file-content></div>
		</section>

		<div class="lionshare-columns">
			<section class="lionshare-info">
				<div class="lionshare-brand">
					<img src="<?php echo esc_url( $settings['logo'] ); ?>" alt="<?php echo esc_attr( $settings['app_title'] ); ?>" data-ls-logo>
				</div>
				<p class="lionshare-highlight" data-ls-html="hook"></p>
				<p data-ls-html="description"></p>
				<p><strong data-ls-text="usesTitle"></strong></p>
				<ul>
					<li data-ls-html="use1"></li>
					<li data-ls-html="use2"></li>
					<li data-ls-html="use3"></li>
				</ul>
			</section>

			<section class="lionshare-send">
				<h2 data-ls-text="prepare">Prepare your files to send</h2>
				<div class="lionshare-control-group">
					<label data-ls-text="dropLabel">Drag files here or choose them below (1.5 GB maximum):</label>
					<div class="lionshare-drop-zone" data-ls-drop-zone tabindex="0" role="button">
						<span data-ls-drop-prompt>Drag files here or click to browse</span>
						<input type="file" data-ls-file-input multiple hidden>
						<div class="lionshare-limit" data-ls-limit hidden>
							<label data-ls-limit-label></label>
							<progress data-ls-limit-bar value="0" max="100"></progress>
							<ul data-ls-file-list></ul>
						</div>
					</div>
					<p class="lionshare-error" data-ls-error role="alert"></p>
				</div>

				<div class="lionshare-control-group">
					<label for="lionshare-expiry" data-ls-text="expiryLabel">Expiration time:</label>
					<select id="lionshare-expiry" data-ls-expiry>
						<option value="120" data-ls-text="expiry2">2 minutes</option>
						<option value="300" data-ls-text="expiry5">5 minutes</option>
						<option value="600" data-ls-text="expiry10">10 minutes</option>
					</select>
				</div>
				<button class="lionshare-button lionshare-button-primary" type="button" data-ls-action="generate" data-ls-text="generate">Generate secure link</button>
				<div data-ls-output aria-live="polite"></div>
			</section>
		</div>
	</div>

	<footer class="lionshare-footer">
		<span data-ls-footer></span>
		<button class="lionshare-link-button" type="button" data-ls-action="disclaimer" data-ls-text="disclaimerLink">Legal disclaimer</button>
	</footer>

	<div class="lionshare-modal" data-ls-modal hidden>
		<div class="lionshare-modal-content" role="dialog" aria-modal="true" aria-labelledby="lionshare-disclaimer-title">
			<button class="lionshare-modal-close" type="button" data-ls-action="close-modal" aria-label="Close">&times;</button>
			<h2 id="lionshare-disclaimer-title" data-ls-text="disclaimerTitle"></h2>
			<div data-ls-html="disclaimerBody"></div>
		</div>
	</div>
</div>
