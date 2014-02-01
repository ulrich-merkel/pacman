/*global window*/

/**
 * app.backbone.application.model
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
     * extend standard model
     *
     * @extends {Backbone.Model}
     */
    var Headline = Backbone.Model.extend({

		// set item defaults
		defaults: {
			id: 0,
			name: '',
			visible: true
		}

    });


	/**
     * extend standard model
     *
     * @extends {Backbone.Model}
     */
    var Config = Backbone.Model.extend({

		// set item defaults
		defaults: {
			id: 0,
			fullscreen: false,
			sound: true,
			playfield: 0
		}
    });


	/**
     * extend standard model
     *
     * @extends {Backbone.Model}
     */
    var Highscore = Backbone.Model.extend({

		// set item defaults
		defaults: {
			id: 0,
			name: '',
			points: ''
		}
    });

	/**
     * global namespace export
     *
     * @export
     */
    ns.namespace('marionette.models.Headline', Headline);
	ns.namespace('marionette.models.Config', Config);
	ns.namespace('marionette.models.Highscore', Highscore);


}(window.Backbone, window.getNamespace()));