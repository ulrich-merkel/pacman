/*global window*/
/*global document*/

/**
 * app.bootstrap
 *
 * @description
 * - init javascript plugins and functions after dom is ready
 *
 * @author
 * @version 0.1
 *
 * @namespace app
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 *
 */
(function ($, Backbone, ns, undefined) {

    'use strict';

	var marionette = app.marionette;

    var HighscoreItem = Marionette.ItemView.extend({
		tagName: "li",
        template: "#template-layout-highscore-item"
    });

    var Highscore = Marionette.CollectionView.extend({
        tagName: "ul",
        itemView: HighscoreItem
    });

    /**
     * global namespace export
     *
     * @export
     */
    ns.namespace('marionette.views.HighscoreItem', HighscoreItem);
    ns.namespace('marionette.views.Highscore', Highscore);


}(window.jQuery, window.Backbone, window.getNamespace()));