import * as _ from 'underscore';

import {FileStore, getFileStore} from '../../storages/FileStore';
import {BasePersister} from './BasePersister';

export class FileSystemPersister extends BasePersister {
    fileStore: FileStore;

    /**
     * @class FileSystemPersister
     * @protected
     * @extends BasePersister
     */
    constructor(key: string, options: any) {
        super(key, options);
        this.fileStore = getFileStore(options.storage.storagePath, options);
    }

    getAllData(success, error) {
        var errorHandler = this._fileSystemErrorHandler(error);
        super.getAllData(success, errorHandler);
    }

    getData(contentType, success, error) {
        var errorHandler = this._fileSystemErrorHandler(error);
        this.getFileHandle(contentType, (fileEntry) => {
            this._readFileContent(fileEntry, success, errorHandler);
        }, error);
    }

    saveData(contentType, data, success, error) {
        var errorHandler = this._fileSystemErrorHandler(error);
        this.getFileHandle(contentType, (fileEntry) => {
            this._writeFileContent(fileEntry, data, () => {
                this._saveContentTypes(contentType, success, errorHandler);
            }, errorHandler);
        }, errorHandler);
    }

    purge(contentType, success, error) {
        var errorHandler = this._fileSystemErrorHandler(error);
        this.getFileHandle(contentType, (fileEntry) => {
            this.fileStore.removeFile(fileEntry).then(() => {
                success();
            }).catch(error);
        }, errorHandler);
    }

    purgeAll(success, error) {
        var errorHandler = this._fileSystemErrorHandler(error);
        this.fileStore.removeFilesDirectory()
            .then(() => {
                success();
            })
            .catch(errorHandler);
    }

    getFileHandle(contentType, success, error) {
        var path = this._getFilePath(contentType);
        this.fileStore.getFilesDirectory()
            .then(() => {
                return this.fileStore.getFile(path);
            })
            .then((fileHandle) => {
                success(fileHandle);
            })
            .catch(error);
    }

    _getContentTypes(success, error) {
        this.getData(this.contentTypesStoreKey, (savedContentTypesRaw) => {
            const savedContentTypes = JSON.parse(savedContentTypesRaw || '[]');
            success(savedContentTypes);
        }, error);
    }

    _saveContentTypes(contentType, success, error) {
        this._getContentTypes((savedContentTypes) => {
            if (!_.contains(savedContentTypes, contentType)) {
                savedContentTypes.push(contentType);
            }

            this.getFileHandle(this.contentTypesStoreKey, (contentTypesFile) => {
                this._writeFileContent(contentTypesFile, JSON.stringify(savedContentTypes), success, error);
            }, error);
        }, error);
    }

    _readFileContent(fileEntry, success, error) {
        this.fileStore.readFileAsText(fileEntry).then((content) => {
            success(content);
        }).catch(error);
    }

    _writeFileContent(fileEntry, content, success, error) {
        this.fileStore.writeTextToFile(fileEntry, content)
            .then(success)
            .catch(error);
    }

    _getFilePath(contentType) {
        return this._getKey(contentType);
        //return utils.joinPath(this.fileStore.filesDirectoryPath, this._getKey(contentType));
    }

    _fileSystemErrorHandler(callback) {
        return this.fileStore.getErrorHandler(callback);
    }
}