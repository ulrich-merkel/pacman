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