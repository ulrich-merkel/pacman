/*global window, document*/

/**
 * app.pacman.audio
 * 
 * @description
 * - Handle background audio
 * 
 * @author
 * @copyright 
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
 * - 
 * 
 * @bugs
 * - 
 *
 **/
(function (document, $, app) {

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
        defaults = {
        };


    log = function () {};
    /**
     *
     *
     * @constructor
     * @param {object} $element The jquery wrapper
     * @param {object} options The audio options
     */
    function Audio($element, options) {
        var self = this;

        self.$el = $element;
        self.opts = $.extend(true, {}, defaults, config.audio.opts, options);
        self.muted = options.muted;

        self.init();

    }


    /**
     *
     *
     * @interface
     */
    Audio.prototype = {

        /**
         * render source element for audio
         *
         */
        renderSource: function (src, type) {
            var source = document.createElement('source');
            switch (type) {
            case 'audio/ogg':
                source.src = src + '.ogg';
                break;
            case 'audio/mpeg':
                source.src = src + '.mp3';
                break;
            case 'audio/x-wav':
                source.src = src + '.wav';
                break;
            default:
                break;
            }
            source.type = type;
            source.media = 'all';
            return source;
        },


        /**
         * load audio track
         *
         * @param {string} name The unique audio track name
         * @param {string} src The optional src path
         */
        loadAudio: function (name, src) {

            var self = this,
                track;

            // check if audio track is already present
            if (!self.tracks[name]) {

                // init track object
                self.tracks[name] = track = {};

                // create html5 audio element
                track.audio = document.createElement('audio');
                track.$audio = $(track.audio);
                track.$audio.appendTo(self.$el);

                // check src param and set default
                if (!src) {
                    src = 'assets/audio/' + name;
                }

                // render audio sources
                track.$audio.prepend(self.renderSource(src, 'audio/x-wav'));
                track.$audio.prepend(self.renderSource(src, 'audio/mpeg'));
                track.$audio.prepend(self.renderSource(src, 'audio/ogg'));

                // handle audio events
                track.$audio.on({

                    // fired when the browser tries to start loading
                    'loadstart.audio': function () {
                        log('audio loadstart');

                        track.loaded = 0;

                        switch (track.audio.networkState) {
                        case (track.audio.NETWORK_EMPTY): // 0
                            log('audio network - empty source');
                            break;
                        case (track.audio.NETWORK_IDLE): // 1
                            log('audio network - audio choosen and no download');
                            break;
                        case (track.audio.NETWORK_LOADING): // 2
                            log('audio network - browser trying to load audio');
                            break;
                        case (track.audio.NETWORK_NO_SOURCE): // 3
                            log('audio network - no source has been successfully loaded yet');
                            break;
                        default:
                            break;
                        }
                    },

                    // fired when meta data has arrived
                    'loadedmetadata.audio': function () {
                        log('audio loadedmetadata');
                    },

                    // fired when first data is loaded
                    'loadeddata.audio': function () {
                        log('audio loadeddata');
                    },

                    // download progress
                    'progress.audio': function () {
                        log('audio progress');

                        track.loaded = 0;

                        // try catch block due to possible indexSize error on this.audio.buffered
                        try {
                            if (track.audio.buffered !== undefined && track.audio.duration !== undefined) {
                                track.loaded = parseInt(((track.audio.buffered.end(0) / track.audio.duration) * 100), 10);
                                $.publish('audio.progress', [track.loaded]);
                            }
                        } catch (e) {
                            log('audio progess - tryCatch catch: ' + e);
                        } finally {
                            log('audio progess - tryCatch finally');
                        }
                    },

                    // enough audio is downloaded and ready to play, unsupported in opera 11
                    'canplay.audio': function () {
                        log('audio can play');
                        track.audio.play();
                    },

                    // timing while playing
                    'timeupdate.audio': function () {
                        log('audio timeupdate');
                        track.audio.muted = self.muted;
                    },

                    // audio is playing
                    'play.audio': function () {
                        log('audio playing');
                        track.audio.muted = self.muted;
                    },

                    // audio is paused
                    'pause.audio': function () {
                        log('audio pause ended');
                    },

                    // audio is paused or at the end
                    'pause.audio ended.audio': function () {
                        log('audio pause ended');
                    },

                    // audio is ended
                    'ended.audio': function () {
                        log('audio ended');
                    },

                    // waiting for data to download */
                    'waiting.audio ': function () {
                        log('audio waiting for data');
                    },

                    // audio is suspended to save bandwidth, unsupported in opera */
                    'suspend.audio ': function () {
                        log('audio suspend');
                    },

                    // event is fired if the server stop giving data, unsupported in opera */
                    'stalled.audio ': function () {
                        log('audio stalled');
                    },

                    // error handling */
                    'error.audio': function () {
                        log('audio error');
                    },

                    // the user abort the download or audio
                    'abort.audio': function () {
                        log('audio abort');
                    }

                });
            }

        },


        /**
         * play audio track
         *
         * @param {string} name The audio track to play
         */
        play: function (name) {

            var self = this,
                track;

            if (self.tracks[name]) {
                track = self.tracks[name];
                track.audio.play();
            } else {
                self.loadAudio(name);
            }

        },


        /**
         * stop audio track
         *
         * @param {string} name The optional audio track to stop, otherwise all tracks will be stopped
         */
        stop: function (name) {

            var self = this;

            if (!!name && self.tracks[name]) {
                self.tracks[name].audio.stop();
            } else {
                if (self.tracks.length) {
                    $.each(function (index, track) {
                        track.audio.pause();
                    });
                }
            }

        },


        /**
         * play audio track
         *
         * @param {string} name The optional audio track to mute, otherwise all tracks will be muted
         * @param {boolean} value Whether to mute the audio or not
         */
        mute: function (name, value) {

            var self = this,
                track;

            if (!value) {
                value = true;
            }

            if (!!name && self.tracks[name]) {
                track = self.tracks[name];
                track.audio.muted = value;
            } else {
                if (self.tracks.length) {
                    $.each(function (index, track) {
                        track.audio.muted = value;
                    });
                }
            }

            self.muted = value;
        },


        /**
         * init audio functions
         *
         */
        init: function () {

            var self = this;

            if (!self.$el || !self.$el.length) {
                self.$el = $('<div class="audio-wrapper"></div>').appendTo($('body'));
            }
            self.tracks = {};

        }

    };


    // @export
    app.namespace('pacman.Audio', Audio);


}(document, window.jQuery, window.getNamespace()));
