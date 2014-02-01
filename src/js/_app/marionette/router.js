/*global window*/

/**
 * app.backbone.application.router
 *
 * @description
 * - handle marionette route management
 * - execute controller actions corresponding to the url
 * - route-handling code should get fired only when a user enters the application by a url, not each time the url changes
 * - update the url in the address bar as the user navigates within the app
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
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.approuter.md
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


    /**
     * router
     *
     * @extend
     */
    var Router = Backbone.Marionette.AppRouter.extend({

        /**
         * appRoutes will will trigger application controller
         * so function calls must exist at controller
         */
        appRoutes: {
            'intro': 'intro',
            'pacman': 'pacman',
            'highscore': 'highscore',
            '': 'intro'
        },

        /**
         * initialize router
         *
         */
        initialize: function () {

        }

    });


    /**
     * global namespace export
     *
     * @export
     */
    ns.namespace('marionette.Router', Router);


}(window.Backbone, window.getNamespace()));