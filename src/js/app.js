/*global window*/
/*global document*/
/*global navigator*/

/**
 * app.helpers.client
 * 
 * @description
 * - provide information about the client and device
 * 
 * @author Ulrich Merkel, 2013
 * @version 0.3.8
 *
 * @namespace app
 * 
 * @changelog
 * - 0.3.8 improved module vars (uaToLowercase added for better compression)
 * - 0.3.7 ios version check added, improved check for mobile browsers, better namespace include
 * - 0.3.6 hide (mobile) status bar added
 * - 0.3.5 checkNetworkConnection added
 * - 0.3.4 check for mobile browsers modified and browser version check added
 * - 0.3.3 check if is ipad added
 * - 0.3.2 init client moved to separate function
 * - 0.3.1 changed namespace to app
 * - 0.3 isTouchDevice, hasMatrix added
 * - 0.2 Safari, Chrome, Opera Check added, global var useragent
 * - 0.1 basic functions and plugin structur
 * 
 */
(function (window, navigator, app, undefined) {

    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     * 
     * window, navigator and app are passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */

    /**
     * client functions
     *
     * following the singleton design pattern
     *
     */
    var client = (function () {

        /**
         * private functions and vars
         */

        // init global vars
        var privateIsiOS,                                                   // @type {boolean} Whether this browser is ios or not
            privateIsWebkit,                                                // @type {boolean} Whether this browser is webkit or not
            privateIsAndroid,                                               // @type {boolean} Whether this browser is android or not
            privateIsBlackberry,                                            // @type {boolean} Whether this browser blackberry ios or not
            privateIsOpera,                                                 // @type {boolean} Whether this browser is opera or not
            privateIsChrome,                                                // @type {boolean} Whether this browser is chrome or not
            privateIsSafari,                                                // @type {boolean} Whether this browser is safari or not
            privateIsFirefox,                                               // @type {boolean} Whether this browser is firefox or not
            privateIsSeamonkey,                                             // @type {boolean} Whether this browser is seamonkey or not
            privateIsCamino,                                                // @type {boolean} Whether this browser is camino or not
            privateIsMsie,                                                  // @type {boolean} Whether this browser is msie or not
            privateIsiPad,                                                  // @type {boolean} Whether this device is an ipad tablet or not
            privateIsiPhone,                                                // @type {boolean} Whether this device is an iphone device or not
            privateIsMobileBrowser,                                         // @type {boolean} Whether this device is mobile or not
            privateBrowserVersion,                                          // @type {string} The version of this browser
            privateIOSVersion,                                              // @type {string} The ios version of this browser or undefined
            privateIsOnline,                                                // @type {boolean} Whether this device has network connection or not
            privateNetworkConnection,                                       // @type {object} The navigator.connection object if available
            privateLandscapeMode = "landscapeMode",                         // @type {string} The landscape mode string
            privatePortraitMode = "portraitMode",                           // @type {string} The portrait mode string
            privateOrientationMode,                                         // @type {boolean} The current view mode (landscape/portrait)
            privateHasCanvas,                                               // @type {boolean} Whether the browser has canvas support or not
            privateHideStatusbarTimeout,                                    // @type {integer} Placeholder for window.setTimeout

            privateDetectOrientationBound,                                  // @type {boolean} Check to bind detectOrientation function just once

            ua = navigator.userAgent || navigator.vendor || window.opera,   // @type {string} The user agent string of the current browser
            uaLowerCase = ua.toLowerCase(),                                 // @type {string} The lower case user agent string for easier matching
            on = app.helpers.utils.on;                                      // @type {object} Shortcut for on function


        /**
         * detect orientation
         */
        function detectOrientation() {
            var orienation = parseInt(window.orientation, 10);
            switch (orienation) {
            case 0:
                privateOrientationMode = privatePortraitMode;
                break;
            case 180:
                privateOrientationMode = privatePortraitMode;
                break;
            case 90:
                privateOrientationMode = privateLandscapeMode;
                break;
            case -90:
                privateOrientationMode = privateLandscapeMode;
                break;
            default:
                break;
            }
        }


        /**
         * check for ios browser
         */
        function checkIfIsiOS() {
            privateIsiOS = uaLowerCase.match(/(iphone|ipod|ipad)/) !== null;
            if (privateIsiOS && !privateDetectOrientationBound) {
                on(window, "orientationchange", detectOrientation);
                privateDetectOrientationBound = true;
            }
        }


        /**
         * check for ios browser
         */
        function checkIfIsWebkit() {
            privateIsWebkit = uaLowerCase.match(/(webkit)/) !== null;
        }


        /**
         * check for android browser
         */
        function checkIfIsAndroid() {
            privateIsAndroid = uaLowerCase.match(/(android)/) !== null;
            if (privateIsAndroid && !privateDetectOrientationBound) {
                on(window, "orientationchange", detectOrientation);
                privateDetectOrientationBound = true;
            }
        }


        /**
         * check for blackberry browser
         */
        function checkIfIsBlackberry() {
            privateIsBlackberry = uaLowerCase.match(/(blackberry)/) !== null;
            if (privateIsBlackberry && !privateDetectOrientationBound) {
                on(window, "orientationchange", detectOrientation);
                privateDetectOrientationBound = true;
            }
        }


        /**
         * check for opera browser
         */
        function checkIfIsOpera() {
            privateIsOpera = uaLowerCase.match(/(opera)/) !== null;
        }


        /**
         * check for chrome browser
         */
        function checkIfIsChrome() {
            privateIsChrome = uaLowerCase.match(/(chrome)/) !== null;
        }


        /**
         * check for safari browser
         */
        function checkIfIsSafari() {
            privateIsSafari = uaLowerCase.match(/(safari)/) !== null;
        }


        /**
         * check for firefox browser
         */
        function checkIfIsFirefox() {
            privateIsFirefox = uaLowerCase.match(/(firefox)/) !== null;
        }


        /**
         * check for seamonkey browser
         */
        function checkIfIsSeamonkey() {
            privateIsSeamonkey = uaLowerCase.match(/(seamonkey)/) !== null;
        }


        /**
         * check for camino browser
         */
        function checkIfIsCamino() {
            privateIsCamino = uaLowerCase.match(/(camino)/) !== null;
        }


        /**
         * check for microsoft internet explorer
         */
        function checkIfIsMsie() {
            privateIsMsie = uaLowerCase.match(/(msie)/) !== null;
        }


        /**
         * check for ios browser
         */
        function checkIfIsiPad() {
            privateIsiPad = uaLowerCase.match(/(ipad)/) !== null;
            if (privateIsiPad && !privateDetectOrientationBound) {
                on(window, "orientationchange", detectOrientation);
                privateDetectOrientationBound = true;
            }
        }


        /**
         * check for ios browser
         */
        function checkIfIsiPhone() {
            privateIsiPhone = uaLowerCase.match(/(iphone)/) !== null;
            if (privateIsiPhone && !privateDetectOrientationBound) {
                on(window, "orientationchange", detectOrientation);
                privateDetectOrientationBound = true;
            }
        }


        /**
         * detect mobile browsers
         *
         * @see
         * - http://detectmobilebrowsers.com/
         */
        function checkIfIsMobileBrower() {
            privateIsMobileBrowser = false;

            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(uaLowerCase)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(uaLowerCase.substr(0, 4))) {
                privateIsMobileBrowser = true;
                if (!privateDetectOrientationBound) {
                    on(window, "orientationchange", detectOrientation);
                    privateDetectOrientationBound = true;
                }
            }
        }


        /**
         * check for browser version
         */
        function checkBrowserVersion() {
            var temp,
                info;

            info = uaLowerCase.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            if (info && (temp = ua.match(/version\/([\.\d]+)/i)) !== null) {
                info[2] = temp[1];
            }

            privateBrowserVersion = info ? info[2] : navigator.appVersion;
        }


        /**
         * check for ios version
         */
        function checkiOSVersion() {
        	checkIfIsiOS();
        	if (privateIsiOS) {

        		// supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        		var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);

        		privateIOSVersion = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        	}
        }


        /**
         * check for browser online state
         */
        function checkIfIsOnline() {
            if (privateIsOnline === undefined) {
                on(window, "online", checkIfIsOnline);
                on(window, "offline", checkIfIsOnline);
            }

            privateIsOnline = navigator.onLine !== undefined ? !!navigator.onLine : true;
        }


        /**
         * check for network information
         *
         * try to use navigator.connection object (Android 2.2+, W3C proposal)
         */
        function checkNetworkConnection() {

            // try to get connection object and create custom one if it's not available
            var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {
                    type: 0,
                    UNKNOWN: 0,
                    ETHERNET: 1,
                    WIFI: 2,
                    CELL_2G: 3,
                    CELL_3G: 4
                },
                detectNetwork = function () {
                    privateNetworkConnection = connection;
                };

            connection.onchange = detectNetwork;
            detectNetwork();
        }


        /**
         * public functions
         *
         * @interface
         */
        return {

            // is ios
            isiOS: function () {
                if (privateIsiOS === undefined) {
                    checkIfIsiOS();
                }
                return privateIsiOS;
            },

            // is webkit
            isWebkit: function () {
                if (privateIsWebkit === undefined) {
                    checkIfIsWebkit();
                }
                return privateIsWebkit;
            },

            // is android
            isAndroid: function () {
                if (privateIsAndroid === undefined) {
                    checkIfIsAndroid();
                }
                return privateIsAndroid;
            },

            // is blackberry
            isBlackberry: function () {
                if (privateIsBlackberry === undefined) {
                    checkIfIsBlackberry();
                }
                return privateIsBlackberry;
            },

            // is chrome
            isChrome: function () {
                if (privateIsChrome === undefined) {
                    checkIfIsChrome();
                }
                return privateIsChrome;
            },

            // is opera
            isOpera: function () {
                if (privateIsOpera === undefined) {
                    checkIfIsOpera();
                }
                return privateIsOpera;
            },

            // is safari
            isSafari: function () {
                if (privateIsSafari === undefined) {
                    checkIfIsSafari();
                }
                return privateIsSafari;
            },

            // is firefox
            isFirefox: function () {
                if (privateIsFirefox === undefined) {
                    checkIfIsFirefox();
                }
                return privateIsFirefox;
            },

            // is seamonkey
            isSeamonkey: function () {
                if (privateIsSeamonkey === undefined) {
                    checkIfIsSeamonkey();
                }
                return privateIsSeamonkey;
            },

            // is camino
            isCamino: function () {
                if (privateIsCamino === undefined) {
                    checkIfIsCamino();
                }
                return privateIsCamino;
            },

            // is microsoft internet explorer
            isMsie: function () {
                if (privateIsMsie === undefined) {
                    checkIfIsMsie();
                }
                return privateIsMsie;
            },

            // is apple ipad
            isiPad: function () {
                if (privateIsiPad === undefined) {
                    checkIfIsiPad();
                }
                return privateIsiPad;
            },

            // is apple ipad
            isiPhone: function () {
                if (privateIsiPhone === undefined) {
                    checkIfIsiPhone();
                }
                return privateIsiPhone;
            },

            // is mobile
            isMobile: function () {
                if (privateIsMobileBrowser === undefined) {
                    checkIfIsMobileBrower();
                }
                return privateIsMobileBrowser;
            },

            // get browser version
            getBrowserVersion: function () {
                if (privateBrowserVersion === undefined) {
                    checkBrowserVersion();
                }
                return privateBrowserVersion;
            },

            // get ios version
            getiOSVersion: function () {
                if (privateIOSVersion === undefined) {
                    checkiOSVersion();
                }
                return privateIOSVersion;
            },

            // is online or offline
            isOnline: function () {
                if (privateIsOnline === undefined) {
                    checkIfIsOnline();
                }
                return privateIsOnline;
            },

            // get network connection
            getNetworkConnection: function () {
                if (privateNetworkConnection === undefined) {
                    checkNetworkConnection();
                }
                return privateNetworkConnection;
            },

            // is standalone mode (apple web-app)
            isStandalone: function () {
                return (navigator.standalone !== undefined && navigator.standalone);
            },

            // is touch device
            isTouchDevice: function () {
                return !!('ontouchstart' in window) // works on most browsers
                    || (window.navigator.msMaxTouchPoints); // works on ie10
            },

            // get orientation degree
            orientation: function () {
                if (window.orientation) {
                    return window.orientation;
                }
                return 0;
            },

            // get orientation mode
            orientationMode: function () {
                if (privateOrientationMode === undefined) {
                    detectOrientation();
                }
                return privateOrientationMode;
            },

            // has retina display
            hasRetinaDisplay: function () {
                return (window.devicePixelRatio >= 2);
            },

            // has canvas support
            hasCanvas: function () {
                if (privateHasCanvas === undefined) {
                    var canvas = document.createElement('canvas');
                    privateHasCanvas = (!!(canvas.getContext && canvas.getContext('2d')));
                }
                return privateHasCanvas;
            },

            // hide mobile status bar
            hideStatusbar: function (delay) {

                // check params
                if (!delay) {
                    delay = 0;
                }

                // set delay and hide status bar if view is on top
                window.clearTimeout(privateHideStatusbarTimeout);
                privateHideStatusbarTimeout = window.setTimeout(function () {
                    if (parseInt(window.pageYOffset, 10) === 0) {
                        window.scrollTo(0, 1);
                    }
                }, delay);
            }

        };

    }());


    /**
     * global export
     *
     * @export
     */
    app.namespace('helpers.client', client);


}(window, window.navigator, window.getNamespace()));
/*jslint browser: true, devel: true, continue: true, regexp: true, plusplus: true, unparam: true  */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50 */
/*global window, document, console, XMLHttpRequest, ActiveXObject*/

