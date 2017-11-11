import * as _ from 'underscore';

import { BasePersister } from './persisters/BasePersister';
import { LocalStoragePersister } from './persisters/LocalStoragePersister';
import { FileSystemPersister } from './persisters/FileSystemPersister';
import { SQLitePersister } from './persisters/SQLitePersister';
import { Constants } from '../constants';
import { EverliveError } from '../EverliveError';

function getPersister(storageKey, options):BasePersister {
    var persister;

    var storageProvider = options.storage.provider;
    var storageProviderImplementation = options.storage.implementation;
    if (_.isObject(storageProviderImplementation) && storageProvider === Constants.StorageProvider.Custom) {
        persister = storageProviderImplementation;
    } else {
        switch (storageProvider) {
            case Constants.StorageProvider.LocalStorage:
                persister = new LocalStoragePersister(storageKey, options);
                break;
            case Constants.StorageProvider.FileSystem:
                persister = new FileSystemPersister(storageKey, options);
                break;
            case Constants.StorageProvider.SQLite:
                persister = new SQLitePersister(storageKey, options);
                break;
            case Constants.StorageProvider.Custom:
                throw new EverliveError({message: 'Custom storage provider requires an implementation object'});
            default:
                throw new EverliveError({message: 'Unsupported storage type ' + storageProvider});
        }
    }

    return persister;
}

export {
    BasePersister,
    LocalStoragePersister,
    FileSystemPersister,
    SQLitePersister,
    getPersister
}