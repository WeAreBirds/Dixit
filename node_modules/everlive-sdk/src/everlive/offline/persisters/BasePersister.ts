'use strict';

import * as _ from 'underscore';

import { EverliveError } from '../../EverliveError';
import { Persister } from './Persister';

import { Utils } from '../../utils';

/**
 * @class BasePersister
 * @classdesc An abstraction layer for all persisters. Every persister can write/read
 * data to/from a specific place. The data is saved as key-value pairs where the keys are
 * content types.
 */
export class BasePersister implements Persister {
    contentTypesStoreKey: string;

    constructor(
        public key: string,
        public options: any
    ) {
        this.contentTypesStoreKey = this.key + '@ContentTypes';
    }

    /**
     * Gets all the saved data.
     * @method getAllData
     * @memberof BasePersister
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @returns {Object} The keys are the content types and the values are the corresponding data items.
     */
    getAllData(success, error) {
        var self = this;
        var promises: any = {};
        this._getContentTypes(function (contentTypes) {
            _.each(contentTypes, function (contentType: any) {
                promises[contentType] = new Promise(function (resolve, reject) {
                    self.getData(contentType, resolve, reject);
                });
            });

            Utils.promiseHash(promises)
                .then(success)
                .catch(error);
        }, error);
    }

    /**
     * Returns the saved data for a specific content type.
     * @method getData
     * @param {string} contentType The content type for which to retrieve the data.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @memberof BasePersister
     * @returns {string} The retrieved data.
     */
    getData(contentType, success, error) {
        throw new EverliveError({message: 'The method getData is not implemented'});
    }

    /**
     * Saves data for a specific content type.
     * @method saveData
     * @param {string} contentType The content for which to save the data.
     * @param {string} data The data corresponding to the specified content type.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @memberof BasePersister
     */
    saveData(contentType, data, success, error) {
        throw new EverliveError({message: 'The method saveData is not implemented'});
    }

    /**
     * Clears the persisted data for a specific content type.
     * @method purge
     * @param {string} contentType The content type for which to clear the data.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @memberof BasePersister
     */
    purge(contentType, success, error) {
        throw new EverliveError({message: 'The method purge is not implemented'});
    }

    /**
     * Clears all persisted data in the offline store.
     * @method purgeAll
     * @memberof BasePersister
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     */
    purgeAll(success, error) {
        throw new EverliveError({message: 'The method purgeAll is not implemented'});
    }

    /**
     * Clears the persisted data for a specific item.
     * @method purgeById
     * @memberof BasePersister
     * @param {string} contentType The content type for which to clear the data item.
     * @param {string} itemId The item id that will be cleared.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     */
    purgeById(contentType, itemId, success, error){
        throw new EverliveError({message: 'The method purgeById is not implemented'});
    }

    /**
     * Get the number of items for the specifeid content type.
     * @method count
     * @memberof BasePersister
     * @param {string} contentType The content type for which to clear the data item.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @param {Object=} filter Count the items by filter.
     */
    count(contentType, success, error, filter?) {
        throw new EverliveError({message: 'The method count is not implemented'});
    }

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
    queryData(contentType, success, error, filter?, sort?, skip?, limit?, select?) {
        throw new EverliveError({message: 'The method queryData is not implemented'});
    }

    /**
     * Delete items for the specified content type
     * @method removeData
     * @memberof BasePersister
     * @param {string} contentType The content type for which to clear the data item.
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     * @param {Object=} filter Delete the items matching the specified filter.
     */
    removeData(contentType, success, error, filter?) {
        throw new EverliveError({message: 'The method removeData is not implemented'});
    }

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
    updateData(contentType, updateObj, success, error, filter?) {
        throw new EverliveError({message: 'The method updateData is not implemented'});
    }

    _getKey(contentType) {
        return this.key + '_' + contentType;
    }

    /**
     * Returns a list of the mapped content types.
     * @method _getContentTypes
     * @memberof BasePersister
     * @param {Function} success A success callback.
     * @param {Function} error An error callback.
     */
    _getContentTypes(success, error) {
        throw new EverliveError({message: 'The method _getContentTypes is not implemented'});
    }
}