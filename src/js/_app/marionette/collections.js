/*global window*/

/**
 * app.backbone.application.model
 *
 * @description
 * - 
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
 * - http://backbonejs.org/#Collection
 * - 
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 * 
 * @bugs
 * -
 * 
 */
(function (Backbone, app, undefined) {

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
     * extend standard collection
     *
     * @extends {Backbone.Collection}
     */
    var Highscore = Backbone.Collection.extend({

        // reference to this collection's model
        model: app.marionette.models.Highscore,

        // unique name within the app to store collection local
        //localStorage: new Backbone.LocalStorage("appCollectionHighscore"),

        comparator: function(model) {
            return -model.get('points');
        },

        // initialize collection
        initialize: function () {
            this.add(this.model);
        }

    });


    /**
     * make collection globally available under the app namespace
     *
     * @export
     */
    app.namespace('marionette.collections.Highscore', Highscore);


}(window.Backbone, window.getNamespace()));