/**
 * app.helpers.utils
 *
 * @description
 * - provide utility functions
 *
 * @author Ulrich Merkel, 2013
 * @version 0.1.8
 * 
 * @namespace app
 * 
 * @changelog
 * - 0.1.8 inArray function improved
 * - 0.1.7 trim string + sprintf functions added, isArray function improved
 * - 0.1.6 get queryString function added
 * - 0.1.5 moved dom functions to dom helpers, small function improvements
 * - 0.1.4 refactoring xhr function
 * - 0.1.3 createDomNode added
 * - 0.1.2 refactoring
 * - 0.1.1 bug fix xhr when trying to read binary data on ie
 * - 0.1 basic functions and structur
 *
 */
(function (window, document, app, undefined) {
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


    /**
     * utility functions
     *
     * following the singleton design pattern
     *
     */
    var utils = (function () {

        // init global vars
        var jsonObject = null,
            isConsole = (window.console !== undefined && window.console.log),
            isTime = (window.console !== undefined && console.time !== undefined && console.timeEnd !== undefined),
            emptyArray = [];

        /**
         * public functions
         *
         * @interface
         */
        return {

            /**
             * function to write logging message to screen
             * 
             * @param {string} message The message to log
             */
            logToScreen: function (message) {

                // init local vars
                var log = document.getElementById('log'),
                    p = document.createElement("p"),
                    text = document.createTextNode(message);

                // append message
                if (log) {
                    p.appendChild(text);
                    log.appendChild(p);
                }
            },


            /**
             * wrapper for console.log due to some browsers lack of this functions
             * 
             * @param {string} message The message to log
             */
            log: function (message) {

                // check for support
                if (isConsole) {
                    window.console.log(message);
                }

                // log messages to dom element
                utils.logToScreen(message);
            },


            /**
             * log timer start
             * 
             * @param {string} key The timer key
             */
            logTimerStart: function (key) {

                // check for support
                if (isTime) {
                    window.console.time(key);
                }

            },


            /**
             * log timer end
             * 
             * @param {string} key The timer key
             */
            logTimerEnd: function (key) {

                // check for support
                if (isTime) {
                    window.console.timeEnd(key);
                }

            },


            /**
             * check for callback function
             * 
             * @param {function} callback The function to check
             *
             * @return {function} The checked callback function
             */
            callback: function (callback) {
                // check if param is function, if not set it to empty function
                if (!callback || typeof callback !== 'function') {
                    callback = function () {};
                }

                // return checked callback function
                return callback;
            },


            /**
             * add event handler
             *
             * following the lazy loading design pattern, the on function will be
             * overridden with the correct implemation the first time it will be
             * called. after that all consequent calls deliver the correct one without
             * conditions for different browsers.
             * 
             * @param {string} target The dom object
             * @param {string} eventType The event type to bind
             * @param {function} handler The function to bind
             */
            on: function (target, eventType, handler) {

                /**
                 * override existing function based on
                 * browser capabilities
                 */

                if (typeof window.addEventListener === 'function') {
                    // dom2 event
                    utils.on = function (target, eventType, handler) {
                        target.addEventListener(eventType, handler, false);
                    };
                } else if (typeof document.attachEvent === 'function') {
                    // ie event
                    utils.on = function (target, eventType, handler) {
                        target.attachEvent('on' + eventType, handler);
                    };
                } else {
                    // older browers
                    utils.on = function (target, eventType, handler) {
                        target['on' + eventType] = handler;
                    };
                }

                // call the new function
                utils.on(target, eventType, handler);
            },


            /**
             * remove event handler
             *
             * following the lazy loading design pattern, the off function will be
             * overridden with the correct implemation the first time it will be
             * called. after that all consequent calls deliver the correct one without
             * conditions for different browsers.
             * 
             * @param {string} target The dom object
             * @param {string} eventType The event type to unbind
             * @param {function} handler The function to unbind
             */
            off: function (target, eventType, handler) {

                /**
                 * override existing function based on
                 * browser capabilities
                 */

                if (typeof window.removeEventListener === 'function') {
                    // dom2 event
                    utils.off = function (target, eventType, handler) {
                        target.removeEventListener(eventType, handler, false);
                    };
                } else if (typeof document.detachEvent === 'function') {
                    // ie event
                    utils.off = function (target, eventType, handler) {
                        target.detachEvent('on' + eventType, handler);
                    };
                } else {
                    // older browsers
                    utils.off = function (target, eventType) {
                        target['on' + eventType] = null;
                    };
                }

                // call the new function
                utils.off(target, eventType, handler);

            },


            /**
             * get xhr object
             *
             * @return {object} The new xhr request object or null
             */
            getXhr: function () {

                // set xhr vars
                var xhrObject = null,
                    XMLHttpFactories = [
                        // mozilla, opera, safari and internet explorer (since version 7)
                        function () {
                            return new XMLHttpRequest();
                        },
                        // internet explorer (since version 5)
                        function () {
                            return new ActiveXObject("Msxml2.XMLHTTP");
                        },
                        function () {
                            return new ActiveXObject("Msxml3.XMLHTTP");
                        },
                        // internet explorer (since version 6)
                        function () {
                            return new ActiveXObject("Microsoft.XMLHTTP");
                        }
                    ],
                    length = XMLHttpFactories.length,
                    i = 0;

                // toggle through factories and try to init xhr object
                for (i = 0; i < length; i = i + 1) {
                    try {
                        xhrObject = XMLHttpFactories[i]();
                    } catch (e) {
                        continue;
                    }
                    break;
                }

                // return ajax object
                return xhrObject;
            },


            /**
             * make ajax request
             * 
             * @param {string} url The required url to load
             * @param {function} callback The required callback after success
             * @param {boolean} async The optional async parameter to load xhr async or sync 
             * @param {string} postData The optional post request data to send
             */
            xhr: function (url, callback, async, postData) {

                // init local function vars
                var reqObject = utils.getXhr(),
                    reqCallback,
                    reqType = 'GET';

                // check callback parameter
                callback = utils.callback(callback);

                // if ajax is available
                if (reqObject) {

                    // check parameters (url, request type, async and post data)
                    if (!url) {
                        callback(false);
                        return;
                    }
                    if (postData !== undefined) {
                        reqType = 'POST';
                    } else {
                        postData = null;
                    }
                    if (async === undefined) {
                        async = true;
                    }

                    // listen to results
                    reqCallback = function () {

                        /**
                         * ready states
                         *
                         * reqObject.readyStates:
                         * 0: request not initialized
                         * 1: server connection established
                         * 2: request received
                         * 3: processing request
                         * 4: request finished and response is ready
                         *
                         * reqObject.status:
                         * 200: the request was fulfilled, codes between 200 and < 400 indicate that everything is okay
                         * 400: the request had bad syntax or was inherently impossible to be satisfied, codes >= 400 indicate errors
                         * 
                         */

                        if (reqObject.readyState === 4 && ((reqObject.status >= 200 && reqObject.status < 400) || reqObject.status === 0)) {

                            /**
                             * checking additionally for response text parsing
                             * 
                             * binary data (like images) could not be resolved for ajax
                             * calls in ie and is throwing an error if we try to do so
                             */
                            try {
                                var data = reqObject.responseText;
                                if (data) {
                                    callback(data);
                                } else {
                                    callback(false);
                                }
                            } catch (e) {
                                callback(false);
                            }

                        }

                    };

                    // open ajax request and listen for events
                    reqObject.open(reqType, url, async);

                    /**
                     * listen to results, onreadystatechange for ie7+ and onload for others
                     * try catch is added for ie6 (object error for onreadystatechange)
                     */
                    try {
                        if (reqObject.onreadystatechange !== undefined) {
                            reqObject.onreadystatechange = reqCallback;
                        } else if (reqObject.onload !== undefined) {
                            reqObject.onload = reqCallback;
                        }
                    } catch (e) {
                        // delete handler if already bound
                        reqObject.onload = null;
                        reqObject.onload = reqCallback;
                    }

                    // send request
                    reqObject.send(postData);

                } else {
                    callback(false);
                }

            },


            /**
             * get json object
             *
             * @return {object} The window.JSON object or null
             */
            getJson: function () {

                // check for json support
                if (null === jsonObject) {
                    if (window.JSON && window.JSON.stringify) {
                        jsonObject = window.JSON;
                    }
                }

                //return the json object
                return jsonObject;

            },


            /**
             * convert json object to string
             *
             * @param {object} object The object to be parsed
             * 
             * @return {string} The converted string
             */
            jsonToString: function (object) {

                // init local vars
                var result = false;

                // check for json object
                if (null === jsonObject) {
                    jsonObject = utils.getJson();
                }

                // convert object to string
                if (jsonObject && object) {
                    result = jsonObject.stringify(object);
                }

                //return the json string
                return result;

            },


            /**
             * convert string into json object
             *
             * @param {string} string The string to be parsed
             * 
             * @return {object} The converted object
             */
            jsonToObject: function (string) {

                // init local vars
                var result = false;

                // check for json object
                if (null === jsonObject) {
                    jsonObject = utils.getJson();
                }

                // convert object to string
                if (jsonObject && string) {
                    result = jsonObject.parse(string);
                }

                //return the json object
                return result;
            },


            /**
             * get url information
             * 
             * @param {string} url The url to extract
             *
             * @return {object} Current url information
             */
            url: function (url) {

                // check params
                if (!url) {
                    return;
                }

                // create test link elmenent
                var a = document.createElement('a'),
                    getFolder = function () {
                        var index = url.lastIndexOf('/'),
                            result = url.substr(0, index + 1);
                        return result;
                    },
                    pathname;

                // set props
                a.href = url;
                pathname = a.pathname.match(/\/([^\/?#]+)$/i);

                // return url information
                return {
                    source: url,
                    protocol: a.protocol,
                    host: a.hostname,
                    port: a.port,
                    query: a.search,
                    file: pathname ? pathname[1] : '/',
                    hash: a.hash,
                    path: a.pathname.replace(/^([^\/])/, '/$1'),
                    folder: getFolder()
                };
            },


            /**
             * get url query string
             *
             * @return {object} Current url query strings
             */
            queryString: (function () {

                var query_string = {},
                    query = window.location.search.substring(1),
                    vars = query.split("&"),
                    varsLength = vars.length,
                    i = 0,
                    pair,
                    arr;

                for (i = 0; i < varsLength; i = i + 1) {

                    // get value pairs
                    pair = vars[i].split("=");

                    // if first entry with this name
                    if (query_string[pair[0]] === undefined) {
                        query_string[pair[0]] = pair[1];
                    // if second entry with this name
                    } else if (typeof query_string[pair[0]] === "string") {
                        arr = [query_string[pair[0]], pair[1]];
                        query_string[pair[0]] = arr;
                    // if third or later entry with this name
                    } else {
                        query_string[pair[0]].push(pair[1]);
                    }

                }

                return query_string;

            }()),


            /**
             * text replacement for simple client-side templates
             *
             * @example
             * <li><a href="%s">%s</a></li>
             * var result = sprintf(templateText, "/item/4", "Fourth item");
             *
             * @param {string} text The template string
             *
             * @return {string} The string with replaced placeholders
             */
            sprintf: function (text) {
                var i = 1,
                    args = arguments;

                return text.replace(/%s/g, function () {
                    return (i < args.length) ? args[i++] : "";
                });

            },


            /**
             * trim string, delete whitespace in front/back
             *
             * @param {string} string The string to trim
             *
             * @return {string} The trimmed string value
             */
            trim: function (string) {

                /**
                 * check fo native string trim function, otherwise
                 * initialize it
                 */
                if (typeof String.prototype.trim !== 'function') {
                    String.prototype.trim = function () {
                        return this.replace(/^\s+|\s+$/g, '');
                    };
                }

                // return trimmed string
                return string.trim();

            },


            /**
             * check if value is array
             *
             * following the lazy loading design pattern, the isArray function will be
             * overridden with the correct browser implemation the first time it will be
             * called. after that all consequent calls deliver the correct one without
             * conditions for different browsers.
             *
             * @see nicolas c. zakas - maintainable javascript, writing readable code (o'reilly s.88)
             * 
             * @param {array} value The value to check
             *
             * @return {boolean} Whether the given value is an array or not
             */
            isArray: function (value) {

                /**
                 * override existing function based on
                 * browser capabilities
                 */

                if (!!Array.isArray && typeof Array.isArray === "function") {
                    // ECMA Script 5
                    utils.isArray = function (value) {
                        return Array.isArray(value);
                    };
                } else if (!!Object.prototype.toString && Object.prototype.toString === "function") {
                    // Juriy Zaytsev (aka Kangax)
                    utils.isArray = function (value) {
                        return Object.prototype.toString.call(value) === "[object Array]";
                    };
                } else {
                    // Duck typing arrays (by Douglas Crockford), asume sort function is only available for arrays
                    utils.isArray = function (value) {
                        return (!!value.sort && typeof value.sort === "function");
                    };
                }

                // call the new function
                return utils.isArray(value);

            },


            /**
             * check if value is in array
             *
             * following the lazy loading design pattern, the inArray function will be
             * overridden with the correct browser implemation the first time it will be
             * called. after that all consequent calls deliver the correct one without
             * conditions for different browsers.
             * 
             * @param {string} elem The value to check
             * @param {array} array The array to check
             * @param {number|undefined} index The optional index in array
             *
             * @returns {integer} Whether the value is in (return index) or not (return -1)
             */    
            inArray: function (value, array, index) {

                /**
                 * override existing function based on
                 * browser capabilities
                 */

                if (!!Array.prototype.indexOf) {
                    // ECMA Script 5
                    utils.inArray = function (value, array, index) {
                        return emptyArray.indexOf.call(array, value, index);
                    };
                } else {
                    // fallback for old browsers
                    utils.inArray = function (value, array, index) {

                        var arrayLength = array.length,
                            j = 0;

                        // check for index value if set
                        if (!!index) {
                            if (!!array[index] && array[index] === value) {
                                return index;
                            }
                            return -1;
                        }

                        // toggle through array
                        for (j = 0; j < arrayLength; j = j + 1) {
                            if (array[j] === value) {
                                return j;
                            }
                        }

                        // value not found
                        return -1;
                    };
                }

                // call the new function
                return utils.inArray(value, array, index);

            }

        };

    }());


    /**
     * global export
     *
     * @export
     */
    app.namespace('helpers.utils', utils);


}(window, document, window.getNamespace())); // immediatly invoke function

/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */

(function($) {

  var o = $({});

  $.subscribe = function() {
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    o.trigger.apply(o, arguments);
  };

}(jQuery));
/*
 * jQuery Reveal Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function($) {

/*---------------------------
 Defaults for Reveal
----------------------------*/
	 
/*---------------------------
 Listener for data-reveal-id attributes
----------------------------*/

	$('a[data-reveal-id]').on('click', function(e) {
		e.preventDefault();
		var modalLocation = $(this).attr('data-reveal-id');
		$('#'+modalLocation).reveal($(this).data());
	});

/*---------------------------
 Extend and Execute
----------------------------*/

    $.fn.reveal = function(options) {
        
        
        var defaults = {  
	    	animation: 'fadeAndPop', //fade, fadeAndPop, none
		    animationspeed: 300, //how fast animtions are
		    closeonbackgroundclick: true, //if you click background will modal close?
		    dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
    	}; 
    	
        //Extend dem' options
        var options = $.extend({}, defaults, options); 
	
        return this.each(function() {
        
/*---------------------------
 Global Variables
----------------------------*/
        	var modal = $(this),
        		topMeasure  = parseInt(modal.css('top')),
				topOffset = modal.height() + topMeasure,
          		locked = false,
				modalBG = $('.reveal-modal-bg');

/*---------------------------
 Create Modal BG
----------------------------*/
			if(modalBG.length == 0) {
				modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
			}		    
     
/*---------------------------
 Open & Close Animations
----------------------------*/
			//Entrance Animations
			modal.bind('reveal:open', function () {
			  modalBG.unbind('click.modalEvent');
				$('.' + options.dismissmodalclass).unbind('click.modalEvent');
				if(!locked) {
					lockModal();
					if(options.animation == "fadeAndPop") {
						modal.css({'top': $(document).scrollTop()-topOffset, 'opacity' : 0, 'visibility' : 'visible'});
						modalBG.fadeIn(options.animationspeed/2);
						modal.delay(options.animationspeed/2).animate({
							"top": $(document).scrollTop()+topMeasure + 'px',
							"opacity" : 1
						}, options.animationspeed,unlockModal());					
					}
					if(options.animation == "fade") {
						modal.css({'opacity' : 0, 'visibility' : 'visible', 'top': $(document).scrollTop()+topMeasure});
						modalBG.fadeIn(options.animationspeed/2);
						modal.delay(options.animationspeed/2).animate({
							"opacity" : 1
						}, options.animationspeed,unlockModal());					
					} 
					if(options.animation == "none") {
						modal.css({'visibility' : 'visible', 'top':$(document).scrollTop()+topMeasure});
						modalBG.css({"display":"block"});	
						unlockModal()				
					}
					modal.addClass("opened");
				}
				modal.unbind('reveal:open');
			}); 	

			//Closing Animation
			modal.bind('reveal:close', function () {
				if (!locked) {
					lockModal();
					if (options.animation == "fadeAndPop") {
						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"top":  $(document).scrollTop()-topOffset + 'px',
							"opacity" : 0
						}, options.animationspeed/2, function() {
							modal.css({'top':topMeasure, 'opacity' : 1, 'visibility' : 'hidden'});
							unlockModal();
						});					
					}  	
					if (options.animation == "fade") {
						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"opacity" : 0
						}, options.animationspeed, function() {
							modal.css({'opacity' : 1, 'visibility' : 'hidden', 'top' : topMeasure});
							unlockModal();
						});					
					}  	
					if (options.animation == "none") {
						modal.css({'visibility' : 'hidden', 'top' : topMeasure});
						modalBG.css({'display' : 'none'});	
					}
					modal.removeClass("opened");
					modal.trigger('reveal:closed')
				}
				modal.unbind('reveal:close');
			});     
   	
/*---------------------------
 Open and add Closing Listeners
----------------------------*/
        	//Open Modal Immediately
    	modal.trigger('reveal:open')
			
			//Close Modal Listeners
			var closeButton = $('.' + options.dismissmodalclass).bind('click.modalEvent', function (e) {
				e.preventDefault();
				modal.trigger('reveal:close')
			});
			
			if(options.closeonbackgroundclick) {
				modalBG.css({"cursor":"pointer"})
				modalBG.bind('click.modalEvent', function () {
				  modal.trigger('reveal:close')
				});
			}
			$('body').keyup(function(e) {
        		if(e.which===27){ modal.trigger('reveal:close'); } // 27 is the keycode for the Escape key
			});
			
			
/*---------------------------
 Animations Locks
----------------------------*/
			function unlockModal() { 
				locked = false;
			}
			function lockModal() {
				locked = true;
			}	
			
        });//each call
    }//orbit plugin call
})(jQuery);
        

