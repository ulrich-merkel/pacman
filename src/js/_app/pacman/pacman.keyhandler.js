/**
 * app.keyhandler
 * 
 * @description
 * - main game controller
 * 
 * @author
 * @version 0.1
 *
 * @namespace app
 *
 * @changelog
 * - 0.1 basic functions and module structur
 *
 * @see
 * - http://wesopeli.appspot.com
 * 
 * @bugs
 * - 
 *
 **/
(function (app) {

    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     *
     * window and document are passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in your plugin).
     *
     */

    var keyhandler = (function () {

        // select all posible keys
        var keys = [],
            i = 0;

        for (i = 0; i < 256; i = i + 1) {
            keys[i] = false;
        }


        /**
         * check for up movement
         *
         */
        function up() {
            /**
             * arrow up
             * Nintendo Wii up
             * char w
             */
            return keys[38] || keys[175] || keys[87];
        }


        /**
         * check for down movement
         *
         */
        function down() {
            /**
             * arrow down
             * Nintendo Wii down
             * char s
             */
            return keys[40] || keys[176] || keys[83];
        }


        /**
         * check for left movement
         *
         */
        function left() {
            /**
             * arrow left
             * Nintendo Wii left
             * char a
             */
            return keys[37] || keys[178] || keys[65];
        }


        /**
         * check for right movement
         *
         */
        function right() {
            /**
             * arrow right
             * Nintendo Wii right
             * char d
             */
            return keys[39] || keys[177] || keys[68];
        }


        /**
         * check for spacebar
         *
         */
        function spacebar() {
            /**
             * char space
             */
            return keys[32];
        }


        /**
         * set keydown
         *
         */
        function keydown(e) {
            var keycode = e.keyCode;
            keys[keycode] = true;

            if (spacebar()) {
                app.pacman.pause();
            }
        }


        /**
         * set keyup
         *
         */
        function keyup(e) {
            var keycode = e.keyCode;
            keys[keycode] = false;
        }


        /**
         * get current movement
         *
         */
        function getMovement() {

            // init local vars
            var movement = {
                x: 0,
                y: 0,
                objectRotation: null
            };

            // else if because we allow only one way movement at a time
            if (up()) {
                movement.y = -1;
                movement.objectRotation = 270;
            } else if (down()) {
                movement.y = 1;
                movement.objectRotation = 90;
            } else if (left()) {
                movement.x = -1;
                movement.objectRotation = 180;
            } else if (right()) {
                movement.x = 1;
                movement.objectRotation = 0;
            }

            // there is no movement
            if (movement.objectRotation === null) {
                return null;
            }

            // return current movement if found
            return movement;
        }


        /**
         * @interface
         *
         */
        return {
            keydown: keydown,
            keyup: keyup,
            getMovement: getMovement
        };


    })();


    /**
     * global export
     *
     * @export
     */
    app.namespace('pacman.keyhandler', keyhandler);


}(window.getNamespace()));
