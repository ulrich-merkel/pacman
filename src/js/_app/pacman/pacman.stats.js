/**
 * ns.stats
 * 
 * @description
 * - control statistics
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
     * app is passed through as local variable rather than as global, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */


    /**
     * stats
     *
     * @constructor
     */
    var stats = (function() {

        // init stats vars
        var pacman = ns.pacman,
            points = 0,
            level = 1,
            lives = pacman.config.lives,
            name = 'Player',
            start = '',
            end = '',
            time = 0,
            ghostPoints = 200,
    
            scoreList = [],
            storage,
            store = [],
            score = {},

            utils = ns.helpers.utils;

        if (!!window.localStorage && !!window.localStorage.getItem) {
            storage = window.localStorage;
            store = utils.jsonToObject(storage.getItem('pacman'));
        }

        /**
         *
         *
         */
        function setTimeStart(time) {
            //if (!time) {
            //    time = new Date().getTime();
            //}
            //start = time;
        }


        /**
         *
         *
         */
        function setTimeEnd(time) {
            //if (!time) {
            //    time = new Date().getTime();
            //}
            //end = time;
        }


        /**
         *
         *
         */
        function updateTime() {
            time = time + 1;
        }


        /**
         * set current player name
         *
         * @param {string} name The player's name
         */
        function setPlayerName(value) {
            name = value;
        }


        /**
         * add points to current player
         *
         * @param {integer} amount The amount to add
         */
        function addPoints(amount) {

            /**
             * modulo is added as a "breakpoint" to
             * compare before and after values
             */
            var before = points % 10000,
                after;

            points += amount;
            after = points % 10000;

            // every 10000 points give a life
            if (after < before) {
                addLife();
            }

            updateView();
        }


        /**
         * add points for eating ghosts
         *
         */
        function addGhostPoints() {

            // add ghost points to counter
            addPoints(ghostPoints);

            // after kill next 'bounty' doubles
            ghostPoints *= 2;
            updateView();
        }
    

        /**
         * when fright mode start reset points amount that player can get from killing ghosts
         *
         */
        function frightStart() {
            ghostPoints = 200;
        }


        /**
         * add one life to player
         *
         */
        function addLife() {
            lives = lives + 1;
            updateView();
        }
    

        /**
         * removes one life
         *
         * @return {boolean} If no more lifes are left, returns false, otherwise true
         */
        function removeLife() {
            lives--;
            updateView();

            if (lives < 0) {
                return false;
            }
            return true;
        }
    

        /**
         * adds one to level counter
         *
         */
        function addLevel() {
            level++;
            pacman.updateElroy();
        }


        
        /**
         * update view display
         *
         */
        function updateView() {
            $('.score-points .score-value').html('Points: ' + points);
            $('.score-lives .score-value').html('Lives: ' + (lives < 0 ? 0 : lives));
            $('.score-level .score-value').html('Level: ' + level);
        }


        /**
         * reset the current player values
         *
         */
        function resetStats() {
            points = 0;
            level = 1;
            lives = pacman.config.lives;
            updateView();
        }


        /**
         * get current storage values
         *
         */
        function getStore() {
            return store;
        }


        /**
         * save current player points in storage
         *
         */
        function sendPoints() {
            if (!store || !store.length) {
               store = [];
            }

            score = {
                name: name,
                points: points,
                date: new Date().getTime(),
                time: time
            };

            store.push(score);

            if (!!storage) {
                storage.setItem('pacman', utils.jsonToString(store));
            }

            scoreList.push(points);
        }


        /**
         * get top scores
         *
         */
        function getTopScores() {
            scoreList.sort(function(a, b) {
                return b - a;
            });
            return scoreList;
        }


        /**
         * get current config level string
         *
         */
        function getLevelString() {

            // check if config is available
            if (!pacman.config.playField['level' + level]) {
                return 'level1';
            }
            return 'level' + level;
            
        }

        /**
         * @interface
         *
         */
        return {
            setTimeStart: setTimeStart,
            setTimeEnd: setTimeEnd,
            setPlayerName: setPlayerName,
            updateTime: updateTime,
            getStore: getStore,
            getLevelString: getLevelString,

            frightStart: frightStart,
            addPoints: addPoints,
            addGhostPoints: addGhostPoints,
            removeLife: removeLife,
            addLevel: addLevel,
            level: level,
            updateView: updateView,
            resetStats: resetStats,
            sendPoints: sendPoints,
            getTopScores: getTopScores
        };

    })();


    /**
     * make module globally available under app namespace
     *
     * @export
     */
    ns.namespace('pacman.stats', stats);


}(window.getNamespace()));