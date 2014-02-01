/*global window, app*/

/**
 * app.pacman.field
 * 
 * @description
 * - setup playfield
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
     * app is passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */


    /**
     *
     * @singleton
     */
    var fieldBuilder = (function() {

        // init module vars
        var pacman = app.pacman || {},
            config = pacman.config || {},
            paper;

        /**
         * playfield helper functions
         *
         */


        /**
         * clear canvas paper
         *
         */
        function clearPaper() {

            // init local vars
            var configPlayfield = config.playField[pacman.stats.getLevelString()],
                configTileSize = config.tileSize,
                paperWidth = configPlayfield.width * configTileSize,
                paperHeight = configPlayfield.height * configTileSize,
                background;

            // clear paper
            pacman.paper.clear();

            // set size
            //pacman.paper.setSize(paperWidth, paperHeight);
            pacman.paper.setSize('100%', '100%');

            // create background
            background = pacman.paper.rect(0, 0, paperWidth, paperHeight);
            background.attr("fill", config.colours.background);

        }


        /**
         * create wall element
         *
         * @param {number} row
         * @param {number} col
         */
        function createWall(row, col) {
            var configTileSize = config.tileSize,
                wall = pacman.paper.rect(
                    col * configTileSize + configTileSize / 6,
                    row * configTileSize + configTileSize / 6,
                    configTileSize / 1.5,
                    configTileSize / 1.5
                );

            wall
                .attr("fill", config.colours.wall)
                .attr("stroke", "none");

        }


        /**
         * create wall element
         *
         * @param {number} row
         * @param {number} col
         */
        function createHighlight(row, col) {
            var configTileSize = config.tileSize,
                highlight = pacman.paper.rect(
                    col * configTileSize + configTileSize / 6,
                    row * configTileSize + configTileSize / 6,
                    configTileSize / 1.5,
                    configTileSize / 1.5
                );

            highlight
                .attr("fill", config.colours.highlight)
                .attr("stroke", "none");

        }


        /**
         * create gate element
         *
         * @param {number} row
         * @param {number} col
         */
        function createGate(row, col) {
            var configTileSize = config.tileSize,
                gate = pacman.paper.rect(
                    col * configTileSize + configTileSize / 6,
                    row * configTileSize + configTileSize / 6,
                    configTileSize / 1.5,
                    configTileSize / 1.5
                );

            gate
                .attr("fill", config.colours.gate)
                .attr("stroke", "none");
        }


        /**
         * create pellet element
         *
         * @param {number} row
         * @param {number} col
         */
        function createPellet(row, col) {
            var configTileSize = config.tileSize,
                pellet = pacman.paper.rect(
                    col * configTileSize + configTileSize / (8 / 3),
                    row * configTileSize + configTileSize / (8 / 3),
                    configTileSize / 4,
                    configTileSize / 4
                );

            pellet
                .attr("fill", config.colours.pellet)
                .attr("stroke", "none");

            pellet.eaten = false;

            pacman.pellets[row][col] = pellet;
        }


        /**
         * create power pellet element
         *
         * @param {number} row
         * @param {number} col
         */
        function createPowerPellet(row, col) {
            var configTileSize = config.tileSize,
                powerPellet = pacman.paper.rect(
                    col * configTileSize + configTileSize / (10 / 3),
                    row * configTileSize + configTileSize / (10 / 3),
                    configTileSize / 2.5,
                    configTileSize / 2.5
                ),
                anim = Raphael.animation({
                    "50%": {
                        transform: "s1.5"
                    },
                    "100%": {
                        transform: ""
                    }
                }, 1000).repeat("Infinity");

            powerPellet
                .attr("fill", config.colours.powerPellet)
                .attr("stroke", "none")
                .animate(anim);

            powerPellet.isPowerPellet = true;
            powerPellet.eaten = false;

            pacman.pellets[row][col] = powerPellet;
        }


        /**
         * set player start position
         *
         * @param {number} row
         * @param {number} col
         */
        function setPlayerStart(row, col) {
            var configTileSize = config.tileSize;

            pacman.playerStart = {
                x: (col + 1) * configTileSize,
                y: row * configTileSize + configTileSize / 2
            };
        }


        /**
         * set enemy start position
         *
         * @param {number} row
         * @param {number} col
         */
        function setEnemyStart(row, col) {
            var configTileSize = config.tileSize;
    
            pacman.enemyStarts.push({
                x: (col + 1) * configTileSize,
                y: row * configTileSize + configTileSize / 2
            });
        }


        /**
         * renew pellets
         *
         */
        function renewPellets() {
            var row = 0,
                fieldInUseHeight = pacman.fieldInUse.height,
                col = 0,
                fieldInUseWidth = pacman.fieldInUse.width,
                pelletsRowCol;

            for (row = 0; row < fieldInUseHeight; row = row + 1) {

                for (var col = 0; col < fieldInUseWidth; col = col + 1) {

                    pelletsRowCol = pacman.pellets[row][col];

                    if (pelletsRowCol !== undefined) {

                        pelletsRowCol.show();
                        pelletsRowCol.eaten = false;

                        pacman.pelletCount = pacman.pelletCount + 1;
                    }

                }

            }
        }


        /**
         * build start screen
         *
         */
        function buildScreenStart() {

            clearPaper();

            var configTileSize = config.tileSize,
                configColours = config.colours,
                configPlayfield = config.playField[pacman.stats.getLevelString()],
                playFieldWidth = configPlayfield.width,
                playFieldHeight = configPlayfield.height,    
                x = playFieldWidth / 2 * configTileSize,
                y = playFieldHeight / 3 * configTileSize,
                maxY = playFieldHeight * (2/3) * configTileSize,
                startText = pacman.paper.text(x, y, 'Loading Pacman'),
                scores = pacman.stats.getTopScores();

            startText.attr({
                fill: configColours.textColour
            });
    
        }


        /**
         * build end screen
         *
         */
        function buildScreenEnd() {

            clearPaper();

        }


        /**
         * build canvas playfield
         *
         */
        function buildScreenGame() {

            var configPlayfield = config.playField[pacman.stats.getLevelString()],
                playFieldHeight = configPlayfield.height,
                playFieldWidth = configPlayfield.width,
                row = 0,
                col = 0;

            // setup paper
            pacman.fieldInUse = configPlayfield;
            clearPaper();
            
            // movement fields for player and enemies
            pacman.playerMovement = [];
            pacman.enemyMovement = [];
            
            // container for pellets
            pacman.pellets = [];
            
            // container for enemy start locations
            pacman.enemyStarts = [];
            
            // slow movement area
            pacman.slowMovement = [];
            
            // pellet counter
            pacman.pelletCount = 0;
            
            // go through the field string
            // set each row
            for (row = 0; row < playFieldHeight; row = row + 1) {
            
                pacman.playerMovement[row] = [];
                pacman.enemyMovement[row] = [];
                pacman.pellets[row] = [];
                pacman.slowMovement[row] = [];
            
                // set each col
                for (col = 0; col < playFieldWidth; col = col + 1) {
                    
                    pacman.playerMovement[row][col] = true;
                    pacman.enemyMovement[row][col] = true;
                    pacman.slowMovement[row][col] = false;
                    
                    switch (configPlayfield.field[row].charAt(col)) {
                    // if it's a wall
                    case "W":
                        createWall(row, col);
                        pacman.playerMovement[row][col] = false;
                        pacman.enemyMovement[row][col] = false;
                        break;
                    // if it's a highlight
                    case "w":
                        createHighlight(row, col);
                        pacman.playerMovement[row][col] = false;
                        pacman.enemyMovement[row][col] = false;
                        break;
                    // if it's a ghost room gate
                    case "G":
                        createGate(row, col);
                        pacman.playerMovement[row][col] = false;
                        // is also bad
                        break;
                    // if it's a candy
                    case "C":
                        createPellet(row, col);
                        pacman.pelletCount++;
                        break;
                    // if it's a powerup
                    case "U":
                        createPowerPellet(row, col);
                        pacman.pelletCount++;
                        break;
                    // if it's the player starting spot
                    case "P":
                        setPlayerStart(row, col);
                        break;
                    // if it's the enemy starting spot
                    case "H":
                        setEnemyStart(row, col);
                        // is also bad
                        break;
                    // bad area, ghosts can't stay here
                    case "B":
                        break;
                    case "Z":
                        pacman.goodTarget = {row: row, col: col};
                        break;
                    case "X":
                        pacman.ghostHome = {row: row, col: col};
                        break;
                    case "S":
                        pacman.slowMovement[row][col] = true;
                        break;
                    }
                }
            }
        }
    

        // @interface
        return {
            buildScreenStart: buildScreenStart,
            buildScreenGame: buildScreenGame,
            buildScreenEnd: buildScreenEnd,
            renewPellets: renewPellets
        };

    })();


    // @export
    app.namespace('pacman.fieldBuilder', fieldBuilder);


}(window.app || {}));