/*global window*/
/*global document*/

/**
 * jQuery plugin fullscreen
 * 
 * @description
 * - toggle fullscreen mode if available
 * 
 * @author hello@ulrichmerkel.com (Ulrich Merkel)
 * @version 0.1.2
 * 
 * @requires
 * - jQuery 1.8.2
 *
 * @see
 * -
 * 
 * @changelog
 * - 0.1.2 added namespace interface
 * - 0.1.1 refactoring
 * - 0.1 basic functions
 *
 * @bugs
 * - 
 * 
 */
(function (document, $, ns, undefined) {

    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     *
     * window, jquery and app are passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */

    /**
     * extend options with defaults, global vars
     * 
     */
    var docElm = document.documentElement,
        boolIsSupported,
        opts;


    /**
     * check support
     *
     * @param {boolean} Whether fullscreen is supported or not
     */
    function isSupported() {
        if (boolIsSupported === undefined) {
            boolIsSupported = !!docElm && (!!docElm.requestFullscreen || !!docElm.mozRequestFullScreen || !!docElm.webkitRequestFullScreen);
        }
        return boolIsSupported;
    }


    /**
     * check is fullscreen active
     *
     * @param {boolean} Whether fullscreen is active or not
     */
    function isFullscreenActive() {
        return !!document.fullScreen || !!document.mozFullScreen || !!document.webkitIsFullScreen;
    }


    /**
     * enter fullscreen mode
     * 
     */
    function enter() {
        // check vendor prefixes
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
    }


    /**
     * exit fullscreen mode
     * 
     */
    function exit() {
        // check vendor prefixes
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }


    /**
     * custom change event handler
     * 
     */
    function change() {
        
    }


    /**
     * toggle fullscreen mode
     * 
     */
    function fullscreen() {
        var $btn = $('.button-game-fullscreen'),
            $label = $btn.find('.button-label'),
            $icon = $btn.find('.icomoon');

        if (isSupported()) {
            if (isFullscreenActive()) {
                exit();
                $label.text('Fullscreen On');
                $icon.removeClass('icon-contract').addClass('icon-expand');
            } else {
                enter();
                $label.text('Fullscreen Off');
                $icon.addClass('icon-contract').removeClass('icon-expand');
            }
        }
    }

    /**
     * global namespace export
     *
     * @export
     */
    ns.namespace('plugins.fullscreen', fullscreen);


    /**
     * $.fn.fullscreen
     *
     * jquery plugin wrapper
     *
     * @param {} args
     * @param {} cb
     */
    $.fn.fullscreen = function (args, cb) {

        /**
         * init defaults
         * 
         */
        $.fn.fullscreen.defaults = {
            sel: {
                elem: '.btn-fullscreen'
            }
        };


        /**
         * extend options with defaults
         * 
         */
        opts = $.extend(true, {}, $.fn.fullscreen.defaults, args, {cb: cb});


        /**
         * bind events
         *
         * @param {object} $obj The jQuery object
         */
        function bindEventHandlers($obj) {

            // fullscreen events
            var $doc = $(document);
            $doc.bind('fullscreenchange', change);
            $doc.bind('mozfullscreenchange', change);
            $doc.bind('webkitfullscreenchange', change);

            // btn click
            $obj.bind({
                'click.fullscreen': function (e) {
                    e.preventDefault();
                    fullscreen();
                }
            });

        }


        /**
         * main function, init plugin
         *
         * @param {object} opts The plugin options
         * @param {object} obj The plugin selector object
         */
        function initialize(opts, $obj) {

            if (!$obj.length) {
                return;
            }

            // check for support
            if (isSupported()) {

                $obj.show();

                // check init state
                var data = $obj.data('fullscreen');
                if (!data) {

                    // setup functions
                    bindEventHandlers($obj);
                    $obj.data('fullscreen', 'initialized');

                }
            } else {
                $obj.hide();
            }

            // check for callback function
            if ($.isFunction(opts.cb)) {
                opts.cb.call();
            }

        }


        /**
         * return this for chaining and run
         * initialize function, allow multiple items via each
         */
        return this.each(function () {
            initialize(opts, $(this));
        });

    };

}(document, window.jQuery, window.getNamespace()));
/**
 * jQuery plugin styledCheckbox
 * @description replace checkbox input with images
 * @author hello@ulrichmerkel.com (Ulrich Merkel)
 * @version 0.1.3
 * 
 * @requires
 * - jQuery 1.7.2
 * - global config var
 * - jQuery touchclick plugin
 * 
 * @changelog
 * - 0.1.3 refactoring, touchclick removed
 * - 0.1.2 touchclick added, bug fix multiple checkboxes
 * - 0.1.1 setting unique id, bug fixes onload
 * - 0.1 basic functions and plugin structur
 *
 * @bugs
 * - 
 * 
 **/
