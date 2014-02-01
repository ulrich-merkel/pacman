/**
 * jQuery plugin tooltip
 * @description set mouseover tooltip
 * @author hello@ulrichmerkel.com (Ulrich Merkel)
 * @version 0.4.7
 * 
 * @requires
 * - jQuery 1.7.1
 * - global cfg var
 * - jQuery app.helper functions
 * 
 * @changelog
 * - 0.4.7 bug fixes if title string is empty
 * - 0.4.6 bug fixes
 * - 0.4.5 new config sel
 * - 0.4.4 new hideTooltip function
 * - 0.4.3 refactoring, stay in viewport added
 * - 0.4.2 changed global client to app
 * - 0.4.1 bug fixes if no attribute is available
 * - 0.4 bug fixes
 * - 0.3 removed coding overhead
 * - 0.2 bug fixes
 * - 0.1 basic functions and plugin structur
 *
 * @bugs
 * - check if tooltip position is not null
 * - check position to stay in viewport
 * - performance (delagate, save objects)
 * 
 **/
(function (window, document, $, app) {
	'use strict';

	$.fn.tooltip = function (arg, callback) {

		/* defaults */
		$.fn.tooltip.defaults = {
			sel: {
				elem: '.tooltip',
				tooltipId: '#tooltip',
				attrSelector: 'title'
			},
			fadeTime: 300,
			delay: 500,
			boxOffsetX: -60,
			boxOffsetY: -20,
			replaceString: ''
		};

		/* extend options with defaults, global vars for mouseEvent Listener */
		var options = $.extend(true, $.fn.tooltip.defaults, arg, {callback: callback}),
			newEventX = 0,
			newEventY = 0,
			timeout,
			client = app.helpers.client;

		/* init callback */
		function callFn(callback) {
			if ($.isFunction(callback)) {
				callback.call();
			}
		}

		/* grab Attribute */
		function grabAttr(obj) {
			obj.each(function () {
				var $this = $(this),
					attr = options.sel.attrSelector,
					titleString =  $this.attr(attr),
                    data = null;

				if (!titleString) {
					titleString = $this.data(attr);
				}
				if (titleString) {
					data = $.data(this, attr, titleString.replace(options.replaceString, ''));
					$this.removeAttr(attr);
				}
			});
		}

		/* get position to stay in viewport */
		function getPosition(tooltip) {
			var $document = $(document),
				docWidth = $document.width(),
				docHeight = $document.height(),
				left = 0,
				top = 0;

			/* check horizontal */
			if (newEventX + tooltip.width + options.boxOffsetX > docWidth) {
				left = docWidth - tooltip.width;
			} else if (newEventX + options.boxOffsetX < 0) {
				left = 0;
			} else {
				left = newEventX + options.boxOffsetX;
			}

			/* check vertical */
			if (newEventY + tooltip.height + options.boxOffsetY > docHeight) {
				top = newEventY - tooltip.height - 10;
			} else if (newEventY + options.boxOffsetY < 0) {
				top = 0;
			} else {
				top = newEventY + options.boxOffsetY;
			}

			return {
				left: left,
				top: top
			};
		}

		/* show function */
		function showTooltip(content) {
			var $tooltip,
				tooltip = {},
				sel = options.sel.tooltipId,
				position;

			$tooltip = $('<div>', {
				id: sel.substr(1),
				css: {
					position: 'absolute',
					width: options.boxWidth,
					height: options.boxHeight,
					display: 'none'
				},
				html: content
			}).appendTo('body');

			tooltip = {
				width: $tooltip.outerWidth(true),
				height: $tooltip.outerHeight(true)
			};

			/* fix for older browsers when they don't init mouseposition after window load correctly */
			position = getPosition(tooltip);
			if (position.left === 0 && position.right === 0) {
				return;
			}

			$tooltip.css(position).fadeIn(options.fadeTime);
		}

		/* hide function */
		function hideTooltip() {
			$(options.sel.tooltipId).fadeOut(
				options.fadeTime,
				function () {
					$(this).remove();
				}
			);
			window.clearTimeout(timeout);
		}

		/* bind or unbind mouseenter mouseleave mousemove events */
		function bindEventHandlers(obj) {
			var sel = options.sel,
				tooltipId = sel.tooltipId,
				attr = sel.attrSelector,
				tooltip = {},
				data;

			obj.each(function () {
				$(this).bind({
					'mouseenter.tooltip': function () {
						data = $.data(this, attr);

						if (!data) {
							grabAttr(this);
						}
						if ($(tooltipId).css("opacity") !== 0) {
							$(tooltipId).stop().remove();
						}
						if (data) {
							timeout = window.setTimeout(function () { showTooltip(data); }, options.delay);
							data = $.data(this, attr);
						}
						
					},
					'mouseleave.tooltip': function () {
						hideTooltip();
					},
					'mousemove.tooltip': function (evt) {
						tooltip = {
							width: $(tooltipId).outerWidth(true),
							height: $(tooltipId).outerHeight(true)
						};
						newEventX = evt.pageX;
						newEventY = evt.pageY;
						$(tooltipId).css(getPosition(tooltip));
					}
				});
			});
			$(window).bind({
				'scrolling': function () {
					hideTooltip();
				}
			});
		}

		/* main function */
		function initialize(opts, obj) {
			if (!obj.length || client.isMobile()) {
				return;
			}
			grabAttr(obj);
			bindEventHandlers(obj);
			callFn(opts.callback);
		}

		/* return public functions and chaining */
		return this.each(function () {
			//initialize(options, $(this));
		});
	};

	$.fn.tooltip.destroy = function (obj, options) {
		if (!$(obj).length) {
			return;
		}
		$('#tooltip').remove();
		$(obj).each(function () {
			$(this).unbind('mouseenter.tooltip mouseleave.tooltip mousemove.tooltip');
		});
	};

}(window, document, window.jQuery, window.getNamespace()));