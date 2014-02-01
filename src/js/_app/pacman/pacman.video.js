/*global window*/

/**
 * app.pacman.video
 * 
 * @description
 * - Handle overlays and play video
 * 
 * @author
 * @copyright Copyright 2012: Kelley Reynolds, RubyScale
 * @version 0.1
 *
 * @namespace app
 *
 * @changelog
 * - 0.1 basic functions and module structur
 *
 * @requires
 * - app
 * - jQuery
 * - jQuery PubSub
 *
 * @see
 * - http://rubyscale.com/blog/2010/11/22/embedding-arbitrary-html-into-raphaeljs/
 * 
 * @bugs
 * - 
 *
 **/
(function ($, app) {

    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     * 
     * app is passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */

    // init module vars
    var log = app.helpers.utils.log,
        pacman = app.pacman || {},
        config = pacman.config || {},
        opts = {
            x: 0,
            y: 0,
            width: '200px',
            height: '100px'
        },
        attrs = {
            'fill': '#000'
        };

    /**
     *
     *
     * @constructor
     * @param {object} paper The raphael js paper object
     * @param {object} options The video options
     * @param {object} attributes The raphael js attributes
     */
    function Video(paper, options, attributes) {
        var self = this;

        self.paper = paper;
        self.opts = $.extend(true, {}, opts, config.video.opts, options);
        self.attrs = $.extend(true, {}, attrs, config.video.attrs, attributes);

        self.init();

    }


    /**
     *
     *
     * @interface
     */
    Video.prototype = {


        /**
         * render video
         *
         * @param {string} name The video name
         */
        playVideo: function (name) {

            // init local vars
            var self = this,
                html = [],
                $video;

            // check params and reset current video, not beauty but for the sake
            if (!name) {
                self.name = 'death';
            } else {
                self.name = name;
            }
            self.video = null;

            // generate html string
            //html.push('<video poster="assets/video/' + self.name + '.png">');
            html.push('<video>');
            html.push('<source src="assets/video/' + self.name + '.mp4" type=\'video/mp4; codecs="avc1.42E01E, mp4a.40.2"\'>');
            html.push('<source src="assets/video/' + self.name + '.ogv" type=\'video/ogg; codecs="theora, vorbis"\'>');
            html.push('<source src="assets/video/' + self.name + '.webm" type="video/webm">');
            //html.push('<source src="assets/video/' + self.name + '.3gp" type="video/3gpp; codecs="mp4v.20.8, samr">');
            html.push('</video>');

            // append video to dom
            $video = $(html.join(''));
            self.video = $video[0];
            self.$wrapper.empty().html($video);

            // listen to video events
            $video.on({

                /// hide video
                'click.video pause.video ended.video': function () {
                    log('video ended');
                    self.hide();
                },

                // fired when the browser tries to start loading
				'loadstart.video': function () {
					switch (self.video.networkState) {
					case (self.video.NETWORK_EMPTY): // 0
						log('video network - empty source');
						break;
					case (self.video.NETWORK_IDLE): // 1
						log('video network - video choosen and no download progress');
						break;
					case (self.video.NETWORK_LOADING): // 2
						log('video network - browser trying to load video');
						break;
					case (self.video.NETWORK_NO_SOURCE): // 3
						log('video network - no video source has been successfully loaded yet');
						break;
					default:
						break;
					}
				},

                'playing.video': function () {
                    log('video playing');
                },
                'timeupdate.video': function () {
                    log('video timeupdate');
                },
                // download progress
                'progress.video': function () {
					log('video loading progress');

                    self.loaded = 0;

					// try catch block due to possible indexSize error on this.audio.buffered
					try {
						if (self.video.buffered !== undefined && self.video.duration !== undefined) {
							self.loaded = parseInt(((self.video.buffered.end(0) / self.video.duration) * 100), 10);
							$.publish('video.progress', [self.loaded]);
						}
					} catch (e) {
						log('video loading progess - tryCatch catch: ' + e);
                    } finally {
						log('video loading progess - tryCatch finally');
					}
				},

                // enough audio is downloaded and ready to play, unsupported in opera 11
				'canplay.video': $.proxy(function () {
					log('video is ready to play');
                    self.video.currentTime = 0;
                    if (self.muted !== undefined) {
                        self.video.muted = self.muted;
                    }
                    if (!self.video.statusPlaying) {
                        self.video.play();
                        self.video.statusPlaying = true;
                    }
                    
				}, this),

                // error handling
                'error.video': function () {
					log('video error');
					//this.fallback();
				}

            });

        },


        /**
         * stop video 
         *
         */
        stopVideo: function () {
            var self = this,
                video = self.video;

            if (video) {
                video.pause();
                self.video.statusPlaying = false;
            }
        },


        /**
         * show overlay
         *
         */
        show: function (name) {

            var self = this;

            // show overlay and play video
            self.container.animate({opacity: 1}, 300, ">");
            self.$wrapper.fadeIn(300);
            self.playVideo(name);

            // trigger events
            $.publish('pacman.videoshow');
        },

        mute: function (value) {
            var self = this,
                video = self.video;

            if (!value) {
                value = true;
            }

            if (video) {
                video.muted = value;
            }

            self.muted = value;

        },


        /**
         * hide overlay
         *
         */
        hide: function () {

            var self = this;

            // hide overlay and stop video
            self.container.animate({opacity: 0}, 300, ">");
            self.$wrapper.fadeOut(300);
            self.stopVideo();

            // trigger events
            $.publish('pacman.videohide');
        },


        /**
         * handle overlay events
         *
         */
        bindEvents: function () {
            var self = this;

            //self.group.mouseup(function () {
            //    self.hide();
            //});

        self.group.mouseup(function () {
            alert("asd");
            //self.hide();
        });

        },


        /**
         * main function, init video
         *
         */
        init: function () {

            // init local vars
            var self = this,
                options = self.opts,
                containerId,
                parentNode;

            // set defaults
            self.x = options.x || 0;
            self.y = options.y || 0;
            self.width = options.width || self.paper.width;
            self.height = options.height || self.paper.height;

            // create container
            self.container = self.paper.rect(self.x, self.y, self.width, self.height).attr(self.attrs);

            /**
             * check for container id
             * 
             * take next parent if there is no id, useful to get
             * the jquery object from the raphael container
             */
            parentNode = self.container.node.parentNode.parentNode;
            containerId = parentNode.id || parentNode.parentNode.id;
            self.$container = $('#' + containerId);

            // create div
            self.$wrapper = $('<div class="video-wrapper"></div>').insertAfter(self.$container);

            // create group
            self.group = self.paper.set();
            self.group.push(self.container);
            self.group.push(self.$wrapper);

            // hide infobox
            self.container.attr({opacity: 0});
            self.$wrapper.hide();

            // run basic functions
            self.bindEvents();

            // don't show overlay on class init
            self.hide();

        }

    };


    // @export
    app.namespace('pacman.Video', Video);


}(window.jQuery, window.getNamespace()));
