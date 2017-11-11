import { BasePersister } from './persisters/BasePersister';
import { LocalStoragePersister } from './persisters/LocalStoragePersister';
import { FileSystemPersister } from './persisters/FileSystemPersister';
import { SQLitePersister } from './persisters/SQLitePersister';
declare function getPersister(storageKey: any, options: any): BasePersister;
export { BasePersister, LocalStoragePersister, FileSystemPersister, SQLitePersister, getPersister };
