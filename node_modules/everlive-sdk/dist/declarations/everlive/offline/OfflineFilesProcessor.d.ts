import { FileStore } from '../storages/FileStore';
import { Everlive } from '../Everlive';
export declare class OfflineFilesProcessor {
    setup: any;
    private _everlive;
    fileStore: FileStore;
    filesMetaStore: FileStore;
    private _offlineFilesData;
    constructor(setup: any, _everlive: Everlive);
    validateFileCreateObject(obj: any, isSync: any): Promise<{}>;
    getOfflineFilesData(): Promise<{}>;
    saveOfflineFilesData(): Promise<any>;
    upsertFileFromObject(obj: any, isCreate: any, isSync: any): Promise<any>;
    purge(localLocation: any): Promise<any>;
    writeFile(filename: any, contents: any, folder?: any): any;
    getFilenameForObject(obj: any): string;
    getOfflineLocation(url: any, id: any): Promise<any>;
}
