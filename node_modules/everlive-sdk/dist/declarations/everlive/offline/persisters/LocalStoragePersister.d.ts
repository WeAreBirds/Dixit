import { LocalStore } from '../../storages/LocalStore';
import { BasePersister } from './BasePersister';
export declare class LocalStoragePersister extends BasePersister {
    _localStore: LocalStore;
    /**
     * @class LocalStoragePersister
     * @extends BasePersister
     */
    constructor(key: string, options: any);
    getData(contentType: any, success: any, error: any): void;
    saveData(contentType: any, data: any, success: any, error: any): void;
    purge(contentType: any, success: any, error: any): void;
    purgeAll(success: any, error: any): void;
    _getItem(key: any): string;
    _setItem(key: any, value: any): void;
    _removeItem(key: any): void;
    _getKey(contentType: any): string;
    _getContentTypes(success: any, error: any): void;
    _setContentTypesCollection(collection: any): void;
    _addTypeToCollectionsCache(typeName: any): void;
}