(function ($, undefined) {
	'use strict';

	/**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     *
     * jquery is passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */


	/* create the defaults once */
    var pluginName = 'styledCheckbox',
        defaults = {
            selectors: {
				wrapperId: '#styledCheckbox',
				wrapperClass: '.styledCheckbox-wrapper',
				replacementClass: '.styledCheckbox',
				checkedClass: '.checked'
			}
        };


	/**
     * the actual plugin constructor
     *
     * @constructor
     * @param {object} element The dom object
     * @param {object} options The plugin options
     */
    function Plugin(element, options) {
		this.$elem = $(element);
		this.options = $.extend(true, {}, defaults, options);
        this.init();
    }

	/**
	 * plugin methods
	 *
	 * @interface
	 */
	Plugin.prototype = {

		 /**
         * render styled replace
         */
		renderReplace: function () {

			var self = this,
				opts = self.options,
				sel = opts.selectors,
				$elem = self.$elem,
				$wrapper,
				$replacement,
				$parent,
				parentOffset,
				$label;

			// store label for later use
			$label = $elem.next('label');
			self.$label = $label;

			// render replace element
			$parent = $elem.parent();
			parentOffset = $parent.offset();
			$wrapper = $('<div>', {
				'id': sel.wrapperId.substr(1) + '-' + parentOffset.top + '-' + parentOffset.left,
				'class': sel.wrapperClass.substr(1)
			});
			$replacement = $('<div>', {
				'class': sel.replacementClass.substr(1)
			});

			// check for checked state
			if ($elem.attr('checked') === 'checked') {
				$replacement.addClass(sel.checkedClass.substr(1));
			}

			// append it to dom and set plugin reference
			$wrapper
				.append($elem)
				.append($replacement)
				.prependTo($parent);

			self.$replacement = $replacement;

		},


        /**
         * handle events
         */
		events: function () {

			var self = this;

			self.$replacement.on({
				'click.styledCheckbox touchstart.styledCheckbox': $.proxy(function () {
					self.toggleChecked();
				}, self)
			});
			self.$label.on({
				'click.styledCheckbox touchstart.styledCheckbox': $.proxy(function (e) {
					e.preventDefault();
					self.toggleChecked();
				}, self)
			});
		},


		/**
         * toggle checked on and off
         *
         */
        toggleChecked: function () {

            var self = this,
				optsClass = self.options.selectors.checkedClass.substr(1),
				$elem = self.$elem,
				$replacement = self.$replacement;

            if ($replacement.hasClass('checked')) {
				$elem.removeAttr('checked');
				$replacement.removeClass(optsClass);
			} else {
				$elem.attr('checked', 'checked');
				$replacement.addClass(optsClass);
			}

        },


		/**
         * main function, init plugin
         *
         */
		init: function () {

			this.renderReplace();
			this.events();

		}

	};


	/**
	 * a really lightweight plugin wrapper around the constructor,
     * preventing against multiple instantiations
     */
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
        });
    };

}(window.jQuery));
/**
 * jQuery plugin tooltip
 * @description set mouseover tooltip
 * @author hello@ulrichmerkel.com (Ulrich Merkel)
 * @version 0.4.7
 * 
 * @requires
 * - jQuery 1.7.1
 * - global cfg var
 * - jQuery app.helper functions
 * 
 * @changelog
 * - 0.4.7 bug fixes if title string is empty
 * - 0.4.6 bug fixes
 * - 0.4.5 new config sel
 * - 0.4.4 new hideTooltip function
 * - 0.4.3 refactoring, stay in viewport added
 * - 0.4.2 changed global client to app
 * - 0.4.1 bug fixes if no attribute is available
 * - 0.4 bug fixes
 * - 0.3 removed coding overhead
 * - 0.2 bug fixes
 * - 0.1 basic functions and plugin structur
 *
 * @bugs
 * - check if tooltip position is not null
 * - check position to stay in viewport
 * - performance (delagate, save objects)
 * 
 **/
(function (window, document, $, app) {
	'use strict';

	$.fn.tooltip = function (arg, callback) {

		/* defaults */
		$.fn.tooltip.defaults = {
			sel: {
				elem: '.tooltip',
				tooltipId: '#tooltip',
				attrSelector: 'title'
			},
			fadeTime: 300,
			delay: 500,
			boxOffsetX: -60,
			boxOffsetY: -20,
			replaceString: ''
		};

		/* extend options with defaults, global vars for mouseEvent Listener */
		var options = $.extend(true, $.fn.tooltip.defaults, arg, {callback: callback}),
			newEventX = 0,
			newEventY = 0,
			timeout,
			client = app.helpers.client;

		/* init callback */
		function callFn(callback) {
			if ($.isFunction(callback)) {
				callback.call();
			}
		}

		/* grab Attribute */
		function grabAttr(obj) {
			obj.each(function () {
				var $this = $(this),
					attr = options.sel.attrSelector,
					titleString =  $this.attr(attr),
                    data = null;

				if (!titleString) {
					titleString = $this.data(attr);
				}
				if (titleString) {
					data = $.data(this, attr, titleString.replace(options.replaceString, ''));
					$this.removeAttr(attr);
				}
			});
		}

		/* get position to stay in viewport */
		function getPosition(tooltip) {
			var $document = $(document),
				docWidth = $document.width(),
				docHeight = $document.height(),
				left = 0,
				top = 0;

			/* check horizontal */
			if (newEventX + tooltip.width + options.boxOffsetX > docWidth) {
				left = docWidth - tooltip.width;
			} else if (newEventX + options.boxOffsetX < 0) {
				left = 0;
			} else {
				left = newEventX + options.boxOffsetX;
			}

			/* check vertical */
			if (newEventY + tooltip.height + options.boxOffsetY > docHeight) {
				top = newEventY - tooltip.height - 10;
			} else if (newEventY + options.boxOffsetY < 0) {
				top = 0;
			} else {
				top = newEventY + options.boxOffsetY;
			}

			return {
				left: left,
				top: top
			};
		}

		/* show function */
		function showTooltip(content) {
			var $tooltip,
				tooltip = {},
				sel = options.sel.tooltipId,
				position;

			$tooltip = $('<div>', {
				id: sel.substr(1),
				css: {
					position: 'absolute',
					width: options.boxWidth,
					height: options.boxHeight,
					display: 'none'
				},
				html: content
			}).appendTo('body');

			tooltip = {
				width: $tooltip.outerWidth(true),
				height: $tooltip.outerHeight(true)
			};

			/* fix for older browsers when they don't init mouseposition after window load correctly */
			position = getPosition(tooltip);
			if (position.left === 0 && position.right === 0) {
				return;
			}

			$tooltip.css(position).fadeIn(options.fadeTime);
		}

		/* hide function */
		function hideTooltip() {
			$(options.sel.tooltipId).fadeOut(
				options.fadeTime,
				function () {
					$(this).remove();
				}
			);
			window.clearTimeout(timeout);
		}

		/* bind or unbind mouseenter mouseleave mousemove events */
		function bindEventHandlers(obj) {
			var sel = options.sel,
				tooltipId = sel.tooltipId,
				attr = sel.attrSelector,
				tooltip = {},
				data;

			obj.each(function () {
				$(this).bind({
					'mouseenter.tooltip': function () {
						data = $.data(this, attr);

						if (!data) {
							grabAttr(this);
						}
						if ($(tooltipId).css("opacity") !== 0) {
							$(tooltipId).stop().remove();
						}
						if (data) {
							timeout = window.setTimeout(function () { showTooltip(data); }, options.delay);
							data = $.data(this, attr);
						}
						
					},
					'mouseleave.tooltip': function () {
						hideTooltip();
					},
					'mousemove.tooltip': function (evt) {
						tooltip = {
							width: $(tooltipId).outerWidth(true),
							height: $(tooltipId).outerHeight(true)
						};
						newEventX = evt.pageX;
						newEventY = evt.pageY;
						$(tooltipId).css(getPosition(tooltip));
					}
				});
			});
			$(window).bind({
				'scrolling': function () {
					hideTooltip();
				}
			});
		}

		/* main function */
		function initialize(opts, obj) {
			if (!obj.length || client.isMobile()) {
				return;
			}
			grabAttr(obj);
			bindEventHandlers(obj);
			callFn(opts.callback);
		}

		/* return public functions and chaining */
		return this.each(function () {
			//initialize(options, $(this));
		});
	};

	$.fn.tooltip.destroy = function (obj, options) {
		if (!$(obj).length) {
			return;
		}
		$('#tooltip').remove();
		$(obj).each(function () {
			$(this).unbind('mouseenter.tooltip mouseleave.tooltip mousemove.tooltip');
		});
	};

}(window, document, window.jQuery, window.getNamespace()));
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


/**
 * app.pacman.tools
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

    var pacman = app.pacman || {};

    // "toolset"
    // helper functions
    pacman.tools = (function() {
        // returns movement in x and y directions: 0 = right, 1 = down, 2 = left, 3 = up
        function getMovement(direction) {
            switch (direction) {
                case 0:
                    return {x: 1, y: 0};
                case 1:
                    return {x: 0, y: 1};
                case 2:
                    return {x: -1, y: 0};
                case 3:
                    return {x: 0, y: -1};
            }
        }
    
        // euclidean distance between two points
        function distanceBetween(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }
    
        // gives position in grid by pixel position
        function getTilePosition(position) {
            return {
                row: Math.floor(position.y / pacman.config.tileSize),
                col: Math.floor(position.x / pacman.config.tileSize)
            };
        }
    
        // ascending sorter
        function sortByDistance(a, b) {
            return a.distance - b.distance;
        }
    
        // speed functions
        function baseSpeed() {
            return pacman.config.tileSize / 10;
        }
    
        function playerSpeed(mode) {
            var base = baseSpeed();
            var level = pacman.stats.level;
            switch (mode) {
                case "fright":
                    // in fright mode: levels 1-14 (85+level)% of base speed
                    if (level < 15) {
                        return (85 + level) / 100 * base;
                    }
                    // after level 14 100% of base speed
                    return base;
                    break;
                default:
                    // in other modes: levels 1-20 (80+level)% of base speed
                    if (level <= 20) {
                        return (80 + level) / 100 * base;
                    }
                    // drops to 90% base speed after level 20
                    return 0.9 * base;
                    break;
            }
        }
    
        function enemySpeed(mode, elroyLevel) {
            var base = baseSpeed();
            var level = pacman.stats.level;
            switch (mode) {
                // while dead 150% base speed
                case "dead":
                    return 1.5 * base;
                    // in fright mode slow down to 60% base speed
                case "fright":
                    return 0.6 * base;
                default:
                    // in other modes: levels 1-19 (75 + level + elroyLevel * 5)%  base speed
                    if (level < 20) {
                        return (75 + level + elroyLevel * 5) / 100 * base;
                    }
                    // after level 19 (95 + elroyLevel * 5)% base speed
                    return (0.95 + elroyLevel * 5) * base;
    
            }
        }
    
        // calculates bonus symbol point by level
        function symbolPoints() {
            var level = pacman.stats.level;
            if (level <= 5) {
                return level * 200 - 100;
            }
            if (level < 10) {
                return level * 500;
            }
            return 5000;
        }
    
        // returns elroy level 1 dots left limit
        function elroyLevel() {
            var level = pacman.stats.level;
            // levels 1-2
            if (level <= 2) {
                return 30;
            }
            // levels 3-5
            if (level <= 5) {
                return 40;
            }
            // levels 6-8
            if (level <= 8) {
                return 50;
            }
            // levels 9-11
            if (level <= 11) {
                return 60;
            }
            // levels 12-14
            if (level <= 14) {
                return 80;
            }
            // levels 15-17
            if (level <= 17) {
                return 100;
            }
            // all the rest
            return 120;
        }
    
        return {
            getMovement: getMovement,
            distanceBetween: distanceBetween,
            getTilePosition: getTilePosition,
            sortByDistance: sortByDistance,
            playerSpeed: playerSpeed,
            enemySpeed: enemySpeed,
            elroyLevel: elroyLevel
        };
    })();

}(window.app || {}));

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
/*global window, app*/

