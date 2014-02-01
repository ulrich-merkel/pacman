/*global window*/

/**
 * app.backbone.application.controller
 *
 * @description
 * - a multi-purpose object to use as a controller for modules and routers
 * - a mediator for workflow and coordination of other objects, views, and more
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
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.controller.md
 * - http://lostechies.com/derickbailey/2012/03/22/managing-layouts-and-nested-views-with-backbone-marionette/
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 * 
 * @bugs
 * -
 * 
 */
(function (Backbone, ns, undefined) {

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

	/**
     * controller
     *
     * @extend
     */
	var Controller = Backbone.Marionette.Controller.extend({

		/**
         * show intro
         *
         */
		intro: function () {

            // init models and layouts
            var marionette = app.marionette,

                regionLayoutHeader = new marionette.Layout.Header({
                    model: marionette.models.headline
                }),

                regionLayoutMain = new marionette.Layout.Intro({
            
                });

			// set headline
            this.modelHeadline.set({
                name: 'Pacman'
            });

            // show regions
            marionette.regionHeader.show(regionLayoutHeader);
            marionette.regionMain.show(regionLayoutMain);

            // update url
            Backbone.history.navigate("intro");

		},

		/**
         * show pacman
         *
         */
		pacman: function () {

            var marionette = app.marionette,

                layoutMain = new marionette.Layout.Pacman({
            
                });

			// show regions
            marionette.regionHeader.close();
            marionette.regionMain.show(layoutMain);

            // update url
            Backbone.history.navigate("pacman");

		},

		/**
         * show highscore
         *
         */
		highscore: function () {

            // init models and layouts
            var marionette = app.marionette,

                regionLayoutHeader = new marionette.Layout.Header({
                    model: marionette.models.headline
                }),

                regionLayoutMain = new marionette.Layout.Highscore({
            
                });

			// set headline
            this.modelHeadline.set({
                name: 'Highscore'
            });

            // show regions
            marionette.regionHeader.show(regionLayoutHeader);
            marionette.regionMain.show(regionLayoutMain);

            // update url
            Backbone.history.navigate("highscore");
		},


		/**
         * initialize router
         *
         * @param {object} options
         */
		initialize: function (options) {

            var self = this,

				marionette = app.marionette,

				models = app.marionette.models,

				pacman = app.pacman,

				regionLayoutFooter = new marionette.Layout.Footer({
                }),

                modelHeadline = new models.Headline({
                }),

                modelConfig = new models.Config({
                }),

                modelConfigFullscreen,

                modelConfigSound;

			// setup application config and listen to changes
            modelConfig.on('change', function () {

                //if (modelConfig.hasChanged('fullscreen')) {
                //    app.plugins.fullscreen();
                //}

                if (modelConfig.hasChanged('sound')) {
                    modelConfigSound = modelConfig.get('sound');
                    if (pacman.audio) {
                        pacman.audio.mute(!modelConfigSound);
                    }
                    if (pacman.video) {
                        pacman.video.mute(!modelConfigSound);
                    }
                }

            });


            self.modelHeadline = models.headline = modelHeadline;
            self.modelConfig = models.config = modelConfig;
			
			marionette.regionFooter.show(regionLayoutFooter);
			$('input[type=checkbox]').styledCheckbox();
			
		}

	});


	/**
     * global namespace export
     *
     * @export
     */
    ns.namespace('marionette.Controller', Controller);


}(window.Backbone, window.getNamespace()));