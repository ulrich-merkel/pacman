/*global window*/
/*global document*/

/**
 * jQuery plugin fullscreen
 * 
 * @description
 * - toggle fullscreen mode if available
 * 
 * @author hello@ulrichmerkel.com (Ulrich Merkel)
 * @version 0.1.2
 * 
 * @requires
 * - jQuery 1.8.2
 *
 * @see
 * -
 * 
 * @changelog
 * - 0.1.2 added namespace interface
 * - 0.1.1 refactoring
 * - 0.1 basic functions
 *
 * @bugs
 * - 
 * 
 */
(function (document, $, ns, undefined) {

    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     *
     * window, jquery and app are passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */

    /**
     * extend options with defaults, global vars
     * 
     */
    var docElm = document.documentElement,
        boolIsSupported,
        opts;


    /**
     * check support
     *
     * @param {boolean} Whether fullscreen is supported or not
     */
    function isSupported() {
        if (boolIsSupported === undefined) {
            boolIsSupported = !!docElm && (!!docElm.requestFullscreen || !!docElm.mozRequestFullScreen || !!docElm.webkitRequestFullScreen);
        }
        return boolIsSupported;
    }


    /**
     * check is fullscreen active
     *
     * @param {boolean} Whether fullscreen is active or not
     */
    function isFullscreenActive() {
        return !!document.fullScreen || !!document.mozFullScreen || !!document.webkitIsFullScreen;
    }


    /**
     * enter fullscreen mode
     * 
     */
    function enter() {
        // check vendor prefixes
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
    }


    /**
     * exit fullscreen mode
     * 
     */
    function exit() {
        // check vendor prefixes
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }


    /**
     * custom change event handler
     * 
     */
    function change() {
        
    }


    /**
     * toggle fullscreen mode
     * 
     */
    function fullscreen() {
        var $btn = $('.button-game-fullscreen'),
            $label = $btn.find('.button-label'),
            $icon = $btn.find('.icomoon');

        if (isSupported()) {
            if (isFullscreenActive()) {
                exit();
                $label.text('Fullscreen On');
                $icon.removeClass('icon-contract').addClass('icon-expand');
            } else {
                enter();
                $label.text('Fullscreen Off');
                $icon.addClass('icon-contract').removeClass('icon-expand');
            }
        }
    }

    /**
     * global namespace export
     *
     * @export
     */
    ns.namespace('plugins.fullscreen', fullscreen);


    /**
     * $.fn.fullscreen
     *
     * jquery plugin wrapper
     *
     * @param {} args
     * @param {} cb
     */
    $.fn.fullscreen = function (args, cb) {

        /**
         * init defaults
         * 
         */
        $.fn.fullscreen.defaults = {
            sel: {
                elem: '.btn-fullscreen'
            }
        };


        /**
         * extend options with defaults
         * 
         */
        opts = $.extend(true, {}, $.fn.fullscreen.defaults, args, {cb: cb});


        /**
         * bind events
         *
         * @param {object} $obj The jQuery object
         */
        function bindEventHandlers($obj) {

            // fullscreen events
            var $doc = $(document);
            $doc.bind('fullscreenchange', change);
            $doc.bind('mozfullscreenchange', change);
            $doc.bind('webkitfullscreenchange', change);

            // btn click
            $obj.bind({
                'click.fullscreen': function (e) {
                    e.preventDefault();
                    fullscreen();
                }
            });

        }


        /**
         * main function, init plugin
         *
         * @param {object} opts The plugin options
         * @param {object} obj The plugin selector object
         */
        function initialize(opts, $obj) {

            if (!$obj.length) {
                return;
            }

            // check for support
            if (isSupported()) {

                $obj.show();

                // check init state
                var data = $obj.data('fullscreen');
                if (!data) {

                    // setup functions
                    bindEventHandlers($obj);
                    $obj.data('fullscreen', 'initialized');

                }
            } else {
                $obj.hide();
            }

            // check for callback function
            if ($.isFunction(opts.cb)) {
                opts.cb.call();
            }

        }


        /**
         * return this for chaining and run
         * initialize function, allow multiple items via each
         */
        return this.each(function () {
            initialize(opts, $(this));
        });

    };

}(document, window.jQuery, window.getNamespace()));