/**
 * app.pacman.enemy
 * 
 * @description
 * - setup enemy controller
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
(function (app, undefined) {

    
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
    var log = app.helpers.utils.log,
        pacman = app.pacman || {},
        Enemy;


    /**
     * enemy
     *
     * @constructor
     * @param {}
     * @param {}
     */
    Enemy = function (name, startPosition) {

        var self = this;

        // set name
        self.name = name;

        // set position and movement
        self.originalStart = startPosition;
        self.position = startPosition;
        self.movement = {x: -1, y: 0};
        self.untilNextTile = pacman.config.tileSize / 2;

        // ghost mode
        self.mode = "chase";
        self.forcedTarget = pacman.goodTarget;
        self.elroyLevel = 0;

        // get enemy with given name, choose javascript object from ai
        if (!!pacman.ai[self.name]) {
            self.ai = pacman.ai[self.name];
        } else {
            log('Enemy with name ' + self.name + ' is not available!');
            return;
        }

        // set color    
        self.colour = pacman.config.colours.ghost[self.name];
    
    
        // paper objects

        // body
        self.body = pacman.paper.path();
        // left eye
        self.leftEye = pacman.paper.circle(0, 0, 0);
        self.leftPupil = pacman.paper.circle(0, 0, 0);
        // right eye
        self.rightEye = pacman.paper.circle(0, 0, 0);
        self.rightPupil = pacman.paper.circle(0, 0, 0);


        /**
         * animate enemy
         *
         */
        self.animate = function () {

            // animate body
            this.body.attr(pacman.svg.ghostBody(this.position, this.colour));

            // animate left eye and pupil
            this.leftEye.attr(pacman.svg.ghostEye("left", this.position));
            this.leftPupil.attr(pacman.svg.ghostPupil("left", this.position, this.movement));

            // animate right eye and pupil
            this.rightEye.attr(pacman.svg.ghostEye("right", this.position));
            this.rightPupil.attr(pacman.svg.ghostPupil("right", this.position, this.movement));

        };


        /**
         * move enemy
         *
         */
        self.move = function() {

            var speed = pacman.tools.enemySpeed(this.mode, this.elroyLevel),
                ownTilePosition = pacman.tools.getTilePosition(this.position),
                newMovement,
                speedLeft;
            
            // half speed if in tunnel and not dead
            if (this.mode !== "dead" && pacman.slowMovement[ownTilePosition.row][ownTilePosition.col]) {
                speed /= 2;
            }
    
            if (speed <= this.untilNextTile) {
                this.untilNextTile -= speed;
                this.doMovement(speed);
            } else {

                // if we go over the middle (speed > the distance to next tile)
                this.doMovement(this.untilNextTile);

                // now ghost is in the middle of the tile, time to do decisions
    
                // if we are at the good target
                if (pacman.goodTarget.col === ownTilePosition.col && pacman.goodTarget.row === ownTilePosition.row) {

                    // and dead, start going in
                    if (this.mode === "dead") {
                        this.forcedTarget = pacman.ghostHome;
                    } else {
                        // if not dead clear forced target
                        this.forcedTarget = null;
                    }

                } else if (this.mode === "dead" && pacman.ghostHome.col === ownTilePosition.col && pacman.ghostHome.row === ownTilePosition.row) {

                    // if ghost is home and dead, reset to chase
                    this.mode = "";
                    this.setMode("chase");
                    // target force to get out of pen
                    this.forcedTarget = pacman.goodTarget;

                }
    
                newMovement = this.ai.getMovement(this.movement, ownTilePosition, this.mode, this.forcedTarget);
                if (newMovement !== undefined) {
                    this.movement = newMovement;
                }
                speedLeft = speed - this.untilNextTile;
                this.doMovement(speedLeft);
                this.untilNextTile = pacman.config.tileSize - speedLeft;
            }
    
            // corrects position if we move outside the grid
            this.correctPosition();

        };


        /**
         * move enemy
         *
         * @param {} speed
         */
        this.doMovement = function (speed) {
            var newPosition = {
                x: this.position.x + speed * this.movement.x,
                y: this.position.y + speed * this.movement.y
            };

            this.position = newPosition;
        };


        /**
         * correct position
         *
         * moves object to the other side if it moves outside grid
         */
        this.correctPosition = function () {

            // going out from left
            if (this.position.x < 0) {
                this.position.x += pacman.config.tileSize * pacman.fieldInUse.width;
            }

            // going out from right
            if (this.position.x > pacman.config.tileSize * pacman.fieldInUse.width) {
                this.position.x -= pacman.config.tileSize * pacman.fieldInUse.width;
            }

            // going out from top
            if (this.position.y < 0) {
                this.position.y += pacman.config.tileSize * pacman.fieldInUse.height;
            }

            // going out from bottom
            if (this.position.y > pacman.config.tileSize * pacman.fieldInUse.height) {
                this.position.y -= pacman.config.tileSize * pacman.fieldInUse.height;
            }

        };


        /**
         * set ghost mode
         *
         * @param {} mode
         */
        this.setMode = function (mode) {

            switch (mode) {
            // can only turn to chase, scatter or frightened if not dead
            case "chase":
            case "scatter":
            case "fright":
                if (this.mode !== "dead") {
                    this.mode = mode;
                }
                break;
            // can always turn dead or going out
            case "dead":
                this.mode = mode;
                this.forcedTarget = pacman.goodTarget;
                break;
            }
    
            // set right colours and visibility depending on mode

            // if dead
            if (this.mode === "dead") {
                this.body.hide();
                return;
            }

            // if frightened
            if (this.mode === "fright") {
                this.colour = pacman.config.colours.frightGhost;
                this.body.show();
                return;
            }

            // otherwise
            this.colour = pacman.config.colours.ghost[this.name];
            this.body.show();

        };


        /**
         * reset
         *
         * resets position, movement and mode to start conditions
         */
        this.reset = function() {
            this.position = this.originalStart;
            this.movement = {x: -1, y: 0};
            this.untilNextTile = pacman.config.tileSize / 2;
            this.setMode("chase");
            this.forcedTarget = pacman.goodTarget;

        };
    };


    // @export
    app.namespace('pacman.Enemy', Enemy);


}(window.app || {}));
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
                    'WWWWWWCCCUCCCwwwCCCwUCCCwWwwwWwUCwWwCCWW',
                    'WWWWWWCWWWWWCwUwCWCwCWWCCwwwwwCCCwwWCCWW',
                    'WWWWWWCWWWWWCwCwCWCwCWWCCCwCwCCCCwWwWCWW',
                    'SSCCCCCCCCCCCCCCCCCCCCCPNCCCCCCCCCCCCCSS',
                    'WWWWWWCWWCWWWWWCWWWWWCWWWWWCWWCWWWWWWWWW',
                    'WWWWWWCWWCWWWWWCWWWWWCWWWWWCWWCWWWWWWWWW',
                    'WWWWWWCWWCWWWWWCWWWWWCWWWWWCWWCWWWWWWWWW',
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
/*global window*/

/**
 * app.pacman.video
 * 
 * @description
 * - Handle overlays and play video
 * 
 * @author
 * @copyright Copyright 2012: Kelley Reynolds, RubyScale
 * @version 0.1
 *
 * @namespace app
 *
 * @changelog
 * - 0.1 basic functions and module structur
 *
 * @requires
 * - app
 * - jQuery
 * - jQuery PubSub
 *
 * @see
 * - http://rubyscale.com/blog/2010/11/22/embedding-arbitrary-html-into-raphaeljs/
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
    var log = app.helpers.utils.log,
        pacman = app.pacman || {},
        config = pacman.config || {},
        opts = {
            x: 0,
            y: 0,
            width: '200px',
            height: '100px'
        },
        attrs = {
            'fill': '#000'
        };

    /**
     *
     *
     * @constructor
     * @param {object} paper The raphael js paper object
     * @param {object} options The video options
     * @param {object} attributes The raphael js attributes
     */
    function Video(paper, options, attributes) {
        var self = this;

        self.paper = paper;
        self.opts = $.extend(true, {}, opts, config.video.opts, options);
        self.attrs = $.extend(true, {}, attrs, config.video.attrs, attributes);

        self.init();

    }


    /**
     *
     *
     * @interface
     */
    Video.prototype = {


        /**
         * render video
         *
         * @param {string} name The video name
         */
        playVideo: function (name) {

            // init local vars
            var self = this,
                html = [],
                $video;

            // check params and reset current video, not beauty but for the sake
            if (!name) {
                self.name = 'death';
            } else {
                self.name = name;
            }
            self.video = null;

            // generate html string
            //html.push('<video poster="assets/video/' + self.name + '.png">');
            html.push('<video>');
            html.push('<source src="assets/video/' + self.name + '.mp4" type=\'video/mp4; codecs="avc1.42E01E, mp4a.40.2"\'>');
            html.push('<source src="assets/video/' + self.name + '.ogv" type=\'video/ogg; codecs="theora, vorbis"\'>');
            html.push('<source src="assets/video/' + self.name + '.webm" type="video/webm">');
            //html.push('<source src="assets/video/' + self.name + '.3gp" type="video/3gpp; codecs="mp4v.20.8, samr">');
            html.push('</video>');

            // append video to dom
            $video = $(html.join(''));
            self.video = $video[0];
            self.$wrapper.empty().html($video);

            // listen to video events
            $video.on({

                /// hide video
                'click.video pause.video ended.video': function () {
                    log('video ended');
                    self.hide();
                },

                // fired when the browser tries to start loading
				'loadstart.video': function () {
					switch (self.video.networkState) {
					case (self.video.NETWORK_EMPTY): // 0
						log('video network - empty source');
						break;
					case (self.video.NETWORK_IDLE): // 1
						log('video network - video choosen and no download progress');
						break;
					case (self.video.NETWORK_LOADING): // 2
						log('video network - browser trying to load video');
						break;
					case (self.video.NETWORK_NO_SOURCE): // 3
						log('video network - no video source has been successfully loaded yet');
						break;
					default:
						break;
					}
				},

                'playing.video': function () {
                    log('video playing');
                },
                'timeupdate.video': function () {
                    log('video timeupdate');
                },
                // download progress
                'progress.video': function () {
					log('video loading progress');

                    self.loaded = 0;

					// try catch block due to possible indexSize error on this.audio.buffered
					try {
						if (self.video.buffered !== undefined && self.video.duration !== undefined) {
							self.loaded = parseInt(((self.video.buffered.end(0) / self.video.duration) * 100), 10);
							$.publish('video.progress', [self.loaded]);
						}
					} catch (e) {
						log('video loading progess - tryCatch catch: ' + e);
                    } finally {
						log('video loading progess - tryCatch finally');
					}
				},

                // enough audio is downloaded and ready to play, unsupported in opera 11
				'canplay.video': $.proxy(function () {
					log('video is ready to play');
                    self.video.currentTime = 0;
                    if (self.muted !== undefined) {
                        self.video.muted = self.muted;
                    }
                    if (!self.video.statusPlaying) {
                        self.video.play();
                        self.video.statusPlaying = true;
                    }
                    
				}, this),

                // error handling
                'error.video': function () {
					log('video error');
					//this.fallback();
				}

            });

        },


        /**
         * stop video 
         *
         */
        stopVideo: function () {
            var self = this,
                video = self.video;

            if (video) {
                video.pause();
                self.video.statusPlaying = false;
            }
        },


        /**
         * show overlay
         *
         */
        show: function (name) {

            var self = this;

            // show overlay and play video
            self.container.animate({opacity: 1}, 300, ">");
            self.$wrapper.fadeIn(300);
            self.playVideo(name);

            // trigger events
            $.publish('pacman.videoshow');
        },

        mute: function (value) {
            var self = this,
                video = self.video;

            if (!value) {
                value = true;
            }

            if (video) {
                video.muted = value;
            }

            self.muted = value;

        },


        /**
         * hide overlay
         *
         */
        hide: function () {

            var self = this;

            // hide overlay and stop video
            self.container.animate({opacity: 0}, 300, ">");
            self.$wrapper.fadeOut(300);
            self.stopVideo();

            // trigger events
            $.publish('pacman.videohide');
        },


        /**
         * handle overlay events
         *
         */
        bindEvents: function () {
            var self = this;

            //self.group.mouseup(function () {
            //    self.hide();
            //});

        self.group.mouseup(function () {
            alert("asd");
            //self.hide();
        });

        },


        /**
         * main function, init video
         *
         */
        init: function () {

            // init local vars
            var self = this,
                options = self.opts,
                containerId,
                parentNode;

            // set defaults
            self.x = options.x || 0;
            self.y = options.y || 0;
            self.width = options.width || self.paper.width;
            self.height = options.height || self.paper.height;

            // create container
            self.container = self.paper.rect(self.x, self.y, self.width, self.height).attr(self.attrs);

            /**
             * check for container id
             * 
             * take next parent if there is no id, useful to get
             * the jquery object from the raphael container
             */
            parentNode = self.container.node.parentNode.parentNode;
            containerId = parentNode.id || parentNode.parentNode.id;
            self.$container = $('#' + containerId);

            // create div
            self.$wrapper = $('<div class="video-wrapper"></div>').insertAfter(self.$container);

            // create group
            self.group = self.paper.set();
            self.group.push(self.container);
            self.group.push(self.$wrapper);

            // hide infobox
            self.container.attr({opacity: 0});
            self.$wrapper.hide();

            // run basic functions
            self.bindEvents();

            // don't show overlay on class init
            self.hide();

        }

    };


    // @export
    app.namespace('pacman.Video', Video);


}(window.jQuery, window.getNamespace()));

