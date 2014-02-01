/**
 * jQuery plugin styledCheckbox
 * @description replace checkbox input with images
 * @author hello@ulrichmerkel.com (Ulrich Merkel)
 * @version 0.1.3
 * 
 * @requires
 * - jQuery 1.7.2
 * - global config var
 * - jQuery touchclick plugin
 * 
 * @changelog
 * - 0.1.3 refactoring, touchclick removed
 * - 0.1.2 touchclick added, bug fix multiple checkboxes
 * - 0.1.1 setting unique id, bug fixes onload
 * - 0.1 basic functions and plugin structur
 *
 * @bugs
 * - 
 * 
 **/
(function ($, undefined) {
	'use strict';

	/**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     *
     * jquery is passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */


	/* create the defaults once */
    var pluginName = 'styledCheckbox',
        defaults = {
            selectors: {
				wrapperId: '#styledCheckbox',
				wrapperClass: '.styledCheckbox-wrapper',
				replacementClass: '.styledCheckbox',
				checkedClass: '.checked'
			}
        };


	/**
     * the actual plugin constructor
     *
     * @constructor
     * @param {object} element The dom object
     * @param {object} options The plugin options
     */
    function Plugin(element, options) {
		this.$elem = $(element);
		this.options = $.extend(true, {}, defaults, options);
        this.init();
    }

	/**
	 * plugin methods
	 *
	 * @interface
	 */
	Plugin.prototype = {

		 /**
         * render styled replace
         */
		renderReplace: function () {

			var self = this,
				opts = self.options,
				sel = opts.selectors,
				$elem = self.$elem,
				$wrapper,
				$replacement,
				$parent,
				parentOffset,
				$label;

			// store label for later use
			$label = $elem.next('label');
			self.$label = $label;

			// render replace element
			$parent = $elem.parent();
			parentOffset = $parent.offset();
			$wrapper = $('<div>', {
				'id': sel.wrapperId.substr(1) + '-' + parentOffset.top + '-' + parentOffset.left,
				'class': sel.wrapperClass.substr(1)
			});
			$replacement = $('<div>', {
				'class': sel.replacementClass.substr(1)
			});

			// check for checked state
			if ($elem.attr('checked') === 'checked') {
				$replacement.addClass(sel.checkedClass.substr(1));
			}

			// append it to dom and set plugin reference
			$wrapper
				.append($elem)
				.append($replacement)
				.prependTo($parent);

			self.$replacement = $replacement;

		},


        /**
         * handle events
         */
		events: function () {

			var self = this;

			self.$replacement.on({
				'click.styledCheckbox touchstart.styledCheckbox': $.proxy(function () {
					self.toggleChecked();
				}, self)
			});
			self.$label.on({
				'click.styledCheckbox touchstart.styledCheckbox': $.proxy(function (e) {
					e.preventDefault();
					self.toggleChecked();
				}, self)
			});
		},


		/**
         * toggle checked on and off
         *
         */
        toggleChecked: function () {

            var self = this,
				optsClass = self.options.selectors.checkedClass.substr(1),
				$elem = self.$elem,
				$replacement = self.$replacement;

            if ($replacement.hasClass('checked')) {
				$elem.removeAttr('checked');
				$replacement.removeClass(optsClass);
			} else {
				$elem.attr('checked', 'checked');
				$replacement.addClass(optsClass);
			}

        },


		/**
         * main function, init plugin
         *
         */
		init: function () {

			this.renderReplace();
			this.events();

		}

	};


	/**
	 * a really lightweight plugin wrapper around the constructor,
     * preventing against multiple instantiations
     */
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
        });
    };

}(window.jQuery));