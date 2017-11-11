import {
    EverliveError,
    EverliveErrors
} from '../../EverliveError';
import {
    DataQueryOperation
} from '../../constants';
import {Utils} from '../../utils';
import * as platform from '../../../common/platform';

export default class OfflineQueryPreprocessor {
    processDataQuery(query, iterator, data, value) {
        if ((!query.isSync && data.offlineStorage && data.offlineStorage.isSynchronizing())) {
            const error = new EverliveError(EverliveErrors.syncInProgress);
            return iterator.error(error);
        }

        if (Utils.isContentType.files(data.collectionName) && platform.isDesktop) {
            const op = query.operation;

            if (query.useOffline && query.applyOffline && (op === DataQueryOperation.Create || op === DataQueryOperation.Update)) {
                const error = new EverliveError(EverliveErrors.filesNotSupportedInBrowser);
                return iterator.error(error);
            }
        }

        return iterator.next(value);
    }
}