/*global window, document*/

/**
 * app.pacman.audio
 * 
 * @description
 * - Handle background audio
 * 
 * @author
 * @copyright 
 * @version 0.1
 *
 * @namespace app
 *
 * @changelog
 * - 0.1 basic functions and module structur
 *
 * @requires
 * - app
 * - jQuery
 * - jQuery PubSub
 *
 * @see
 * - 
 * 
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

    // init module vars
    var log = app.helpers.utils.log,
        pacman = app.pacman || {},
        config = pacman.config || {},
        defaults = {
        };


    log = function () {};
    /**
     *
     *
     * @constructor
     * @param {object} $element The jquery wrapper
     * @param {object} options The audio options
     */
    function Audio($element, options) {
        var self = this;

        self.$el = $element;
        self.opts = $.extend(true, {}, defaults, config.audio.opts, options);
        self.muted = options.muted;

        self.init();

    }


    /**
     *
     *
     * @interface
     */
    Audio.prototype = {

        /**
         * render source element for audio
         *
         */
        renderSource: function (src, type) {
            var source = document.createElement('source');
            switch (type) {
            case 'audio/ogg':
                source.src = src + '.ogg';
                break;
            case 'audio/mpeg':
                source.src = src + '.mp3';
                break;
            case 'audio/x-wav':
                source.src = src + '.wav';
                break;
            default:
                break;
            }
            source.type = type;
            source.media = 'all';
            return source;
        },


        /**
         * load audio track
         *
         * @param {string} name The unique audio track name
         * @param {string} src The optional src path
         */
        loadAudio: function (name, src) {

            var self = this,
                track;

            // check if audio track is already present
            if (!self.tracks[name]) {

                // init track object
                self.tracks[name] = track = {};

                // create html5 audio element
                track.audio = document.createElement('audio');
                track.$audio = $(track.audio);
                track.$audio.appendTo(self.$el);

                // check src param and set default
                if (!src) {
                    src = 'assets/audio/' + name;
                }

                // render audio sources
                track.$audio.prepend(self.renderSource(src, 'audio/x-wav'));
                track.$audio.prepend(self.renderSource(src, 'audio/mpeg'));
                track.$audio.prepend(self.renderSource(src, 'audio/ogg'));

                // handle audio events
                track.$audio.on({

                    // fired when the browser tries to start loading
                    'loadstart.audio': function () {
                        log('audio loadstart');

                        track.loaded = 0;

                        switch (track.audio.networkState) {
                        case (track.audio.NETWORK_EMPTY): // 0
                            log('audio network - empty source');
                            break;
                        case (track.audio.NETWORK_IDLE): // 1
                            log('audio network - audio choosen and no download');
                            break;
                        case (track.audio.NETWORK_LOADING): // 2
                            log('audio network - browser trying to load audio');
                            break;
                        case (track.audio.NETWORK_NO_SOURCE): // 3
                            log('audio network - no source has been successfully loaded yet');
                            break;
                        default:
                            break;
                        }
                    },

                    // fired when meta data has arrived
                    'loadedmetadata.audio': function () {
                        log('audio loadedmetadata');
                    },

                    // fired when first data is loaded
                    'loadeddata.audio': function () {
                        log('audio loadeddata');
                    },

                    // download progress
                    'progress.audio': function () {
                        log('audio progress');

                        track.loaded = 0;

                        // try catch block due to possible indexSize error on this.audio.buffered
                        try {
                            if (track.audio.buffered !== undefined && track.audio.duration !== undefined) {
                                track.loaded = parseInt(((track.audio.buffered.end(0) / track.audio.duration) * 100), 10);
                                $.publish('audio.progress', [track.loaded]);
                            }
                        } catch (e) {
                            log('audio progess - tryCatch catch: ' + e);
                        } finally {
                            log('audio progess - tryCatch finally');
                        }
                    },

                    // enough audio is downloaded and ready to play, unsupported in opera 11
                    'canplay.audio': function () {
                        log('audio can play');
                        track.audio.play();
                    },

                    // timing while playing
                    'timeupdate.audio': function () {
                        log('audio timeupdate');
                        track.audio.muted = self.muted;
                    },

                    // audio is playing
                    'play.audio': function () {
                        log('audio playing');
                        track.audio.muted = self.muted;
                    },

                    // audio is paused
                    'pause.audio': function () {
                        log('audio pause ended');
                    },

                    // audio is paused or at the end
                    'pause.audio ended.audio': function () {
                        log('audio pause ended');
                    },

                    // audio is ended
                    'ended.audio': function () {
                        log('audio ended');
                    },

                    // waiting for data to download */
                    'waiting.audio ': function () {
                        log('audio waiting for data');
                    },

                    // audio is suspended to save bandwidth, unsupported in opera */
                    'suspend.audio ': function () {
                        log('audio suspend');
                    },

                    // event is fired if the server stop giving data, unsupported in opera */
                    'stalled.audio ': function () {
                        log('audio stalled');
                    },

                    // error handling */
                    'error.audio': function () {
                        log('audio error');
                    },

                    // the user abort the download or audio
                    'abort.audio': function () {
                        log('audio abort');
                    }

                });
            }

        },


        /**
         * play audio track
         *
         * @param {string} name The audio track to play
         */
        play: function (name) {

            var self = this,
                track;

            if (self.tracks[name]) {
                track = self.tracks[name];
                track.audio.play();
            } else {
                self.loadAudio(name);
            }

        },


        /**
         * stop audio track
         *
         * @param {string} name The optional audio track to stop, otherwise all tracks will be stopped
         */
        stop: function (name) {

            var self = this;

            if (!!name && self.tracks[name]) {
                self.tracks[name].audio.stop();
            } else {
                if (self.tracks.length) {
                    $.each(function (index, track) {
                        track.audio.pause();
                    });
                }
            }

        },


        /**
         * play audio track
         *
         * @param {string} name The optional audio track to mute, otherwise all tracks will be muted
         * @param {boolean} value Whether to mute the audio or not
         */
        mute: function (name, value) {

            var self = this,
                track;

            if (!value) {
                value = true;
            }

            if (!!name && self.tracks[name]) {
                track = self.tracks[name];
                track.audio.muted = value;
            } else {
                if (self.tracks.length) {
                    $.each(function (index, track) {
                        track.audio.muted = value;
                    });
                }
            }

            self.muted = value;
        },


        /**
         * init audio functions
         *
         */
        init: function () {

            var self = this;

            if (!self.$el || !self.$el.length) {
                self.$el = $('<div class="audio-wrapper"></div>').appendTo($('body'));
            }
            self.tracks = {};

        }

    };


    // @export
    app.namespace('pacman.Audio', Audio);


}(document, window.jQuery, window.getNamespace()));

/*global window*/

/**
 * app.backbone.application
 *
 * @description
 * - hub of composite application
 * - it organizes, initializes and coordinates the various pieces the application
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
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md
 * - http://www.mikkolehtinen.com/blog/2012/08/03/structuring-complex-backbone-dot-js-apps/
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 * 
 * @bugs
 * -
 * 
 */
(function (Backbone, ns, undefined) {

    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     * 
     * Backbone and namespace are passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */

	// create new application
	var marionette = new Backbone.Marionette.Application();


	/**
	 * add marionette regions to application
	 *
	 * this regions will be available in the controller
	 */
	marionette.addRegions({
		regionHeader: '#region-header',
		regionMain: '#region-main',
		regionFooter: '#region-footer'
	});


	/**
	 * event fired just before the initializers kick off
	 *
	 */
	marionette.on('initialize:before', function() {
	});


	/**
	 * event fires just after the initializers have finished
	 *
	 */
	marionette.on('initialize:after', function() {
		/**
		 * we can only start backbone’s routing (via the history attribute) once all initializers
		 * have been run, to ensure the routing controllers are ready to respond to routing events
		 */
		if (Backbone.history) {
			Backbone.history.start({
				trigger: true
			});
		}
	});


	/**
	 * event fires after all initializers and after the initializer events
	 *
	 */
	marionette.on('start', function() {
	});


	/**
	 * configure application when started
	 *
	 * @param {object} options This optional parameter is passed from the start method
	 */
    marionette.addInitializer(function (options) {

		// setup application controller
        var controller = new marionette.Controller();

		// setup application router
        controller.router = new marionette.Router({
            controller: controller
        });
        controller.initialize();

		// add controller to namespace
		marionette.controller = controller;

		
    });


	/**
     * global namespace export
     *
     * @export
     */
    app.namespace('marionette', marionette);


}(window.Backbone, window.getNamespace()));
/*global window*/

/**
 * app.backbone.application.model
 *
 * @description
 * - a multi-purpose object to use as a controller for modules and routers
 * - a mediator for workflow and coordination of other objects, views, and more
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
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.controller.md
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 * 
 * @bugs
 * -
 * 
 */
(function (Backbone, ns, undefined) {

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
     * extend standard model
     *
     * @extends {Backbone.Model}
     */
    var Headline = Backbone.Model.extend({

		// set item defaults
		defaults: {
			id: 0,
			name: '',
			visible: true
		}

    });


	/**
     * extend standard model
     *
     * @extends {Backbone.Model}
     */
    var Config = Backbone.Model.extend({

		// set item defaults
		defaults: {
			id: 0,
			fullscreen: false,
			sound: true,
			playfield: 0
		}
    });


	/**
     * extend standard model
     *
     * @extends {Backbone.Model}
     */
    var Highscore = Backbone.Model.extend({

		// set item defaults
		defaults: {
			id: 0,
			name: '',
			points: ''
		}
    });

	/**
     * global namespace export
     *
     * @export
     */
    ns.namespace('marionette.models.Headline', Headline);
	ns.namespace('marionette.models.Config', Config);
	ns.namespace('marionette.models.Highscore', Highscore);


}(window.Backbone, window.getNamespace()));
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
/*global window*/

/**
 * app.backbone.layout
 *
 * @description
 * -  a hybrid of an ItemView and a collection of Region objects
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
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.layout.md
 * - https://github.com/marionettejs/backbone.marionette/wiki/Use-cases-for-the-different-views
 * - http://stackoverflow.com/questions/10521266/whats-the-difference-between-a-marionette-layout-and-a-region
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.region.md
 *
 * - http://ozkatz.github.io/avoiding-common-backbonejs-pitfalls.html
 * - http://www.codebeerstartups.com/2012/12/9-collection-views-in-backbone-js-learning-backbone-js/
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 * 
 * @bugs
 * -
 * 
 */
