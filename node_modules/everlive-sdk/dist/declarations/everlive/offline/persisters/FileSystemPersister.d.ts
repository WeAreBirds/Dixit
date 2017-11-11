import { FileStore } from '../../storages/FileStore';
import { BasePersister } from './BasePersister';
export declare class FileSystemPersister extends BasePersister {
    fileStore: FileStore;
    /**
     * @class FileSystemPersister
     * @protected
     * @extends BasePersister
     */
    constructor(key: string, options: any);
    getAllData(success: any, error: any): void;
    getData(contentType: any, success: any, error: any): void;
    saveData(contentType: any, data: any, success: any, error: any): void;
    purge(contentType: any, success: any, error: any): void;
    purgeAll(success: any, error: any): void;
    getFileHandle(contentType: any, success: any, error: any): void;
    _getContentTypes(success: any, error: any): void;
    _saveContentTypes(contentType: any, success: any, error: any): void;
    _readFileContent(fileEntry: any, success: any, error: any): void;
    _writeFileContent(fileEntry: any, content: any, success: any, error: any): void;
    _getFilePath(contentType: any): string;
    _fileSystemErrorHandler(callback: any): any;
}
