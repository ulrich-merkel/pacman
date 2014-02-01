/*global window, app, $*/

/**
 * app.pacman.enemy.ai
 * 
 * @description
 * - setup enemy inteligence
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
(function (app, $, undefined) {

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
    var pacman = app.pacman || {},
        ai;


    ai = {

        /**
         * set up directions
         *
         * @param {object} oldMovement The ghost's old movement so we can know where we can't go = where we came from
         * @param {object} ownPosition The current ghost's position
         * @param {object} movementGrid The movementGrid to use to check where we can move
         *
         * @return {array}
         */
        setUpDirections: function (oldMovement, ownPosition, movementGrid) {

            var directions = [];

            /**
             * add directions to array if the direction has no walls or other
             * obstacles and it is not the direction where we are coming from
             */

            // can go up?
            if (oldMovement.y !== 1 && movementGrid[ownPosition.row - 1][ownPosition.col]) {
                directions.push({
                    distance: null,
                    x: 0,
                    y: -1
                });
            }
            // can go right?
            if (oldMovement.x !== -1 && movementGrid[ownPosition.row][ownPosition.col + 1]) {
                directions.push({
                    distance: null,
                    x: 1,
                    y: 0
                });
            }
            // can go down?
            if (oldMovement.y !== -1 && movementGrid[ownPosition.row + 1][ownPosition.col]) {
                directions.push({
                    distance: null,
                    x: 0,
                    y: 1
                });
            }
            // can go left?
            if (oldMovement.x !== 1 && movementGrid[ownPosition.row][ownPosition.col - 1]) {
                directions.push({
                    distance: null,
                    x: -1,
                    y: 0
                });
            }

            return directions;

        },


        /**
         * set distances
         *
         * calculates distances for all directions in given array to target position
         *
         * @param {array} directions The directions array we set up with setUpDirections
         * @param {object} ownPosition The ghost's position so we can count distances to target with directions array
         * @param {object} targetPosition The ghost's target
         */
        setDistances: function (directions, ownPosition, targetPosition) {

            // go through all directions in the array
            $.each(directions, function (index, direction) {
                // use tool function to calculate euclidean distance between ghost
                // and the target
                direction.distance = pacman.tools.distanceBetween(
                    ownPosition.col + direction.x,
                    ownPosition.row + direction.y,
                    targetPosition.col,
                    targetPosition.row
                );
            });

        }

    };


    /**
     * Enemy Blinky
     *
     */
    ai.blinky = (function () {

        /**
         * get enemy movement
         *
         * all ais only need to offer function getMovement that takes parameters
         *
         * @param {object} oldMovement The ghost's old movement (for knowing where not to go usually)
         * @param {object} ownPosition The ghost's position (for route search)
         * @param {string} mode The ghost's mode (for different behaviour for different modes
         * @param {object} forcedTarget The  forced target (overriding normal target)
         */
        function getMovement(oldMovement, ownPosition, mode, forcedTarget) {

            var movementGrid,           // uses player movement grid in normal mode, changes movement grid while using home area (coming out/going in)
                directions,             // set up where ghost is able to go
                playerPosition,
                randomIndex;

            if (forcedTarget !== null) {
                movementGrid = pacman.enemyMovement;
                directions = ai.setUpDirections(oldMovement, ownPosition, movementGrid);
                ai.setDistances(directions, ownPosition, forcedTarget);
            } else {
                movementGrid = pacman.playerMovement;
                directions = ai.setUpDirections(oldMovement, ownPosition, movementGrid);

                // move by mode
                switch (mode) {
                // targets upper right corner in scatter mode
                case "scatter":
                    ai.setDistances(directions, ownPosition, {row: 0, col: pacman.fieldInUse.width});
                    break;
                // targets pac-man in chase mode
                case "chase":
                    playerPosition = pacman.tools.getTilePosition(pacman.player.position);
                    ai.setDistances(directions, ownPosition, playerPosition);
                    break;
                 // random direction in fright mode
                case "fright":
                    randomIndex = Math.floor(Math.random() * directions.length);
                    return directions[randomIndex];
                }

            }

            // sort directions by distances (shortest will be first)
            directions.sort(pacman.tools.sortByDistance);

            // and return first (shortest)
            return directions[0];

        }

        // @interface
        return {
            getMovement: getMovement
        };

    }());


    /*
     * Enemy Pinky
     *
     */
    ai.pinky = (function () {

        /**
         * get enemy movement
         *
         * all ais only need to offer function getMovement that takes parameters
         *
         * @param {object} oldMovement The ghost's old movement (for knowing where not to go usually)
         * @param {object} ownPosition The ghost's position (for route search)
         * @param {string} mode The ghost's mode (for different behaviour for different modes
         * @param {object} forcedTarget The  forced target (overriding normal target)
         */
        function getMovement(oldMovement, ownPosition, mode, forcedTarget) {

            var movementGrid,           // uses player movement grid in normal mode, changes movement grid while using home area (coming out/going in)
                directions,             // set up where ghost is able to go
                playerPosition,
                playerMovement,
                targetPosition,
                randomIndex;

            if (forcedTarget !== null) {
                movementGrid = pacman.enemyMovement;
                directions = ai.setUpDirections(oldMovement, ownPosition, movementGrid);
                ai.setDistances(directions, ownPosition, forcedTarget);
            } else {
                movementGrid = pacman.playerMovement;
                directions = ai.setUpDirections(oldMovement, ownPosition, movementGrid);

                // move by mode
                switch (mode) {
                // targets upper left corner in scatter mode
                case "scatter":
                    ai.setDistances(directions, ownPosition, {row: 0, col: 0});
                    break;
                 // targets 4 squares in front of pac-man in chase mode
                case "chase":
                    playerPosition = pacman.tools.getTilePosition(pacman.player.position);
                    playerMovement = pacman.player.movement;
                    targetPosition = {
                        col: playerPosition.col + 4 * playerMovement.x,
                        row: playerPosition.row + 4 * playerMovement.y
                    };
                    ai.setDistances(directions, ownPosition, targetPosition);
                    break;
                // random direction in fright mode
                case "fright":
                    randomIndex = Math.floor(Math.random() * directions.length);
                    return directions[randomIndex];
                }
            }

            // sort directions by distances (shortest will be first)
            directions.sort(pacman.tools.sortByDistance);

            // and return first (shortest)
            return directions[0];

        }

        // @interface
        return {
            getMovement: getMovement
        };

    }());


    /**
     * Enemy Inky
     *
     */
    ai.inky = (function () {

        /**
         * get enemy movement
         *
         * all ais only need to offer function getMovement that takes parameters
         *
         * @param {object} oldMovement The ghost's old movement (for knowing where not to go usually)
         * @param {object} ownPosition The ghost's position (for route search)
         * @param {string} mode The ghost's mode (for different behaviour for different modes
         * @param {object} forcedTarget The  forced target (overriding normal target)
         */
        function getMovement(oldMovement, ownPosition, mode, forcedTarget) {

            var movementGrid,           // uses player movement grid in normal mode, changes movement grid while using home area (coming out/going in)
                directions,             // set up where ghost is able to go
                playerPosition,
                playerMovement,
                playerPosition2,
                blinkyPosition,
                difference,
                targetPosition,
                randomIndex;

            if (forcedTarget !== null) {
                movementGrid = pacman.enemyMovement;
                directions = ai.setUpDirections(oldMovement, ownPosition, movementGrid);
                ai.setDistances(directions, ownPosition, forcedTarget);
            } else {
                movementGrid = pacman.playerMovement;
                directions = ai.setUpDirections(oldMovement, ownPosition, movementGrid);

                // move by mode
                switch (mode) {
                // targets bottom right corner in scatter mode
                case "scatter":
                    ai.setDistances(directions, ownPosition, {row: pacman.fieldInUse.height, col: pacman.fieldInUse.width});
                    break;
                // target tile is pointed by drawing a vector from blinky to 2 tiles in front of pacman and doubling it
                case "chase":
                    playerPosition = pacman.tools.getTilePosition(pacman.player.position);
                    playerMovement = pacman.player.movement;
                    playerPosition2 = {
                        row: playerPosition.row + 2 * playerMovement.y,
                        col: playerPosition.col + 2 * playerMovement.x
                    };
                    blinkyPosition = pacman.tools.getTilePosition(pacman.ghosts[0].position);
                    difference = {
                        row: playerPosition2.row - blinkyPosition.row,
                        col: playerPosition2.col - blinkyPosition.col
                    };
                    targetPosition = {
                        row: playerPosition2.row + difference.row,
                        col: playerPosition2.col + difference.col
                    };

                    ai.setDistances(directions, ownPosition, targetPosition);
                    break;
                // random direction in fright mode
                case "fright":
                    randomIndex = Math.floor(Math.random() * directions.length);
                    return directions[randomIndex];
                }
            }

            // sort directions by distances (shortest will be first)
            directions.sort(pacman.tools.sortByDistance);

            // and return first (shortest)
            return directions[0];

        }

        // @interface
        return {
            getMovement: getMovement
        };

    }());


    /**
     * Enemy Clyde
     *
     */
    ai.clyde = (function () {

        /**
         * get enemy movement
         *
         * all ais only need to offer function getMovement that takes parameters
         *
         * @param {object} oldMovement The ghost's old movement (for knowing where not to go usually)
         * @param {object} ownPosition The ghost's position (for route search)
         * @param {string} mode The ghost's mode (for different behaviour for different modes
         * @param {object} forcedTarget The  forced target (overriding normal target)
         */
        function getMovement(oldMovement, ownPosition, mode, forcedTarget) {

            var movementGrid,           // uses player movement grid in normal mode, changes movement grid while using home area (coming out/going in)
                directions,             // set up where ghost is able to go
                playerPosition,
                randomIndex;

            if (forcedTarget !== null) {
                movementGrid = pacman.enemyMovement;
                directions = ai.setUpDirections(oldMovement, ownPosition, movementGrid);
                ai.setDistances(directions, ownPosition, forcedTarget);
            } else {
                movementGrid = pacman.playerMovement;
                directions = ai.setUpDirections(oldMovement, ownPosition, movementGrid);

                // move by mode
                switch (mode) {
                // targets bottom left corner in scatter mode
                case "scatter":
                    ai.setDistances(directions, ownPosition, {row: pacman.fieldInUse.height, col: 0});
                    break;
                // targets pac-man in chase mode if distance from pac-man is greater than 8
                // otherwise uses scatter target
                case "chase":
                    playerPosition = pacman.tools.getTilePosition(pacman.player.position);
                    if (pacman.tools.distanceBetween(playerPosition.col, playerPosition.row, ownPosition.col, ownPosition.row) > 8) {
                        ai.setDistances(directions, ownPosition, playerPosition);
                    } else {
                        ai.setDistances(directions, ownPosition, {row: pacman.fieldInUse.height, col: 0});
                    }
                    break;
                // random direction in fright mode
                case "fright":
                    randomIndex = Math.floor(Math.random() * directions.length);
                    return directions[randomIndex];
                }
            }

            // sort directions by distances (shortest will be first)
            directions.sort(pacman.tools.sortByDistance);

            // and return first (shortest)
            return directions[0];

        }

        // @interface
        return {
            getMovement: getMovement
        };

    }());


    /**
     * make module globally available under app namespace
     *
     * @export
     */
    app.namespace('pacman.ai', ai);


}(window.app || {}, window.jQuery));