(function (Backbone, $, ns, undefined) {

    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     * 
     * Backbone and namespace are passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */

    // module vars
    var Layout = {},
        layoutCallback,
        $content = $('#content'),
        pacman = ns.pacman;


    /**
     * ----------------------------------------
     * Header Content
     * ----------------------------------------
     */


    /**
     * Standard Header
     *
     */
    Layout.Header = Backbone.Marionette.ItemView.extend({

        // set layout js template
        template: '#template-layout-header',

        // set tag to be rendered as content wrapper
        tagName: 'h1',

        // template helpers for js template
        templateHelpers: {

            showHeadline: function () {

                /**
                 * this.name is a model property
                 */
                return this.name;

            }

        },

        // initialize layout
        initialize: function (options) {

            var self = this;

            /**
             * set jquery dom helper
             *
             * this seems to don't work as instance property via $el: $(this.el) on marionette views
             * when we don't work with marionette modules and handle custom namespace functions
             */
            self.$el = $(self.el);

        },

        // callback after layout is shown, before render
        onShow: function () {
        },

        // callback after layout is rendered
        onRender: function () {
            this.$el.find('.tooltip').tooltip();
        }

    });


    /**
     * ----------------------------------------
     * Main Content
     * ----------------------------------------
     */


    /**
     * Intro Content
     *
     */
    Layout.Intro = Backbone.Marionette.Layout.extend({

        // set layout js template
        template: '#template-layout-intro',

        // set tag to be rendered as content wrapper
        tagName: 'nav',

        // template helper functions for js template
        templateHelpers: {
        },

        // handle layout events, elements will be wrapped by this.el
        events: {
            'click .button-game-pacman': 'onClickButtonGamePacman'
        },

        // handle button click event
        onClickButtonGamePacman: function (e) {
            e.preventDefault();
            $('#region-footer .button-game-pacman').trigger('click');
        },

        // initialize layout
        initialize: function (options) {

            var self = this;

            /**
             * set jquery dom helper
             *
             * this seems to don't work as instance property via $el: $(this.el) on marionette views
             * when we don't work with marionette modules and handle custom namespace functions
             */
            self.$el = $(self.el);

            self.$el.addClass('row center');

        },

        // callback after layout is shown, before render
        onShow: function () {
        },

        // callback after layout is rendered
        onRender: function () {
            this.$el.find('.tooltip').tooltip();
            $content.removeClass('loading');
        },

        // callback before layout is closed
        onBeforeClose: function () {
            $content.addClass('loading');
        }

    });


    /**
     * Pacman Content
     *
     */
    Layout.Pacman = Backbone.Marionette.Layout.extend({

        // set layout js template
        template: '#template-layout-pacman',

        // define subregions within current layout, needs to be present in js template
        regions: {
            game: "#game",
            intro: "#score"
        },

        // template helper functions for js template
        templateHelpers: {
        },

        // initialize layout
        initialize: function (options) {

            var self = this;

            /**
             * set jquery dom helper
             *
             * this seems to don't work as instance property via $el: $(this.el) on marionette views
             * when we don't work with marionette modules and handle custom namespace functions
             */
            self.$el = $(self.el);

        },

        // callback after layout is shown, before render
        onShow: function () {

            var pacman = ns.pacman,
                config = pacman.config,
                fullscreen = false,
                tileSize = $('#region-main').width() / config.playField[pacman.stats.getLevelString()].width,
                time = 0,
                callback = function () {
                    tileSize = $('#region-main').width() / config.playField[pacman.stats.getLevelString()].width;
                    config.tileSize = tileSize;
                    pacman.initialize();

                    if (fullscreen) {
                        $('#fullscreen').show();
                        $('#fullscreen button').on({
                            'click': function () {
                                pacman.pause(true);
                                $('#reveal-game-exit-fullscreen').reveal();
                            }
                        });
                    } else {
                        $('#fullscreen').hide();
                    }

                    $.subscribe('pacman.end', function () {
                        ns.marionette.controller.highscore();
                        $('#region-footer .button').removeClass('disabled');
                        $('#region-footer .button[href=#highscore]').addClass('disabled');
                    });
                };

            if (app.marionette.controller.modelConfig.get('fullscreen')) {
                time = 1500;
                app.plugins.fullscreen();
                fullscreen = true;
            }

            window.setTimeout(callback, time);

        },

        // callback after layout is rendered
        onRender: function () {
            $content.addClass('pacman').removeClass('loading');
        },

        // callback before layout is closed
        onBeforeClose: function () {
            $content.removeClass('pacman').addClass('loading');
            ns.pacman.destroy();
        }

    });


    /**
     * Highscore Content
     *
     */
    Layout.Highscore = Backbone.Marionette.Layout.extend({

        // set layout js template
        template: '#template-layout-highscore',

        // define subregions within current layout, needs to be present in js template
        regions: {
            list: "#list-highscore"
        },

        // set tag to be rendered as content wrapper
        tagName: "div",

        // template helper functions for js template
        templateHelpers: {
        },

        // handle layout events, elements will be wrapped by this.el
        events: {
            'click .button-game-pacman': 'onClickButtonGamePacman'
        },

        // handle button click
        onClickButtonGamePacman: function (e) {
            e.preventDefault();
            $('#region-footer .button-game-pacman').trigger('click');
        },

        // initialize layout
        initialize: function (options) {

            var self = this;

            /**
             * set jquery dom helper
             *
             * this seems to don't work as instance property via $el: $(this.el) on marionette views
             * when we don't work with marionette modules and handle custom namespace functions
             */
            self.$el = $(self.el);

        },

        // callback after layout is rendered
        onShow: function () {

            var self = this,
                marionette = ns.marionette,
                store = marionette.store,
                scores = pacman.stats.getStore(),
                highscoresSaved,
                highscoresRendered,
                highscoresCounter = 1,
                view;

            if (scores) {
                highscoresSaved = new marionette.collections.Highscore(scores);

                // set item counter
                highscoresRendered = highscoresSaved.map(function (model) {
                    return {
                        counter: highscoresCounter++,
                        name: model.get('name'),
                        points: model.get('points')
                    }
                });

            } else {
                highscoresRendered = [{
                    name: 'There are no results saved yet',
                    points: 0
                }];
            }

            // set view
            view = new marionette.views.Highscore({
                collection: new marionette.collections.Highscore(highscoresRendered)
            });

            // display filtered and sorted highscores
            self.list.show(view);

        },

        // callback after layout is rendered
        onRender: function () {
            this.$el.find('.tooltip').tooltip();
            $content.removeClass('loading');
        },

        // callback before layout is closed
        onBeforeClose: function () {
            $content.addClass('loading');
        }

    });


    /**
     * ----------------------------------------
     * Footer Content
     * ----------------------------------------
     */


    /**
     * Standard Footer
     *
     */
    Layout.Footer = Backbone.Marionette.Layout.extend({

        // set layout js template
        template: '#template-layout-footer',

        // set tag to be rendered as content wrapper
        tagName: "nav",

        // handle layout events, elements will be wrapped by this.el
        events: {
            'click .button-game-intro': 'onClickButtonGameIntro',
            'click .button-game-pacman': 'onClickButtonGamePacman',
            'click .button-game-highscore': 'onClickButtonGameHighscore'
        },

        // set active button
        switchActiveButton: function (route) {
            $('#region-footer .button').removeClass('disabled');
            $('#region-footer .button[href=#' + route + ']').addClass('disabled');
        },

        // switch main layout
        switchRegionMain: function (callback) {

            var self = this;

            if ($('#content').hasClass('pacman')) {
                pacman.pause(true);
                $('#reveal-game-exit').reveal();
                layoutCallback = callback;
            } else {
                callback();
            }

        },

        /**
         * button events
         *
         */

        // handle button click
        onClickButtonGameIntro: function (e) {
            e.preventDefault();

            var self = this;

            self.switchRegionMain(function () {
                ns.marionette.controller.intro();
                self.switchActiveButton('intro');
            });

        },

        // handle button click
        onClickButtonGamePacman: function (e) {
            e.preventDefault();

            // check if pacman is playing
            if (!$('#content').hasClass('pacman')) {

                var name,
                    fullscreen,
                    nameEnteredCallback = function () {

                        name = $('#form-enter-name-value').val();
                        fullscreen = $('#form-enter-name-fullscreen').attr('checked') === 'checked';

                        if (!name || name === '') {
                            name = $('#form-enter-name-value').attr('placeholder');
                        }
                        pacman.stats.setPlayerName(name);
                        ns.marionette.models.config.set({
                            fullscreen: fullscreen
                        });
                    };

                $('#reveal-game-enter-name').on({
                    'reveal:close': function () {
                        $('#reveal-game-enter-name').off('reveal:close');
                        nameEnteredCallback();
                    }
                })
                $('#form-enter-name').on({
                    'submit': function (e) {
                        e.preventDefault();
                        $('#form-enter-name').off('submit');
                        nameEnteredCallback();
                    }
                });

                $('#reveal-game-enter-name').reveal();

            } else {
                pacman.pause();
            }
                
        },

        // handle button click
        onClickButtonGameHighscore: function (e) {
            e.preventDefault();

            var self = this;

            self.switchRegionMain(function () {
                ns.marionette.controller.highscore();
                self.switchActiveButton('highscore');
            });
        },


        /**
         * reveal events
         *
         */

        // handle button click
        onClickRevealGameEnterButtonYes: function (e) {
            e.preventDefault();
            this.$reveal.trigger('reveal:close');
            ns.marionette.controller.pacman();
            this.switchActiveButton('pacman');
        },

        // handle button click
        onClickRevealGameEnterButtonNo: function (e) {
            e.preventDefault();
            this.$reveal.trigger('reveal:close');
        },

        // handle button click
        onClickRevealGameExitButtonYes: function () {

            var self = this;

            self.$reveal.trigger('reveal:close');
            if (layoutCallback) {
                layoutCallback();
            }
        },

        // handle button click
        onClickRevealGameExitButtonNo: function () {
            this.$reveal.trigger('reveal:close');
            pacman.pause(false);
        },


        /**
         * init helpers
         *
         */

        // initialize layout
        initialize: function (options) {

            var self = this;

            /**
             * set jquery dom helper
             *
             * this seems to don't work as instance property via $el: $(this.el) on marionette views
             * when we don't work with marionette modules and handle custom namespace functions
             */
            self.$el = $(self.el);

        },

        // callback after layout is rendered
        onShow: function () {

            /**
             * get window location hash
             *
             * Backbone.history.fragment doesn't provide a fragment value
             * but if we spy the object with console the value is set,
             * strange behaviour so we use location.hash here
             */
            if (window.location.hash && window.location.hash.length > 1) {
                this.switchActiveButton(window.location.hash.substr(1));
            }

        },

        // callback after layout is rendered
        onRender: function () {

            var self = this,
                $el = self.$el;

            self.$el.addClass('row center');

            // dom vars
            self.$reveal = $('.reveal-modal');
            self.$revealGameEnterName = $('#reveal-game-enter-name');
            self.$revealGameExit = $('#reveal-game-exit');

            // bind reveal enter name events
            if (!self.$revealGameEnterName.data('events')) {

                self.$revealGameEnterName.data('events', true);

                self.$revealGameEnterName.find('.button-reveal-game-enter-name-yes').on({
                    'click': $.proxy(self.onClickRevealGameEnterButtonYes, self)
                });
                self.$revealGameEnterName.find('.button-reveal-game-enter-name-no').on({
                    'click': $.proxy(self.onClickRevealGameEnterButtonNo, self)
                });
            }

            // bind reveal exit game events
            if (!self.$revealGameExit.data('events')) {

                self.$revealGameExit.data('events', true);

                self.$revealGameExit.find('.button-reveal-game-exit-yes').on({
                    'click': $.proxy(self.onClickRevealGameExitButtonYes, self)
                });
                self.$revealGameExit.find('.button-reveal-game-exit-no').on({
                    'click': $.proxy(self.onClickRevealGameExitButtonNo, self)
                });
            }

            self.$el.find('.tooltip').tooltip();

        },

        // callback before layout is closed
        onBeforeClose: function () {

            var self = this,
                $el = self.$el;

            $el.find('.button-game-intro').off('click');
            $el.find('.button-game-pacman').off('click');
            $el.find('.button-game-highscore').off('click');

        }

    });


    /**
     * global namespace export
     *
     * @export
     */
    ns.namespace('marionette.Layout', Layout);


}(window.Backbone, window.jQuery, window.getNamespace()));
/*jslint nomen: true, plusplus: true, regexp: true */
/*global window, _, ChartFilter, app, Cases, ChartManager, Log */

