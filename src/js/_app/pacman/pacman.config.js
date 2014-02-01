/*global window, app*/

/**
 * app.pacman.config
 * 
 * @description
 * - setup configuration for pacman
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
(function (ns, undefined) {

    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     * 
     * ns is passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */

    var config = {

        // the container (div) that holds the svg-elements of the game
        containerId: 'game',

        // size of one tile in the game grid (about pac-man's size)
        // could be overwritten by dynamically settings playfield size
        // with current window size
        tileSize: 19,

        // pacman's lives
        lives: 2,

        // colour settings, names self-explanatory
        colours: {
            pacman: 'rgb(255, 255, 0)',
            frightGhost: 'rgb(0, 0, 255)',
            frightAlarm: 'rgb(255, 255, 255)',
            ghost: {
                blinky: 'rgb(255, 0, 0)',
                inky: 'rgb(0, 245, 255)',
                pinky: 'rgb(255, 192, 203)',
                clyde: 'rgb(255, 215, 0)'
            },
            background: 'rgb(0, 0, 0)',
            wall: 'rgb(0, 100, 200)',
            highlight: 'rgb(255, 0, 200)',
            gate: 'rgb(255, 0, 0)',
            pellet: 'rgb(255, 255, 0)',
            powerPellet: 'rgb(255, 255, 255)',
            textColour: 'rgb(255, 255, 255)'
        },

        // setup playfield dimensions
        playField: {

            level1: {

                // if you expand the play field strings, keep these updated too
                width: 40, // horizontal counter
                height: 20, // vertical counter

                field: [

                    // Characters to construct the fields
                    // W = wall
                    // C = candy (pellet)
                    // P = player / Pac-Man
                    // U = power-up (power pellet)
                    // S = slow, half speed area for ghosts
                    // G = ghost room gate
                    // H = ghost start
                    // X = ghost home (reset spot)
                    // N = no coin area (empty corridor)
                    // w = highlight, like wall but other color

                    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    'WWWWWWUCCCCCCCCCCCCCCCUCCCCCCCCCCCCCCUWW',
                    'WWWWWWCWWWWWWWWWWWWWWWWWWWWWWWWWCWWWWCWW',
                    'WWWWWWCWWWWWWWWWWWWWWWWWWWWWWWWWCCCCCCWW',
                    'WWWWWWCWWWWWWwWwWwwwwwWwWWWWWWWwCwWWwCWW',
                    'WWWWWWCCCUCCCwwwCCUwUCCCwWwwwWwCUwWwCCWW',
                    'WWWWWWCWWWWWCwWwCWCwCWWCCwwwwwCCCwwWCCWW',
                    'WWWWWWCWWWWWCwWwCWCwCWWCCCwWwCCCCwWwWCWW',
                    'SSCCCCCCCCCCCCCCCCCCCCCPNCCCCCCCCCCCCCSS',
                    'WWWWWWCWWCWWWWWCWWWWWCWWWWWCWWCWWWWWWWWW',
                    'WWWWWWCWWCWWWWWCWWWWWCWWWWWCWWCWWWWWWWWW',
                    'WWWWWWCWWCWWWWWCWWWWWCWWWWWCWWUWWWWWWWWW',
                    'WWWWWWCWWCWWWWWCWWWWWCWWWWWCWWCWWWWWWWWW',
                    'WWWWWWUCCCCCCCCUCCCCCCCCCCCZCCZWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWCWCWWWWWGWWGWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWCWCWWWWWHHHHWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWCUCWWWWWHXHHWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW'

                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    //'SSCCCCCCCCCCUCCCCCCCCCCPNCUCCCCCCCCCCCSS',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWHWWHWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWHWWHWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWHWWHWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWHWWHWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWZHHZWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWGWWGWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWHHHHWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWHXHHWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    //'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW'

                ]

            },

            level2: {
            
                // if you expand the play field strings, keep these updated too
                width: 40, // horizontal counter
                height: 20, // vertical counter
            
                field: [
            
                    // Characters to construct the fields
                    // W = wall
                    // C = candy (pellet)
                    // P = player / Pac-Man
                    // U = power-up (power pellet)
                    // S = slow, half speed area for ghosts
                    // G = ghost room gate
                    // H = ghost start
                    // X = ghost home (reset spot)
                    // N = no coin area (empty corridor)
                    // w = highlight, like wall but other color
            
                    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    'WWWWWWUCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCUWW',
                    'WWWWWWCWWWWWWWWWWWWWWWWWWWWWWWWWCWWWWCWW',
                    'WWWWWWCWWWWWWWWWWWWWWWWWWWWWWWWWCCCCCCWW',
                    'WWWWWWCWWWWWUwWwUwwwwwUwWWWWWWWwCwCWwCWW',
                    'WWWWWWCCCCCCCwwwCCCwCCCCwWwwwWwCCwCwCCWW',
                    'WWWWWWCWWWWWCwUwCWCwCWWCCwwwwwCCCwwUCCWW',
                    'WWWWWWCWWWWWCwCwCWCwCCCCCCwCwCCCCwCwWCWW',
                    'SSCCCCCCCCCCCCCCCCCCCCCPNCCCCCCCCCCCCCSS',
                    'WWWWWWCWWCWWWWWCWWWWWCWWWWWCWWCWWWWWWWWW',
                    'WWWWWWCCCCWWWWWCWWWWWCWWWWWCCCCWWWWWWWWW',
                    'WWWWWWCWWCWWWWWCWWWWWCWWWWWCWWCWWWWWWWWW',
                    'WWWWWWCWWCWWWWWCWWWWWCWWWWWCWWCWWWWWWWWW',
                    'WWWWWWUCCCCCCCUCCCCCCCCCCCCZCCZWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWCWCWWWWWGWWGWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWCWCWWWWWHHHHWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWCUCWWWWWHXHHWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
                    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW'

                ]
            
            }
        },

        muted: false,

        video: {
            opts: {
            },
            attrs: {}
        },

        audio: {
            opts: {
            }
        }

    };


    /**
     * make module globally available under the namespace
     *
     * @export
     */
    ns.namespace('pacman.config', config);


}(window.getNamespace()));