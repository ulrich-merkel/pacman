/*global window*/

/**
 * ns.pacman.svg
 * 
 * @description
 * - svg helper
 * 
 * @author
 * @version 0.1
 *
 * @namespace ns
 *
 * @changelog
 * - 0.1 basic functions and module structur
 *
 * @requires
 * - app
 * - jQuery
 *
 * @see
 * - http://wesopeli.appspot.com
 * 
 * @bugs
 * - 
 *
 **/
(function (ns) {

    
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
    var pacman = app.pacman || {},
        svg,
        config;

    svg = (function () {

        config = pacman.config;

        /**
         * helper functions return attributes for Raphael paper elements
         *
         */


        /**
         * svg path fpr pacman body
         *
         */
        function pacmanBody(position, rotation) {

            var r = config.tileSize / 2,
                // the angles for mouth movement
                startAngle = Math.sin((pacman.frame / 30) * Math.PI) * 30,
                endAngle = 359 - startAngle,
                flag = (endAngle - startAngle) > 180;

            startAngle = (startAngle % 360) * Math.PI / 180;
            endAngle = (endAngle % 360) * Math.PI / 180;
    
            return {
                path: [
                    ["M", position.x, position.y],
                    ["l", r * Math.cos(startAngle), r * Math.sin(startAngle)],
                    ["A", r, r, 0, + flag, 1, position.x + r * Math.cos(endAngle), position.y + r * Math.sin(endAngle)],
                    ["z"]
                ],
                transform: ["r", rotation, position.x, position.y],
                fill: config.colours.pacman,
                stroke: "none"
            };
        }


        /**
         * svg path fpr pacman ghost
         *
         */
        function ghostBody(position, color) {

            var configTileSize = config.tileSize,
                r = configTileSize / 2;
    
            return {
                path: [
                    ["M", position.x - r, position.y + r],
                    ["c", 0, -2.7 * r, 2 * r, -2.7 * r, 2 * r, 0],
                    ["z"]
                ],
                stroke: "none",
                fill: color
            };
        }


        /**
         * svg circles fpr pacman ghost eye
         *
         */
        function ghostEye(whichEye, position) {

            var configTileSize = config.tileSize,
                x = position.x - configTileSize / 6;
            if (whichEye === "right") {
                x = x + configTileSize / 3;
            }

            return {
                cx: x,
                cy: position.y - configTileSize / 5,
                r: configTileSize / 5,
                fill: "rgb(255, 255, 255)",
                stroke: "none"
            };

        }


        /**
         * svg circles fpr pacman ghost pupil
         *
         */
        function ghostPupil(whichEye, position, movement) {

            var configTileSize = config.tileSize,
                x = position.x - configTileSize / 6;
            if (whichEye === "right") {
                x = x + configTileSize / 3;
            }

            return {
                cx: x + movement.x * 2,
                cy: position.y - configTileSize / 5 + movement.y * (configTileSize / 10),
                r: configTileSize / 10,
                fill: "rgb(0, 0, 0)",
                stroke: "none"
            };
        }
    
        /**
         * functions animate objects or create new objects with animations
         *
         */


        /**
         * animate countdown number
         *
         */
        function animateCountdownNumber(position, number) {

            var countdownNumber = pacman.paper.text(position.x, position.y, number);

            countdownNumber.attr({
                font: config.tileSize + "px \"Arial\"",
                fill: "rgb(255,0,0)"
            });
            countdownNumber.animate({transform: "s3"}, 1000, ">", countdownNumber.remove);
        }
    

        /**
         * changes colour between alarm and fright colour
         *
         */
        function blinkGhosts() {
            $.each(pacman.ghosts, function(index, ghost) {
                if (ghost.mode === "fright") {
                    if (ghost.colour === config.colours.frightAlarm) {
                        ghost.colour = config.colours.frightGhost;
                    } else {
                        ghost.colour = config.colours.frightAlarm;
                    }
                }
            });
        }


        /**
         * animate death for pacman player
         *
         */
        function animatePlayerDeath(callback) {
            pacman.player.paperObject.animate({transform: "s0.01"}, 1000, "linear", callback);
        }


        /**
         * @interface
         *
         */
        return {
            pacmanBody: pacmanBody,
            ghostBody: ghostBody,
            ghostEye: ghostEye,
            ghostPupil: ghostPupil,
            animateCountdownNumber: animateCountdownNumber,
            blinkGhosts: blinkGhosts,
            animatePlayerDeath: animatePlayerDeath
        };

    })();


    // @export
    ns.namespace('pacman.svg', svg);


}(window.getNamespace()));