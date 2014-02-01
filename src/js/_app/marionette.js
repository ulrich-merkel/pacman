/*global window*/

/**
 * app.backbone.application
 *
 * @description
 * - hub of composite application
 * - it organizes, initializes and coordinates the various pieces the application
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
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md
 * - http://www.mikkolehtinen.com/blog/2012/08/03/structuring-complex-backbone-dot-js-apps/
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
     * Backbone and namespace are passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */

	// create new application
	var marionette = new Backbone.Marionette.Application();


	/**
	 * add marionette regions to application
	 *
	 * this regions will be available in the controller
	 */
	marionette.addRegions({
		regionHeader: '#region-header',
		regionMain: '#region-main',
		regionFooter: '#region-footer'
	});


	/**
	 * event fired just before the initializers kick off
	 *
	 */
	marionette.on('initialize:before', function() {
	});


	/**
	 * event fires just after the initializers have finished
	 *
	 */
	marionette.on('initialize:after', function() {
		/**
		 * we can only start backbone’s routing (via the history attribute) once all initializers
		 * have been run, to ensure the routing controllers are ready to respond to routing events
		 */
		if (Backbone.history) {
			Backbone.history.start({
				trigger: true
			});
		}
	});


	/**
	 * event fires after all initializers and after the initializer events
	 *
	 */
	marionette.on('start', function() {
	});


	/**
	 * configure application when started
	 *
	 * @param {object} options This optional parameter is passed from the start method
	 */
    marionette.addInitializer(function (options) {

		// setup application controller
        var controller = new marionette.Controller();

		// setup application router
        controller.router = new marionette.Router({
            controller: controller
        });
        controller.initialize();

		// add controller to namespace
		marionette.controller = controller;

		
    });


	/**
     * global namespace export
     *
     * @export
     */
    app.namespace('marionette', marionette);


}(window.Backbone, window.getNamespace()));