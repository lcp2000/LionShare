(function ($) {
	'use strict';

	$('.lionshare-media-field').each(function () {
		const field = $(this);
		const key = field.data('key');
		const input = field.find('.lionshare-media-url');
		const preview = field.find('.lionshare-media-preview');
		let frame;

		field.find('.lionshare-choose-media').on('click', function (event) {
			event.preventDefault();
			if (frame) {
				frame.open();
				return;
			}
			frame = wp.media({
				title: 'Choose LionShare image',
				button: { text: 'Use this image' },
				library: { type: 'image' },
				multiple: false
			});
			frame.on('select', function () {
				const image = frame.state().get('selection').first().toJSON();
				input.val(image.url).trigger('change');
				preview.attr('src', image.url);
			});
			frame.open();
		});

		field.find('.lionshare-reset-media').on('click', function (event) {
			event.preventDefault();
			const defaultUrl = LionShareAdmin.defaults[key];
			input.val(defaultUrl).trigger('change');
			preview.attr('src', defaultUrl);
		});

		input.on('input', function () {
			preview.attr('src', input.val());
		});
	});
})(jQuery);
