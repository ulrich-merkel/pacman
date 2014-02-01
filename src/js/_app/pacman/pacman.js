/**
 * app.pacman
 * 
 * @description
 * - main game controller
 * 
 * @author
 * @version 0.1.1
 *
 * @namespace app
 *
 * @changelog
 * - 0.1.1 audio and video added
 * - 0.1 basic functions and module structur
 *
 * @requires
 * - app
 * - jQuery
 * - jQuery PubSub
 *
 * @see
 * - http://wesopeli.appspot.com
 * - http://www.webpacman.com/strategies.html
 * -http://www.webpacman.com/ghosts.html
 
 * @bugs
 * - 
 *
 **/
(function (document, $, app) {

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
     * pacman
     *
     * @constructor
     */
    var pacman = (function () {

        // init module vars
        var config,
            $document = $(document),
            frame = 0,      // animation frame
            screen,

            /**
             * blinky gains speed when there are specific amounts of pellets left,
             * this is called elroy mode, blinky gains this twice per level
             * elroy trigger levels
             */
            elroy1Trigger = 0,
            elroy2Trigger = 0,

            player;
    

        /**
         * main game loop
         *
         */
        function tick() {
            var state = pacman.state,
                movement,
                ghosts;

            if (!state.paused && !state.destroyed) {

                pacman.frame++;
                pacman.frame %= 30;

                pacman.stats.updateTime();

                // check if there is any input and if yes, add new input to pac-man
                movement = pacman.keyhandler.getMovement();
                if (movement !== null) {
                    player.newMovement = movement;
                }

                // move all
                moveObjects();
    
                // animate all
                animateObjects();
    
                // collisions
                player.checkCollisions();

                // eat everything at pac-man's position and if ate something check for elroy trigger
                if (player.eat()) {

                    ghosts = pacman.ghosts[0];

                    if (pacman.pelletCount === elroy1Trigger) {
                        ghosts.elroyLevel = 1;
                    } else if (pacman.pelletCount === elroy2Trigger) {
                        ghosts.elroyLevel = 2;
                    } else if (pacman.pelletCount === 0) {
                        // next level!
                        nextLevel();
                    }
                }
            }

        }


        /**
         * update elroy level
         *
         */
        function updateElroy() {
            elroy1Trigger = pacman.tools.elroyLevel();
            elroy2Trigger = elroy1Trigger / 2;
        }


        /**
         * field helper functions
         *
         */


        /**
         * start screen
         *
         */
        function setupScreenStart() {

            // build starting screen (atm playfield, not startscreen)
            pacman.fieldBuilder.buildScreenStart();
            
            // what screen is in use
            screen = "start";
        }


        /**
         * play screen
         *
         */
        function setupScreenGame() {

            pacman.fieldBuilder.buildScreenGame();

            // add ghosts
            pacman.ghosts = [];
            pacman.ghosts.push(new pacman.Enemy("blinky", pacman.enemyStarts[0]));
            pacman.ghosts.push(new pacman.Enemy("inky", pacman.enemyStarts[1]));
            pacman.ghosts.push(new pacman.Enemy("pinky", pacman.enemyStarts[2]));
            pacman.ghosts.push(new pacman.Enemy("clyde", pacman.enemyStarts[3]));
            
            // add player
            pacman.player = player = new pacman.Player();
            
            pacman.updateElroy();
            
            // to make object visible on screen
            animateObjects();

            // what screen is in use
            screen = "play";

        }
    

        /**
         * end screen
         *
         */
        function setupScreenEnd() {

            //pacman.video.setVideo('end');
            pacman.video.show('end');

            clearTimers();

            // wait for infoxbox to be closed
            var callback = function () {

                $.unsubscribe('pacman.videohide', callback);

                // build starting screen (atm playfield, not startscreen)
                pacman.fieldBuilder.buildScreenEnd();

                // send score
                pacman.stats.sendPoints();

                // what screen is in use
                screen = "end";

                pause(true);

                $.publish('pacman.end');
            };

            $.subscribe('pacman.videohide', callback);

        }


        /**
         * object groups functions
         *
         */

        /**
         * move all objects
         *
         */
        function moveObjects() {

            // move pac-man
            player.move();

            // move ghosts
            $.each(pacman.ghosts, function(index, ghost) {
                ghost.move();
            });

        }


        /**
         * animate all objects
         *
         */
        function animateObjects() {

            // pac-Man
            player.animate();

            // ghosts
            $.each(pacman.ghosts, function(index, ghost) {
                ghost.animate();
            });

        }


        /**
         * set objects mode
         *
         */
        function setObjectsMode(mode) {

            // pac-man
            player.setMode(mode);

            // ghosts
            $.each(pacman.ghosts, function(index, ghost) {
                ghost.setMode(mode);
            });

        }


        /**
         * reset all objects, set default start position and mode
         *
         */
        function resetObjects() {

            // pac-man
            player.reset();

            // ghosts
            $.each(pacman.ghosts, function(index, ghost) {
                ghost.reset();
            });

        }


        /**
         * mode and interval functions
         *
         */

        /**
         * start mode
         *
         * @param {string} mode
         */
        function startMode(mode) {
            pacman.mode = mode;
            setObjectsMode(mode);
        }


        /**
         * start chase, normal mode
         *
         */
        function startChase() {
            startMode("chase");
            pacman.timers.modeTimeout = setTimeout(startScatter, 15000);
        }


        /**
         * start fright, ghosts can be eaten
         *
         */
        function startFright() {
            pacman.stats.frightStart();
            pacman.blinkTimer = 3;
            startMode("fright");

            clearTimeout(pacman.timers.modeTimeout);
            clearTimeout(pacman.phaseEndInterval);
            pacman.timers.modeTimeout = setTimeout(frightPhaseEnd, 7000);
        }


        /**
         * fright phase end, ghosts will be normal again
         *
         */
        function frightPhaseEnd() {
            pacman.timers.phaseEndTimer = 3;
            pacman.phaseEndInterval = setInterval(blink, 1000);
        }


        /**
         * blink, ghosts blink white
         *
         */
        function blink() {
            if (pacman.timers.phaseEndTimer === 0) {
                clearInterval(pacman.phaseEndInterval);
                startChase();
            } else {
                pacman.svg.blinkGhosts();
                pacman.timers.phaseEndTimer--;
            }
        }


        /**
         * start scatter, move only ghosts slowly
         *
         */
        function startScatter() {
            startMode("scatter");
            pacman.timers.modeTimeout = setTimeout(startChase, 5000);
        }


        /**
         * game control functions
         *
         */


        /**
         * start game
         *
         */
        function start() {

            if (pacman.state.destroyed) {
                return;
            }

            if (pacman.countdownTimer <= 0 || pacman.countdownTimer === undefined) {
                clearInterval(pacman.timers.countDownInterval);
                pacman.timers.gameInterval = setInterval(tick, 1000 / 60);
                startChase();
                pacman.stats.setTimeStart();
            } else {
                pacman.svg.animateCountdownNumber(pacman.playerStart, pacman.countdownTimer);
                pacman.countdownTimer--;
            }
            updateButtons();
        }


        /**
         * start with countdown
         *
         */
        function startWithCountDown(time) {
            pacman.countdownTimer = time;
            pacman.timers.countDownInterval = setInterval(start, 1000);
            pacman.audio.play('start');
        }


        /**
         * stop game
         *
         */
        function stop() {
            clearTimers();
        }


        /**
         * end game
         *
         */
        function end() {
            setupScreenEnd();
            pacman.stats.setTimeEnd();
        }


        /**
         * hides ghosts and plays animation when pac-man dies
         *
         */
        function death(callback) {
            stop(); 
            $.each(pacman.ghosts, function (index, ghost) {
                ghost.body.hide();
                ghost.leftEye.hide();
                ghost.rightEye.hide();
                ghost.leftPupil.hide();
                ghost.rightPupil.hide();
            });
            pacman.svg.animatePlayerDeath(callback);
    
        }


        /**
         * resets objects after death and shows ghosts again
         *
         */
        function continueAfterDeath() {

            stop();
            resetObjects();

            pacman.video.show('death');

            // wait for infoxbox to be closed
            var callback = function () {

                $.unsubscribe('pacman.videohide', callback);

                $.each(pacman.ghosts, function (index, ghost) {
                    ghost.body.show();
                    ghost.leftEye.show();
                    ghost.rightEye.show();
                    ghost.leftPupil.show();
                    ghost.rightPupil.show();
                });
                animateObjects();
                startWithCountDown(3);

            };

            $.subscribe('pacman.videohide', callback);

        }


        /**
         * next level
         *
         */
        function nextLevel() {
            stop();
            resetObjects();
            pacman.stats.addLevel();

            pacman.video.show('nextlevel');

            // wait for infoxbox to be closed
            var callback = function () {

                $.unsubscribe('pacman.videohide', callback);

                pacman.updateElroy();
                setupScreenGame();

                startWithCountDown(2);

            };

            $.subscribe('pacman.videohide', callback);
        }


        /**
         * start game
         * 
         */
        function startGame() {
            clearTimers();
            pacman.stats.resetStats();
            setupScreenGame();
            startWithCountDown(3);
        }


        /**
         * clear all timers
         *
         */
        function clearTimers() {

            if (pacman.timers) {
                clearInterval(pacman.timers.gameInterval);
                clearInterval(pacman.timers.phaseEndTimer);
                clearInterval(pacman.timers.countDownInterval);
                clearTimeout(pacman.timers.modeTimeout);
            }

            pacman.timers = {};
        }


        /**
         * update play button
         *
         */
        function updateButtons() {

            var $btn = $('.button-game-pacman'),
                $label = $btn.find('.button-label'),
                $icon = $btn.find('.icomoon');

            if (pacman.state.paused) {
                $btn.addClass('paused').removeClass('disabled playing');
                $label.text('Play Game');
                $icon.addClass('icon-play').removeClass('icon-pause');
            } else {
                $btn.removeClass('paused disabled').addClass('playing');
                $label.text('Pause Game');
                $icon.removeClass('icon-play').addClass('icon-pause');
            }

        }


        /**
         * pause game
         *
         * @param {boolean} paused The optional paused state
         */
        function pause(paused) {
            if (paused !== undefined) {
                // if there is a parameter use it
                pacman.state.paused = paused;
            } else {
                // just do a standard switch
                pacman.state.paused = !pacman.state.paused;
            }

            updateButtons();
        }


        /**
         * initialize game
         *
         */
        function initialize(options) {

            config = pacman.config;

            var configPlayfield = config.playField[pacman.stats.getLevelString()],
                configTileSize = config.tileSize,
                paperWidth = configPlayfield.width * configTileSize,
                paperHeight = configPlayfield.height * configTileSize,
                keyhandler = app.pacman.keyhandler;

            if (!!options) {
                if (options.muted) {
                    config.muted = options.muted;
                }
            }
    
            // create paper
			app.pacman.paper = Raphael(config.containerId, 0, 0);
            $('#' + config.containerId).css({
                'width': paperWidth + 'px',
                'height': paperHeight + 'px'
            });

            // bind keyhandler
			$document.on({
                'keydown': keyhandler.keydown,
                'keyup': keyhandler.keyup
            });

            clearTimers();

            // init pacman vars
            pacman.state = {};
            pacman.timers = {};

            // add video
            pacman.video = new pacman.Video(pacman.paper, {
                width: paperWidth,
                height: paperHeight,
                muted: config.muted
            });

            // add audio
            pacman.audio = new pacman.Audio(null, {
                muted: config.muted
            });

            // start with start screen
			pacman.startGame();

        }

        function destroy() {

            var keyhandler = pacman.keyhandler;

            $document.off({
                'keydown': keyhandler.keydown,
                'keyup': keyhandler.keyup
            });

            clearTimers();

        }


        /**
         * @interface
         *
         */
        return {
            setupScreenStart: setupScreenStart,
            setupScreenGame: setupScreenGame,
            startGame: startGame,
            startWithCountDown: startWithCountDown,
            start: start,
            pause: pause,
            death: death,
            continueAfterDeath: continueAfterDeath,
            end: end,
            frame: frame,
            startFright: startFright,
            resetObjects: resetObjects,
            updateElroy: updateElroy,
            initialize: initialize,
            destroy: destroy
        };

    })();


    // @export  
    app.namespace('pacman', pacman);


}(window.document, window.jQuery, window.getNamespace()));

