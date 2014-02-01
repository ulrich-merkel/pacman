/*global window*/

/**
 * app.backbone.layout
 *
 * @description
 * -  a hybrid of an ItemView and a collection of Region objects
 *
 * @author Ulrich Merkel, 2013
 * @version 0.1
 *
 * @namespace app
 *
 * @requires
 * - namespace helpers
 * - Backbone
 * - Backbone.Marionette
 *
 * @see
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.layout.md
 * - https://github.com/marionettejs/backbone.marionette/wiki/Use-cases-for-the-different-views
 * - http://stackoverflow.com/questions/10521266/whats-the-difference-between-a-marionette-layout-and-a-region
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.region.md
 *
 * - http://ozkatz.github.io/avoiding-common-backbonejs-pitfalls.html
 * - http://www.codebeerstartups.com/2012/12/9-collection-views-in-backbone-js-learning-backbone-js/
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 * 
 * @bugs
 * -
 * 
 */
(function (Backbone, $, ns, undefined) {

    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     * 
     * Backbone and namespace are passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */

    // module vars
    var Layout = {},
        layoutCallback,
        $content = $('#content'),
        pacman = ns.pacman;


    /**
     * ----------------------------------------
     * Header Content
     * ----------------------------------------
     */


    /**
     * Standard Header
     *
     */
    Layout.Header = Backbone.Marionette.ItemView.extend({

        // set layout js template
        template: '#template-layout-header',

        // set tag to be rendered as content wrapper
        tagName: 'h1',

        // template helpers for js template
        templateHelpers: {

            showHeadline: function () {

                /**
                 * this.name is a model property
                 */
                return this.name;

            }

        },

        // initialize layout
        initialize: function (options) {

            var self = this;

            /**
             * set jquery dom helper
             *
             * this seems to don't work as instance property via $el: $(this.el) on marionette views
             * when we don't work with marionette modules and handle custom namespace functions
             */
            self.$el = $(self.el);

        },

        // callback after layout is shown, before render
        onShow: function () {
        },

        // callback after layout is rendered
        onRender: function () {
            this.$el.find('.tooltip').tooltip();
        }

    });


    /**
     * ----------------------------------------
     * Main Content
     * ----------------------------------------
     */


    /**
     * Intro Content
     *
     */
    Layout.Intro = Backbone.Marionette.Layout.extend({

        // set layout js template
        template: '#template-layout-intro',

        // set tag to be rendered as content wrapper
        tagName: 'nav',

        // template helper functions for js template
        templateHelpers: {
        },

        // handle layout events, elements will be wrapped by this.el
        events: {
            'click .button-game-pacman': 'onClickButtonGamePacman'
        },

        // handle button click event
        onClickButtonGamePacman: function (e) {
            e.preventDefault();
            $('#region-footer .button-game-pacman').trigger('click');
        },

        // initialize layout
        initialize: function (options) {

            var self = this;

            /**
             * set jquery dom helper
             *
             * this seems to don't work as instance property via $el: $(this.el) on marionette views
             * when we don't work with marionette modules and handle custom namespace functions
             */
            self.$el = $(self.el);

            self.$el.addClass('row center');

        },

        // callback after layout is shown, before render
        onShow: function () {
        },

        // callback after layout is rendered
        onRender: function () {
            this.$el.find('.tooltip').tooltip();
            $content.removeClass('loading');
        },

        // callback before layout is closed
        onBeforeClose: function () {
            $content.addClass('loading');
        }

    });


    /**
     * Pacman Content
     *
     */
    Layout.Pacman = Backbone.Marionette.Layout.extend({

        // set layout js template
        template: '#template-layout-pacman',

        // define subregions within current layout, needs to be present in js template
        regions: {
            game: "#game",
            intro: "#score"
        },

        // template helper functions for js template
        templateHelpers: {
        },

        // initialize layout
        initialize: function (options) {

            var self = this;

            /**
             * set jquery dom helper
             *
             * this seems to don't work as instance property via $el: $(this.el) on marionette views
             * when we don't work with marionette modules and handle custom namespace functions
             */
            self.$el = $(self.el);

        },

        // callback after layout is shown, before render
        onShow: function () {

            var pacman = ns.pacman,
                config = pacman.config,
                fullscreen = false,
                tileSize = $('#region-main').width() / config.playField[pacman.stats.getLevelString()].width,
                time = 0,
                callback = function () {
                    tileSize = $('#region-main').width() / config.playField[pacman.stats.getLevelString()].width;
                    config.tileSize = tileSize;
                    pacman.initialize();

                    if (fullscreen) {
                        $('#fullscreen').show();
                        $('#fullscreen button').on({
                            'click': function () {
                                pacman.pause(true);
                                $('#reveal-game-exit-fullscreen').reveal();
                            }
                        });
                    } else {
                        $('#fullscreen').hide();
                    }

                    $.subscribe('pacman.end', function () {
                        ns.marionette.controller.highscore();
                        $('#region-footer .button').removeClass('disabled');
                        $('#region-footer .button[href=#highscore]').addClass('disabled');
                    });
                };

            if (app.marionette.controller.modelConfig.get('fullscreen')) {
                time = 1500;
                app.plugins.fullscreen();
                fullscreen = true;
            }

            window.setTimeout(callback, time);

        },

        // callback after layout is rendered
        onRender: function () {
            $content.addClass('pacman').removeClass('loading');
        },

        // callback before layout is closed
        onBeforeClose: function () {
            $content.removeClass('pacman').addClass('loading');
            ns.pacman.destroy();
        }

    });


    /**
     * Highscore Content
     *
     */
    Layout.Highscore = Backbone.Marionette.Layout.extend({

        // set layout js template
        template: '#template-layout-highscore',

        // define subregions within current layout, needs to be present in js template
        regions: {
            list: "#list-highscore"
        },

        // set tag to be rendered as content wrapper
        tagName: "div",

        // template helper functions for js template
        templateHelpers: {
        },

        // handle layout events, elements will be wrapped by this.el
        events: {
            'click .button-game-pacman': 'onClickButtonGamePacman'
        },

        // handle button click
        onClickButtonGamePacman: function (e) {
            e.preventDefault();
            $('#region-footer .button-game-pacman').trigger('click');
        },

        // initialize layout
        initialize: function (options) {

            var self = this;

            /**
             * set jquery dom helper
             *
             * this seems to don't work as instance property via $el: $(this.el) on marionette views
             * when we don't work with marionette modules and handle custom namespace functions
             */
            self.$el = $(self.el);

        },

        // callback after layout is rendered
        onShow: function () {

            var self = this,
                marionette = ns.marionette,
                store = marionette.store,
                scores = pacman.stats.getStore(),
                highscoresSaved,
                highscoresRendered,
                highscoresCounter = 1,
                view;

            if (scores) {
                highscoresSaved = new marionette.collections.Highscore(scores);

                // set item counter
                highscoresRendered = highscoresSaved.map(function (model) {
                    return {
                        counter: highscoresCounter++,
                        name: model.get('name'),
                        points: model.get('points')
                    }
                });

            } else {
                highscoresRendered = [{
                    name: 'There are no results saved yet',
                    points: 0
                }];
            }

            // set view
            view = new marionette.views.Highscore({
                collection: new marionette.collections.Highscore(highscoresRendered)
            });

            // display filtered and sorted highscores
            self.list.show(view);

        },

        // callback after layout is rendered
        onRender: function () {
            this.$el.find('.tooltip').tooltip();
            $content.removeClass('loading');
        },

        // callback before layout is closed
        onBeforeClose: function () {
            $content.addClass('loading');
        }

    });


    /**
     * ----------------------------------------
     * Footer Content
     * ----------------------------------------
     */


    /**
     * Standard Footer
     *
     */
    Layout.Footer = Backbone.Marionette.Layout.extend({

        // set layout js template
        template: '#template-layout-footer',

        // set tag to be rendered as content wrapper
        tagName: "nav",

        // handle layout events, elements will be wrapped by this.el
        events: {
            'click .button-game-intro': 'onClickButtonGameIntro',
            'click .button-game-pacman': 'onClickButtonGamePacman',
            'click .button-game-highscore': 'onClickButtonGameHighscore'
        },

        // set active button
        switchActiveButton: function (route) {
            $('#region-footer .button').removeClass('disabled');
            $('#region-footer .button[href=#' + route + ']').addClass('disabled');
        },

        // switch main layout
        switchRegionMain: function (callback) {

            var self = this;

            if ($('#content').hasClass('pacman')) {
                pacman.pause(true);
                $('#reveal-game-exit').reveal();
                layoutCallback = callback;
            } else {
                callback();
            }

        },

        /**
         * button events
         *
         */

        // handle button click
        onClickButtonGameIntro: function (e) {
            e.preventDefault();

            var self = this;

            self.switchRegionMain(function () {
                ns.marionette.controller.intro();
                self.switchActiveButton('intro');
            });

        },

        // handle button click
        onClickButtonGamePacman: function (e) {
            e.preventDefault();

            // check if pacman is playing
            if (!$('#content').hasClass('pacman')) {

                var name,
                    fullscreen,
                    nameEnteredCallback = function () {

                        name = $('#form-enter-name-value').val();
                        fullscreen = $('#form-enter-name-fullscreen').attr('checked') === 'checked';

                        if (!name || name === '') {
                            name = $('#form-enter-name-value').attr('placeholder');
                        }
                        pacman.stats.setPlayerName(name);
                        ns.marionette.models.config.set({
                            fullscreen: fullscreen
                        });
                    };

                $('#reveal-game-enter-name').on({
                    'reveal:close': function () {
                        $('#reveal-game-enter-name').off('reveal:close');
                        nameEnteredCallback();
                    }
                })
                $('#form-enter-name').on({
                    'submit': function (e) {
                        e.preventDefault();
                        $('#form-enter-name').off('submit');
                        nameEnteredCallback();
                    }
                });

                $('#reveal-game-enter-name').reveal();

            } else {
                pacman.pause();
            }
                
        },

        // handle button click
        onClickButtonGameHighscore: function (e) {
            e.preventDefault();

            var self = this;

            self.switchRegionMain(function () {
                ns.marionette.controller.highscore();
                self.switchActiveButton('highscore');
            });
        },


        /**
         * reveal events
         *
         */

        // handle button click
        onClickRevealGameEnterButtonYes: function (e) {
            e.preventDefault();
            this.$reveal.trigger('reveal:close');
            ns.marionette.controller.pacman();
            this.switchActiveButton('pacman');
        },

        // handle button click
        onClickRevealGameEnterButtonNo: function (e) {
            e.preventDefault();
            this.$reveal.trigger('reveal:close');
        },

        // handle button click
        onClickRevealGameExitButtonYes: function () {

            var self = this;

            self.$reveal.trigger('reveal:close');
            if (layoutCallback) {
                layoutCallback();
            }
        },

        // handle button click
        onClickRevealGameExitButtonNo: function () {
            this.$reveal.trigger('reveal:close');
            pacman.pause(false);
        },


        /**
         * init helpers
         *
         */

        // initialize layout
        initialize: function (options) {

            var self = this;

            /**
             * set jquery dom helper
             *
             * this seems to don't work as instance property via $el: $(this.el) on marionette views
             * when we don't work with marionette modules and handle custom namespace functions
             */
            self.$el = $(self.el);

        },

        // callback after layout is rendered
        onShow: function () {

            /**
             * get window location hash
             *
             * Backbone.history.fragment doesn't provide a fragment value
             * but if we spy the object with console the value is set,
             * strange behaviour so we use location.hash here
             */
            if (window.location.hash && window.location.hash.length > 1) {
                this.switchActiveButton(window.location.hash.substr(1));
            }

        },

        // callback after layout is rendered
        onRender: function () {

            var self = this,
                $el = self.$el;

            self.$el.addClass('row center');

            // dom vars
            self.$reveal = $('.reveal-modal');
            self.$revealGameEnterName = $('#reveal-game-enter-name');
            self.$revealGameExit = $('#reveal-game-exit');

            // bind reveal enter name events
            if (!self.$revealGameEnterName.data('events')) {

                self.$revealGameEnterName.data('events', true);

                self.$revealGameEnterName.find('.button-reveal-game-enter-name-yes').on({
                    'click': $.proxy(self.onClickRevealGameEnterButtonYes, self)
                });
                self.$revealGameEnterName.find('.button-reveal-game-enter-name-no').on({
                    'click': $.proxy(self.onClickRevealGameEnterButtonNo, self)
                });
            }

            // bind reveal exit game events
            if (!self.$revealGameExit.data('events')) {

                self.$revealGameExit.data('events', true);

                self.$revealGameExit.find('.button-reveal-game-exit-yes').on({
                    'click': $.proxy(self.onClickRevealGameExitButtonYes, self)
                });
                self.$revealGameExit.find('.button-reveal-game-exit-no').on({
                    'click': $.proxy(self.onClickRevealGameExitButtonNo, self)
                });
            }

            self.$el.find('.tooltip').tooltip();

        },

        // callback before layout is closed
        onBeforeClose: function () {

            var self = this,
                $el = self.$el;

            $el.find('.button-game-intro').off('click');
            $el.find('.button-game-pacman').off('click');
            $el.find('.button-game-highscore').off('click');

        }

    });


    /**
     * global namespace export
     *
     * @export
     */
    ns.namespace('marionette.Layout', Layout);


}(window.Backbone, window.jQuery, window.getNamespace()));