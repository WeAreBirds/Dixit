import { BasePersister } from '../offline/offlinePersisters';
import { Everlive } from '../Everlive';
import { ErrorCallback } from "../interfaces/ErrorCallback";
import { SuccessCallback } from "../interfaces/SuccessCallback";
/**
 * @class CacheModule
 * @classDesc A class providing access to the various caching features.
 */
/**
 * Represents the {@link CacheModule} class.
 * @memberOf Everlive.prototype
 * @member {CacheModule} cache
 */
export declare class CacheModule {
    options: any;
    private _everlive;
    typeSettings: any;
    maxAgeInMs: number;
    persister: BasePersister;
    cacheData: any;
    constructor(options: any, _everlive: Everlive);
    _hash(obj: any): any;
    _initStore(sdkOptions: any): void;
    _getCacheData(): Promise<any>;
    _persisterGetAllDataWrap(): Promise<{}>;
    _persisterSaveDataWrap(contentType: any, data: any): Promise<{}>;
    _getCacheDataForContentType(contentType: any): Promise<any>;
    _cacheDataQuery(query: any): Promise<{}>;
    _persistCacheData(contentType: any, cacheData: any): Promise<{}>;
    isQueryUnsupportedOffline(dataQuery: any): boolean;
    _shouldSkipCache(dataQuery: any): any;
    _processCacheItem(dataQuery: any, data: any): Promise<{}>;
    _addObjectToCache(obj: any, contentType: any): Promise<{}>;
    _cacheQuery(dataQuery: any, hash: any, data: any): Promise<{}>;
    _cacheResultFromDataQuery(contentType: any, hash: any): Promise<{}>;
    _getExpirationForHash(contentType: any, hash: any): Promise<any>;
    _isHashExpired(contentType: any, hash: any, maxAge: any): Promise<boolean>;
    _purgeForHash(contentType: any, hash: any): Promise<{}>;
    _getHashForQuery(dataQuery: any): any;
    /**
     * Clears the cached data for a specified content type.
     * @method clear
     * @name clear
     * @param {string} contentType The content type to clear.
     * @memberOf CacheModule.prototype
     * @returns {Promise}
     */
    /**
     * Clears the cached data for a specified content type.
     * @method clear
     * @name clear
     * @param {string} contentType The content type to clear.
     * @memberOf CacheModule.prototype
     * @param {function} [success] A success callback.
     * @param {function} [error] An error callback.
     */
    clear(contentType: string, success?: SuccessCallback<any>, error?: ErrorCallback): Promise<any>;
    /**
     * Clears all data from the cache.
     * @method clearAll
     * @name clearAll
     * @memberOf CacheModule.prototype
     * @returns {Promise}
     */
    /**
     * Clears all data from the cache.
     * @method clearAll
     * @name clearAll
     * @memberOf CacheModule.prototype
     * @param {function} [success] A success callback.
     * @param {function} [error] An error callback.
     */
    clearAll(success?: SuccessCallback<any>, error?: ErrorCallback): Promise<any>;
}
