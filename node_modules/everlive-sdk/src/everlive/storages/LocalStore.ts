declare const window;

import * as platform from '../../common/platform';

interface KeyValueStorage {
    setItem(key: string, value: string|number): void;
    getItem(key: string): string;
    removeItem(key): void;
}

function initLocalStorage (options): KeyValueStorage {
    if (platform.isNativeScript) {
        var localSettings;

        //workound for older nativescript versions
        try {
            localSettings = require('application-settings');
        } catch (e) {
            try {
                localSettings = require('local-settings');
            } catch (ex) { throw ex; } // because of webpack external dependency declaration - this marks it as optional
        }

        return {
            getItem: function (key) {
                return localSettings.getString(key);
            },

            removeItem: function (key) {
                return localSettings.remove(key);
            },

            setItem: function (key, value) {
                return localSettings.setString(key, value);
            }
        };
    } else {
        var localStorage;
        if (platform.isNodejs) {
            let LocalStorage = null;
            try {
                LocalStorage = require('node-localstorage').LocalStorage;
            } catch (e) { throw e; } // because of webpack external dependency declaration - this marks it as optional

            localStorage = new LocalStorage(options.storage.storagePath);
        } else {
            localStorage = window.localStorage;
        }

        return {
            getItem: function (key) {
                return localStorage.getItem(key);
            },

            removeItem: function (key) {
                return localStorage.removeItem(key);
            },

            setItem: function (key, value) {
                return localStorage.setItem(key, value);
            }
        };
    }
}

export class LocalStore {
    options;
    private _localStorage: KeyValueStorage;

    constructor(options) {
        this.options = options;
        this._localStorage = initLocalStorage(this.options);
    }

    getItem(key) {
        return this._localStorage.getItem(key);
    }

    removeItem(key) {
        return this._localStorage.removeItem(key);
    }

    setItem(key, value) {
        return this._localStorage.setItem(key, value);
    }
}
