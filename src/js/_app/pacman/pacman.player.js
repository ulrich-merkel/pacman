/*global window*/

/**
 * app.player
 * 
 * @description
 * - player controller
 * 
 * @author
 * @version 0.1.1
 *
 * @namespace app
 *
 * @changelog
 * - 0.1.1 refactoring, jslint, audio added
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
(function ($, app) {

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
        Player;

    /**
     * player
     *
     * @constructor
     */
    Player = function () {

        var self = this;

        // init instance vars, position and movement
        this.position = pacman.playerStart;
        this.originalStart = pacman.playerStart;
        this.movement = {
            x: -1,
            y: 0,
            objectRotation: 180
        };
        this.newMovement = this.movement;
        this.mode = "chase";

        // paper object
        this.paperObject = pacman.paper.path();


        /**
         * animate pacman body
         *
         */
        this.animate = function () {
            self.paperObject.attr(pacman.svg.pacmanBody(self.position, self.movement.objectRotation));
        };


        /**
         * check for direction change
         *
         * @return {boolean}
         */
        this.isChangingDirection = function () {

            // if new movement is something else than old movement return true
            if (this.movement.x !== this.newMovement.x || this.movement.y !== this.newMovement.y) {
                return true;
            }

            return false;

        };


        /**
         * check for direction change
         *
         * @return {boolean}
         */
        this.canChangeDirection = function () {

            var self = this,
                movement = self.movement,
                newMovement = self.newMovement,
                position = this.position,
                tileSize = pacman.config.tileSize,
                tilePosition,
                tileMiddlePosition,
                distanceFromMiddle;

            // can always reverse direction
            if (movement.x === (-1) * newMovement.x && movement.y === (-1) * newMovement.y) {
                return true;
            }

            // otherwise can change direction if close enough to middle of the current tile
            tilePosition = pacman.tools.getTilePosition(self.position);
            tileMiddlePosition = {
                x: tileSize * tilePosition.col + tileSize / 2,
                y: tileSize * tilePosition.row + tileSize / 2
            };

            distanceFromMiddle = pacman.tools.distanceBetween(position.x, position.y, tileMiddlePosition.x, tileMiddlePosition.y);
            if (distanceFromMiddle < tileSize / 8) {
                return true;
            }

            return false;
        };


        /**
         * center pacman body
         *
         */
        this.align = function () {

            var self = this,
                tileSize = pacman.config.tileSize,
                tilePosition,
                tileMiddlePosition;

            // moves object to the middle of current tile
            tilePosition = pacman.tools.getTilePosition(self.position);
            tileMiddlePosition = {
                x: tileSize * tilePosition.col + tileSize / 2,
                y: tileSize * tilePosition.row + tileSize / 2
            };
            self.position = tileMiddlePosition;

        };


        /**
         * check if pacman can move
         *
         * @return {boolean}
         */
        this.canMove = function (movement, speed) {

            // init local vars
            var self = this,
                position = self.position,
                tileSize = pacman.config.tileSize,
                edgePosition,
                tilePosition;

            // motion side edge position
            edgePosition = {
                x: position.x + (tileSize / 2 + speed) * movement.x,
                y: position.y + (tileSize / 2 + speed) * movement.y
            };

            // what tile is the edge in
            tilePosition = pacman.tools.getTilePosition(edgePosition);

            // if the tile is good to move in (undefined for moving outside the grid)
            if (pacman.playerMovement[tilePosition.row] === undefined ||
                    pacman.playerMovement[tilePosition.row][tilePosition.col] === undefined ||
                    pacman.playerMovement[tilePosition.row][tilePosition.col]) {
                return true;
            }

            return false;
        };


        /**
         * 
         *
         */
        this.doMovement = function (movement, speed) {

            var newPosition = {
                x: this.position.x + speed * movement.x,
                y: this.position.y + speed * movement.y
            };
            this.position = newPosition;

        };


        /**
         * moves object to the other side if it moves outside grid
         *
         */
        this.correctPosition = function () {

            // init local vars
            var self = this,
                position = self.position,
                tileSize = pacman.config.tileSize,
                width = pacman.fieldInUse.width,
                height = pacman.fieldInUse.height;

            // going out from left
            if (position.x < 0) {
                position.x += tileSize * width;
            }

            // going out from right
            if (position.x > tileSize * width) {
                position.x -= tileSize * width;
            }

            // going out from top
            if (position.y < 0) {
                position.y += tileSize * height;
            }

            // going out from bottom
            if (position.y > tileSize * height) {
                position.y -= tileSize * height;
            }

        };


         /**
         * move pacman body
         *
         */
        this.move = function () {

            var self = this,
                speed = pacman.tools.playerSpeed(self.mode);

            if (self.isChangingDirection() && self.canChangeDirection() && self.canMove(self.newMovement, speed)) {

                // if reversing direction, just move, otherwise align to center and move
                if (self.movement.x === (-1) * self.newMovement.x && self.movement.y === (-1) * self.newMovement.y) {
                    self.doMovement(self.newMovement, speed);
                } else {
                    self.align();
                    self.doMovement(self.newMovement, speed);
                }

                // start using new movement
                self.movement = self.newMovement;

            } else {

                // if no change in direction or we just can't move to new position

                // if pacman can move just move
                if (self.canMove(self.movement, speed)) {
                    self.doMovement(self.movement, speed);
                } else {
                    // if pac-man can't move align to center
                    self.align();
                }

                // cancel the new movement because we used old
                self.newMovement = self.movement;
            }

            // check if pacman is outside the grid and correct it
            self.correctPosition();
        };


        /**
         * pacman is eating
         *
         * @return {boolean} True if pellet was eaten, otherwise false
         */
        this.eat = function () {

            // where is pac-man
            var self = this,
                playerPosition = pacman.tools.getTilePosition(self.position),
                pellet = pacman.pellets[playerPosition.row][playerPosition.col];

            // check if there are pellets in pac-man's position and if yes, remove from game and add points
            if (pellet !== undefined && !pellet.eaten) {

                // reduce pellet count
                pacman.pelletCount = pacman.pelletCount - 1;

                // play pellet audio
                pacman.audio.play('pellet');

                // points
                if (pellet.isPowerPellet) {

                    // if pellet is a power pellet, enter fright mode
                    pacman.startFright();
                    pacman.audio.play('power-pellet');
                    pacman.stats.addPoints(50);

                } else {

                    // normal pellet
                    pacman.stats.addPoints(10);

                }

                // hide pellet object from raphael paper and set eaten to true
                pellet.hide();
                pellet.eaten = true;

                return true;
            }

            return false;

        };


        /**
         * check player collisions with gosts
         *
         */
        this.checkCollisions = function () {

            // init local vars
            var getTilePosition = pacman.tools.getTilePosition,
                playerPosition = getTilePosition(pacman.player.position),
                ghostPosition;

            // toggle through each ghost
            $.each(pacman.ghosts, function (index, ghost) {

                ghostPosition = getTilePosition(ghost.position);

                if (playerPosition.row === ghostPosition.row && playerPosition.col === ghostPosition.col) {

                    // handle collision
                    // ghost in fright mode: kill ghost
                    if (ghost.mode === "fright") {

                        ghost.setMode("dead");
                        pacman.stats.addGhostPoints();
                        pacman.audio.play('eat-ghost');

                    } else if (ghost.mode !== "dead") {

                        pacman.audio.play('death');

                        if (pacman.stats.removeLife()) {
                            // return true if there are lifes left
                            pacman.death(pacman.continueAfterDeath);
                        } else {
                            // no lifes left so end game
                            pacman.death(pacman.end);
                        }
                    }

                }

            });

        };


        /**
         * set player mode
         *
         */
        this.setMode = function (mode) {
            this.mode = mode;
        };


        /**
         * resets position and movements to start conditions
         *
         */
        this.reset = function () {
            var self = this;

            self.position = pacman.playerStart;
            self.movement = {
                x: -1,
                y: 0,
                objectRotation: 180
            };
            self.newMovement = self.movement;
            self.mode = "chase";
        };

    };


    // @export
    app.namespace('pacman.Player', Player);


}(window.jQuery, window.getNamespace()));