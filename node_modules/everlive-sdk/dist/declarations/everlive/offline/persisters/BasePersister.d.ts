import { Persister } from './Persister';
/**
 * @class BasePersister
 * @classdesc An abstraction layer for all persisters. Every persister can write/read
 * data to/from a specific place. The data is saved as key-value pairs where the keys are
 * content types.
 */
export declare class BasePersister implements Persister {
    key: string;
    options: any;
    contentTypesStoreKey: string;
    constructor(key: string, options: any);
    /**
     * Gets all the saved data.
     * @method getAllData
     * @memberof BasePersister
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @returns {Object} The keys are the content types and the values are the corresponding data items.
     */
    getAllData(success: any, error: any): void;
    /**
     * Returns the saved data for a specific content type.
     * @method getData
     * @param {string} contentType The content type for which to retrieve the data.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @memberof BasePersister
     * @returns {string} The retrieved data.
     */
    getData(contentType: any, success: any, error: any): void;
    /**
     * Saves data for a specific content type.
     * @method saveData
     * @param {string} contentType The content for which to save the data.
     * @param {string} data The data corresponding to the specified content type.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @memberof BasePersister
     */
    saveData(contentType: any, data: any, success: any, error: any): void;
    /**
     * Clears the persisted data for a specific content type.
     * @method purge
     * @param {string} contentType The content type for which to clear the data.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @memberof BasePersister
     */
    purge(contentType: any, success: any, error: any): void;
    /**
     * Clears all persisted data in the offline store.
     * @method purgeAll
     * @memberof BasePersister
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     */
    purgeAll(success: any, error: any): void;
    /**
     * Clears the persisted data for a specific item.
     * @method purgeById
     * @memberof BasePersister
     * @param {string} contentType The content type for which to clear the data item.
     * @param {string} itemId The item id that will be cleared.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     */
    purgeById(contentType: any, itemId: any, success: any, error: any): void;
    /**
     * Get the number of items for the specifeid content type.
     * @method count
     * @memberof BasePersister
     * @param {string} contentType The content type for which to clear the data item.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @param {Object=} filter Count the items by filter.
     */
    count(contentType: any, success: any, error: any, filter?: any): void;
    /**
     * Get the data for the specified content type by using filter/sort/skip/take/fields
     * @method queryData
     * @memberof BasePersister
     * @param {string} contentType The content type for which to clear the data item.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @param {Object=} filter Get items by filter.
     * @param {Object=} sort Sort the result items.
     * @param {number=} skip Skip a number of items.
     * @param {number=} limit Take only a number of items.
     * @param {Object=} select Select a subset of fields from the result items.
     */
    queryData(contentType: any, success: any, error: any, filter?: any, sort?: any, skip?: any, limit?: any, select?: any): void;
    /**
     * Delete items for the specified content type
     * @method removeData
     * @memberof BasePersister
     * @param {string} contentType The content type for which to clear the data item.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @param {Object=} filter Delete the items matching the specified filter.
     */
    removeData(contentType: any, success: any, error: any, filter?: any): void;
    /**
     * Update items for the specified content type
     * @method updateData
     * @memberof BasePersister
     * @param {string} contentType The content type for which to clear the data item.
     * @param {Object} updateObj The update expression.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @param {Object=} filter Update the items matching the specified filter.
     */
    updateData(contentType: any, updateObj: any, success: any, error: any, filter?: any): void;
    _getKey(contentType: any): string;
    /**
     * Returns a list of the mapped content types.
     * @method _getContentTypes
     * @memberof BasePersister
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     */
    _getContentTypes(success: any, error: any): void;
}
