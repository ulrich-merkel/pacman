/*global window*/
/*global document*/

/**
 * app.bootstrap
 *
 * @description
 * - init javascript plugins and functions after dom is ready
 *
 * @author
 * @version 0.1
 *
 * @namespace app
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 *
 */
(function (window, document, $, app, undefined) {
    'use strict';

    // local vars
    var $window = $(window),
		$html = $('html'),
        helpers = app.helpers,
        client = helpers.client,
        on = helpers.utils.on,
		hideStatusbar = client.hideStatusbar,
		isSupported;

    // document is ready
    $(document).ready(function () {

		// client depending init
        $html.removeClass('no-js').addClass('js');
		if (client.isMobile()) {
			$html.addClass('mobile');
			hideStatusbar();
			on(document, 'DOMContentLoaded', hideStatusbar);
			on(window, 'orientationchange', hideStatusbar);
		} else {
			$html.addClass('desktop');
		}

		// mobile fast clicks
		if (!!document.body) {
			new FastClick(document.body);
		}

		// check browser support
		isSupported = client.isChrome() || client.isSafari();
		if (!isSupported) {
			$('#layer-no-supported').show();
			return;
		}

		// start backbone
		app.marionette.start();

	});


}(window, document, window.jQuery, window.app || {}));