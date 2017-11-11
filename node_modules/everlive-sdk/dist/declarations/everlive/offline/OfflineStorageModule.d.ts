import { OfflineQueryProcessor } from './processors/OfflineQueryProcessor';
import { OfflineFilesProcessor } from './OfflineFilesProcessor';
import { Everlive } from '../Everlive';
import { Persister } from './persisters/Persister';
import { CryptographicProvider } from '../encryption/CryptographicProvider';
/**
 * @class OfflineModule
 * @classDesc A class providing access to the various offline storage features.
 */
/**
 * Represents the {@link OfflineModule} class.
 * @memberOf Everlive.prototype
 * @member {OfflineModule} offlineStorage
 */
export declare class OfflineStorageModule {
    private _everlive;
    options: any;
    private _encryptionProvider;
    private _isSynchronizing;
    private _syncResultInfo;
    offlineFilesProcessor: OfflineFilesProcessor;
    queryProcessor: OfflineQueryProcessor;
    /**
     * @memberOf OfflineModule.prototype
     * @instance
     * @description An instance of the [OfflineFilesModule]{@link OfflineFilesModule} class for working with files in offline mode.
     * @member {OfflineFilesModule} files
     */
    files: any;
    constructor(_everlive: Everlive, options: any, persister: Persister, _encryptionProvider: CryptographicProvider);
    /**
     * Removes all data from the offline storage. If caching is enabled clears the entire cache as well.
     * @method purgeAll
     * @name purgeAll
     * @memberOf OfflineModule.prototype
     * @param {function} [success] A success callback.
     * @param {function} [error] An error callback.
     */
    /**
     * Removes all data from the offline storage. If caching is enabled clears the entire cache as well.
     * @method purgeAll
     * @name purgeAll
     * @memberOf OfflineModule.prototype
     * @returns {Promise}
     */
    purgeAll(success: any, error: any): Promise<{}>;
    /**
     * Removes all data for a specific content type from the offline storage. If caching is enabled clears the cache
     * for the specified content type as well.
     * @method purge
     * @name purge
     * @memberOf OfflineModule.prototype
     * @param {string} contentType The content type to purge.
     * @param {function} [success] A success callback.
     * @param {function} [error] An error callback.
     */
    /**
     * Removes all data for a specific content type from the offline storage. If caching is enabled clears the cache
     * for the specified content type as well.
     * @method purge
     * @name purge
     * @memberOf OfflineModule.prototype
     * @param {string} contentType The content type to purge.
     * @returns {Promise}
     */
    purge(contentType: any, success: any, error: any): Promise<{}>;
    processQuery(query: any): Promise<any>;
    _setOffline(offline: any): void;
    isOnline(): boolean;
    _prepareSyncData(contentTypesForSync: any): {
        conflicts: any[];
        contentTypesSyncData: {};
    };
    _resolveConflicts(syncData: any): Promise<any>;
    isSynchronizing(): boolean;
    _fireSyncStart(): Promise<{}>;
    _fireSyncEnd(): void;
    _eachSyncItem(items: any, getFilterFunction: Function, contentTypeName: string, operation: Function): void;
    _shouldAutogenerateIdForContentType(collectionName: any): boolean;
    _addCreatedFileToSyncPromises(resultingItemsForCreate: any, syncPromises: any, collectionName: string): void;
    _transferFile(isUpdate: boolean, item: any, location: string): Promise<{}>;
    _addCreatedObjectToSyncPromises(syncPromises: any, dataCollection: any, resultingItemsForCreate: any, contentTypeData: any, collectionName: string, ids: any): any;
    _addCreatedItemsForSync(contentTypeData: any, syncPromises: any, dataCollection: any): any;
    _addUpdatedItemsForSync(contentTypeData: any, getFilterOperation: any, syncPromises: any, dataCollection: any, itemUpdateOperation: any): void;
    _addDeletedItemsForSync(contentTypeData: any, getFilterOperation: any, syncPromises: any, dataCollection: any, itemDeleteOperation: any): void;
    _onSyncResponse(res: any, item: any, collectionName: string, operation: any, isCustomItem: boolean): any;
    _purgeById(contentType: any, itemId: any): Promise<any>;
    sync(): void;
    _handleKeepServer(typeName: any, conflictingItem: any, offlineSyncOperations: any, contentTypeSyncData: any): void;
    _handleKeepClient(conflictingItem: any, contentTypeSyncData: any): void;
    _handleCustom(conflictingItem: any, typeName: any, offlineSyncOperations: any, contentTypeSyncData: any): void;
    _mergeResolvedConflicts(conflicts: any, syncData: any): Promise<any[]>;
    _getSyncItemStates(contentType: any, offlineItems: any, serverItems: any): {
        itemsForSync: {
            createdItems: any[];
            modifiedItems: any[];
            modifiedItemsOnServer: any[];
            deletedItems: any[];
            deletedItemsOnServer: any[];
        };
        conflicts: {
            contentTypeName: any;
            conflictingItems: any[];
        };
    };
    _setResolutionTypeForItem(resolutionType: any, conflictingItem: any): void;
    _applyResolutionStrategy(conflicts: any): Promise<{}>;
    _getSyncPromiseBatch(contentType: any, batchIds: any): Promise<{}>;
    _getPlainItemsForSync(collection: any, forceDirty?: any): any;
    _getIdsForSync(contentType: any, offlineItemsToSync: any): any[];
    _getSyncPromiseForCollection(collection: any, contentType: any): Promise<{
        serverItems: any[];
        offlineItemsToSync: any;
    }>;
    _onItemFailed(syncResult: any, itemId: any): void;
    _onItemProcessed(item: any, contentType: any, syncStorage: any, syncType: any): void;
    _fireItemProcessed(syncInfo: any): void;
    _getClientWinsSyncData(collections: any, forceDirty: any): {};
    _getModifiedFilesForSyncClientWins(itemId: any, item: any, collectionName: any): Promise<{}>;
    _getModifiedItemForSyncClientWins(dataCollection: any, item: any, collectionName: any): Promise<{}>;
    _addModifiedItemsForSyncClientWins(contentTypeData: any, syncPromises: any, dataCollection: any): void;
    _addDeletedItemsForSyncClientWins(contentTypeData: any, syncPromises: any, dataCollection: any): void;
    _applyClientWins(collections: any): Promise<any>;
    _unmodifiedClientWinsItemsDeletedOnServer(collectionName: any, serverItemIds: any, clientItems: any): Promise<void>;
    _unmodifiedClientWinsItemsUpdatedOnServer(collectionName: any, serverItems: any, clientItems: any): Promise<any[]>;
    _modifyFileStandardSync(syncPromises: any, itemId: any, item: any, collectionName: any, resolutionType: any): void;
    _modifyContentTypeStandardSync(syncPromises: any, itemId: any, dataCollection: any, item: any, itemFilter: any, collectionName: any, isCustom: any): void;
    _applyStandardSync(collections: any): Promise<any>;
    _applySync(): Promise<any>;
    /**
     * Get all the offline items that have not been synced online.
     * @method getItemsForSync
     * @name getItemsForSync
     * @memberOf OfflineModule.prototype
     * @param {function} [success] A success callback.
     * @param {function} [error] An error callback.
     */
    /**
     * Get all the offline items that have not been synced online.
     * @method getItemsForSync
     * @name getItemsForSync
     * @memberOf OfflineModule.prototype
     * @returns {Promise}
     */
    getItemsForSync(success: any, error: any): Promise<{}>;
}
