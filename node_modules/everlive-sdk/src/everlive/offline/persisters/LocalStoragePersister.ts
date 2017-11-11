'use strict';

import * as _ from 'underscore';

import {LocalStore} from '../../storages/LocalStore';
import {BasePersister} from './BasePersister';

export class LocalStoragePersister extends BasePersister {
    _localStore: LocalStore;

    /**
     * @class LocalStoragePersister
     * @extends BasePersister
     */
    constructor(key: string, options: any) {
        super(key, options);
        this._localStore = new LocalStore(options);
    }

    getData(contentType, success, error) {
        try {
            var key = this._getKey(contentType);
            var storedItem = this._getItem(key);
            success(storedItem);
        } catch (e) {
            error(e);
        }
    }

    saveData(contentType, data, success, error) {
        try {
            var contentTypeKey = this._getKey(contentType);
            this._setItem(contentTypeKey, data);
            success();
        } catch (e) {
            error(e);
        }
    }

    purge(contentType, success, error) {
        try {
            var key = this._getKey(contentType);
            this._removeItem(key);
            this._getContentTypes((contentTypes) => {
                contentTypes = _.without(contentTypes, contentType);
                this._setContentTypesCollection(contentTypes);
                success();
            }, error);
        } catch (e) {
            error(e);
        }
    }

    purgeAll(success, error) {
        try {
            this._getContentTypes((contentTypes) => {
                _.each(contentTypes, (contentType) => {
                    var contentTypeKey = this._getKey(contentType);
                    this._removeItem(contentTypeKey);
                });

                this._removeItem(this.contentTypesStoreKey);
                success();
            }, error);
        } catch (e) {
            error(e);
        }
    }

    _getItem(key) {
        return this._localStore.getItem(key);
    }

    _setItem(key, value) {
        return this._localStore.setItem(key, value);
    }

    _removeItem(key) {
        return this._localStore.removeItem(key);
    }

    _getKey(contentType) {
        this._addTypeToCollectionsCache(contentType);
        return super._getKey(contentType);
    }

    _getContentTypes(success, error) {
        try {
            var localStorageString = this._getItem(this.contentTypesStoreKey);

            var data = [];
            if (localStorageString) {
                data = JSON.parse(localStorageString);
            }

            success(data);
        } catch (e) {
            error(e);
        }
    }

    _setContentTypesCollection(collection) {
        this._setItem(this.contentTypesStoreKey, JSON.stringify(collection));
    }

    _addTypeToCollectionsCache(typeName) {
        let err;
        this._getContentTypes((contentTypes) => {
            if (!_.contains(contentTypes, typeName)) {
                contentTypes.push(typeName);
                this._setContentTypesCollection(contentTypes);
            }
        }, e => err = e);

        if (err) { //lets not swallow errors, shall we?
            throw err
        }
    }
}