/**
 * app.controller.cookie
 * 
 * @description
 * - set and get cookie values via json
 * - handling cookie layer
 * 
 * @author
 * @version 0.1
 *
 * @namespace app
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 *
 * @see
 * - 
 * 
 * @bugs
 * - 
 *
 **/
(function (window, document, ns, undefined) {
    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     * 
     * document, jquery and app are passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */


    // init local vars
    var utils = ns.helpers.utils,
        log = utils.log,
        storageType = 'marionette store',
        boolIsSupported;

    /**
     * handle web storage events
     *
     * the event only fires on other windows – it won’t fire on the window that did the storing.
     * the event won’t fire if the data doesn’t change, i.e. if you store .name = 'test' and set it to 'test'
     * again it won’t fire the storage event (obviously, since nothing was stored).
     * 
     * @see
     * - http://html5doctor.com/storing-data-the-simple-html5-way-and-a-few-tricks-you-might-not-have-known/
     *
     * @param {object} e The storage event object
     */
    function handleStorageEvents(e) {

        // handle Internet Explorer storage event
        if (!e && window.event) {
            e = window.event;
        }

        // init local vars
        var msg = '[' + storageType + ' Adapter] Event - key: ' + (e.key || 'no e.key event') + ', url: ' + (e.url || 'no e.url event');

        // log event
        log(msg);
    }


    /**
     * get storage type
     * 
     * @param {string} type Local or session
     *
     * @return {string} The storage type string
     */
    function getStorageType(type) {

        // init default
        var result = 'localStorage';

        // get type string
        switch (type) {
        case 'local':
            result = 'localStorage';
            break;
        case 'session':
            result = 'sessionStorage';
            break;
        default:
            break;
        }

        // return result
        return result;
    }

    /**
     * controller contructor
     *
     * @constructor
     * @param {object} parameters The instance parameters
     */
    function Controller(parameters) {

        // init local vars
        var self = this;

        // adapter vars
        self.adapter = null;

        // default lifetime (session or local)
        self.lifetime = 'local';

        // run init function
        self.init(parameters);

    }


    /**
     * controller cookie methods
     *
     * @interface
     */
    Controller.prototype = Controller.fn = {

        /**
         * test if the browser supports this type of caching
         * 
         * @returns {boolean} Whether this type of storage is supported or not
         */
        isSupported: function () {

            var self = this,
                type = getStorageType(self.lifetime);

            // check for global var
            if (null === boolIsSupported) {
                try {
                    boolIsSupported = !!window[type] && !!window[type].getItem;
                } catch (e) {
                    log('[' + storageType + ' Adapter] ' + storageType + ' is not supported');
                    boolIsSupported = false;
                }
            }

            // return bool
            return boolIsSupported;

        },


        /**
         * create a new resource in storage
         * 
         * @param {object} key The resource object
         * @param {string} content The content string
         * @param {function} callback Function called on success
         */
        create: function (key, content, callback) {

            // check callback
            callback = utils.callback(callback);

            content = utils.jsonToString(content);

            try {
                // save data and call callback
                this.adapter.setItem(key, content);
                callback(true);
                return true;

            } catch (e) {console.log(e);
                // handle errors
                handleStorageEvents(e);
                callback(false, e);
                return e;

            }

        },


        /**
         * read storage item
         *
         * @param {object} key The resource object
         * @param {function} callback Function called on success
         */
        read: function (key, callback) {

            var self = this,
                data;

            // check callback
            callback = utils.callback(callback);

            try {
                // try to load data
                data = self.adapter.getItem(key);

                // return data
                if (data) {
                    data = utils.jsonToObject(data);
                    callback(data);
                    return data;
                }

                callback(false);
                return false;

            } catch (e) {

                // handle errors
                handleStorageEvents(e);
                callback(false, e);
                return e;

            }


        },


        /**
         * update a resource in storage
         * 
         * @param {object} key The resource object
         * @param {string} content The content string
         * @param {function} callback Function called on success
         */
        update: function (key, content, callback) {

            // same logic as this.create
            return this.create(key, content, callback);

        },


        /**
         * delete a resource from storage
         * 
         * @param {object} key The resource object
         * @param {function} callback Function called on success
         */
        remove: function (key, callback) {

            // check callback
            callback = utils.callback(callback);

            try {
                // delete data and call callback
                this.adapter.removeItem(key);
                callback(key);
                return key;

            } catch (e) {
                // handle errors
                handleStorageEvents(e);
                callback(false, e);
                return e;

            }

        },


        /**
         * open and initialize storage if not already done
         * 
         * @param {function} callback The function called on success
         */
        open: function (callback) {

            // init local function vars
            var self = this,
                adapter = self.adapter,
                type = getStorageType(self.lifetime);

            // check callback
            callback = utils.callback(callback);

            // check for database
            if (null === adapter) {
                try {

                    // init global object
                    adapter = self.adapter = window[type];
                    utils.on(window, 'storage', handleStorageEvents);

                    // create test item
                    log('[' + storageType + ' Adapter] Try to create test resource');
                    self.create('test-item', {"test": "test-content"}, function (success) {
                        if (!!success) {
                            self.remove('test-item', function () {
                                log('[' + storageType + ' Adapter] Test resource created and successfully deleted');
                                callback(adapter);
                            });
                        } else {
                            callback(false);
                        }

                    });

                } catch (e) {
                    callback(false);
                }
            } else if (self.isSupported()) {

                // adapter already initialized
                callback(adapter);

            }

        },


        /**
         * init storage
         *
         * @param {object} parameters The instance parameters
         * @param {string} [parameters.lifetime=localStorage] Set storage type to localStorage or sessionStorage
         *
         * @return {this} The instance if supported or false
         */
        init: function (parameters) {

            // init local vars
            var self = this;

            // check for support
            if (self.isSupported()) {

                // set parameters
                if (parameters) {
                    if (parameters.lifetime) {
                        self.lifetime = parameters.lifetime;
                    }
                }

                // return instance
                return self;
            }

            // return false if there is no support
            return false;
        }

    };


    /**
     * handle instance without the need of calling "new"
     *
     * @param {object} config The optional init options
     * @param {function} callback The optional callback function
     */
    Controller.init = function (config, callback) {
        var controllerInstance = new Controller();
        controllerInstance.init(config, callback);
        return controllerInstance;
    };


    /**
     * make controller globally available under app namespace
     *
     * @export
     */
    ns.namespace('marionette.Store', Controller);


}(window, window.document, window.getNamespace()));
/*global window*/

/**
 * app.backbone.application.router
 *
 * @description
 * - handle marionette route management
 * - execute controller actions corresponding to the url
 * - route-handling code should get fired only when a user enters the application by a url, not each time the url changes
 * - update the url in the address bar as the user navigates within the app
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
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.approuter.md
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 * 
 * @bugs
 * -
 * 
 */
(function (Backbone, ns, undefined) {

    'use strict';

    /**
     * undefined is used here as the undefined global
     * variable in ECMAScript 3 and is mutable (i.e. it can
     * be changed by someone else). undefined isn't really
     * being passed in so we can ensure that its value is
     * truly undefined. In ES5, undefined can no longer be
     * modified.
     * 
     * Backbone and namespace are passed through as local
     * variables rather than as globals, because this (slightly)
     * quickens the resolution process and can be more
     * efficiently minified (especially when both are
     * regularly referenced in this module).
     */


    /**
     * router
     *
     * @extend
     */
    var Router = Backbone.Marionette.AppRouter.extend({

        /**
         * appRoutes will will trigger application controller
         * so function calls must exist at controller
         */
        appRoutes: {
            'intro': 'intro',
            'pacman': 'pacman',
            'highscore': 'highscore',
            '': 'intro'
        },

        /**
         * initialize router
         *
         */
        initialize: function () {

        }

    });


    /**
     * global namespace export
     *
     * @export
     */
    ns.namespace('marionette.Router', Router);


}(window.Backbone, window.getNamespace()));
/*global window*/

/**
 * app.backbone.application.controller
 *
 * @description
 * - a multi-purpose object to use as a controller for modules and routers
 * - a mediator for workflow and coordination of other objects, views, and more
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
 * - https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.controller.md
 * - http://lostechies.com/derickbailey/2012/03/22/managing-layouts-and-nested-views-with-backbone-marionette/
 *
 * @changelog
 * - 0.1 basic functions and plugin structur
 * 
 * @bugs
 * -
 * 
 */
(function (Backbone, ns, undefined) {

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
     * controller
     *
     * @extend
     */
	var Controller = Backbone.Marionette.Controller.extend({

		/**
         * show intro
         *
         */
		intro: function () {

            // init models and layouts
            var marionette = app.marionette,

                regionLayoutHeader = new marionette.Layout.Header({
                    model: marionette.models.headline
                }),

                regionLayoutMain = new marionette.Layout.Intro({
            
                });

			// set headline
            this.modelHeadline.set({
                name: 'Pacman'
            });

            // show regions
            marionette.regionHeader.show(regionLayoutHeader);
            marionette.regionMain.show(regionLayoutMain);

            // update url
            Backbone.history.navigate("intro");

		},

		/**
         * show pacman
         *
         */
		pacman: function () {

            var marionette = app.marionette,

                layoutMain = new marionette.Layout.Pacman({
            
                });

			// show regions
            marionette.regionHeader.close();
            marionette.regionMain.show(layoutMain);

            // update url
            Backbone.history.navigate("pacman");

		},

		/**
         * show highscore
         *
         */
		highscore: function () {

            // init models and layouts
            var marionette = app.marionette,

                regionLayoutHeader = new marionette.Layout.Header({
                    model: marionette.models.headline
                }),

                regionLayoutMain = new marionette.Layout.Highscore({
            
                });

			// set headline
            this.modelHeadline.set({
                name: 'Highscore'
            });

            // show regions
            marionette.regionHeader.show(regionLayoutHeader);
            marionette.regionMain.show(regionLayoutMain);

            // update url
            Backbone.history.navigate("highscore");
		},


		/**
         * initialize router
         *
         * @param {object} options
         */
		initialize: function (options) {

            var self = this,

				marionette = app.marionette,

				models = app.marionette.models,

				pacman = app.pacman,

				regionLayoutFooter = new marionette.Layout.Footer({
                }),

                modelHeadline = new models.Headline({
                }),

                modelConfig = new models.Config({
                }),

                modelConfigFullscreen,

                modelConfigSound;

			// setup application config and listen to changes
            modelConfig.on('change', function () {

                //if (modelConfig.hasChanged('fullscreen')) {
                //    app.plugins.fullscreen();
                //}

                if (modelConfig.hasChanged('sound')) {
                    modelConfigSound = modelConfig.get('sound');
                    if (pacman.audio) {
                        pacman.audio.mute(!modelConfigSound);
                    }
                    if (pacman.video) {
                        pacman.video.mute(!modelConfigSound);
                    }
                }

            });


            self.modelHeadline = models.headline = modelHeadline;
            self.modelConfig = models.config = modelConfig;
			
			marionette.regionFooter.show(regionLayoutFooter);
			$('input[type=checkbox]').styledCheckbox();
			
		}

	});


	/**
     * global namespace export
     *
     * @export
     */
    ns.namespace('marionette.Controller', Controller);


}(window.Backbone, window.getNamespace()));
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
(function (window, document, $, app, undefined) {
    'use strict';

    // local vars
    var $window = $(window),
		$html = $('html'),
        helpers = app.helpers,
        client = helpers.client,
        on = helpers.utils.on,
		hideStatusbar = client.hideStatusbar,
		isSupported;

    // document is ready
    $(document).ready(function () {

		// client depending init
        $html.removeClass('no-js').addClass('js');
		if (client.isMobile()) {
			$html.addClass('mobile');
			hideStatusbar();
			on(document, 'DOMContentLoaded', hideStatusbar);
			on(window, 'orientationchange', hideStatusbar);
		} else {
			$html.addClass('desktop');
		}

		// mobile fast clicks
		if (!!document.body) {
			new FastClick(document.body);
		}

		// check browser support
		isSupported = client.isChrome() || client.isSafari();
		if (!isSupported) {
			$('#layer-no-supported').show();
			return;
		}

		// start backbone
		app.marionette.start();

	});


}(window, document, window.jQuery, window.app || {}));