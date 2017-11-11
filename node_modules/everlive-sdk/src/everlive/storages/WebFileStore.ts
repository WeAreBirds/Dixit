declare const window, document, FileError, navigator;

import * as _ from 'underscore';

import * as platform from '../../common/platform';
import { EverliveError } from '../EverliveError';
import { Utils } from '../utils';
import { FileStore } from './FileStore';

var deviceReadyPromise = function () {
    return new Promise(function (resolve) {
        document.addEventListener('deviceready', resolve);
    });
};

export class WebFileStore implements FileStore {
    filesDirectoryPath;
    _requestFileSystem;
    _resolveLocalFileSystemURL;
    _PERSISTENT_FILE_SYSTEM;
    options;

    private fileSystemRoot;

    constructor(storagePath: string, options: any) {
        this.options = options;

        var filesDirectoryPath;

        if (platform.isWindowsPhone || platform.isInAppBuilderSimulator()) {
            //windows phone does not handle leading or trailing slashes very well :(
            filesDirectoryPath = storagePath.replace(new RegExp('/', 'g'), '');
        } else {
            if (storagePath.lastIndexOf('/') === -1) {
                filesDirectoryPath = storagePath + '/';
            }
        }

        filesDirectoryPath = filesDirectoryPath || storagePath;

        deviceReadyPromise().then(() => {
            this.filesDirectoryPath = filesDirectoryPath;
            this._requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            this._resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
            this._PERSISTENT_FILE_SYSTEM = window.LocalFileSystem ? window.LocalFileSystem.PERSISTENT : window.PERSISTENT;
        });
    }

    getErrorHandler(callback) {
        var errorsMap = {
            '1000': 'NOT_FOUND'
        };

        _.each(Object.keys(FileError), function (error) {
            errorsMap[FileError[error]] = error;
        });

        return function (e) {
            if (!e.message) {
                e.message = errorsMap[e.code];
            }

            callback && callback(e);
        }
    }

    getDataDirectory() {
        return deviceReadyPromise()
            .then(() => {
                var requestFileSystem = (bytes, success, error) => {
                    this._requestFileSystem.call(window, this._PERSISTENT_FILE_SYSTEM, bytes, (fileSystem) => {
                        this.fileSystemRoot = fileSystem.root;
                        this.fileSystemRoot.nativeURL = this.fileSystemRoot.nativeURL || this.fileSystemRoot.toURL();
                        success(this.fileSystemRoot);
                    }, error);
                };

                return new Promise((resolve, reject) => {
                    if (this.fileSystemRoot) {
                        return resolve(this.fileSystemRoot);
                    }

                    if (platform.isDesktop) {
                        if (navigator && !navigator.webkitPersistentStorage) {
                            return reject(new EverliveError({message: 'FileSystemStorage can be used only with browsers supporting it. Consider using localStorage.'}))
                        }

                        navigator.webkitPersistentStorage.requestQuota(this.options.storage.requestedQuota, (grantedBytes) => {
                            requestFileSystem(grantedBytes, resolve, reject);
                        }, reject);
                    } else {
                        requestFileSystem(0, resolve, reject);
                    }
                });
            });
    };

    getFilesDirectory() {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getDataDirectory()
                .then(function (dataDirectory: any) {
                    dataDirectory.getDirectory(self.filesDirectoryPath, {
                        create: true,
                        exclusive: false
                    }, resolve, reject);
                })
                .catch(reject);
        });
    }

    removeFilesDirectory() {
        var self = this;

        return this.getFilesDirectory()
            .then(function (filesDirectory) {
                return self._removeFolderWrap(filesDirectory);
            });
    }

    removeFile(fileEntry) {
        return new Promise(function (resolve, reject) {
            fileEntry.remove(function () {
                resolve();
            }, reject);
        });
    }

    readFileAsText(fileEntry) {
        var self = this;

        return new Promise(function (resolve, reject) {
            self.getFilesDirectory().then(function () {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        var result = this.result;

                        //windows phone returns an object....
                        if (typeof this.result === 'object') {
                            result = JSON.stringify(this.result);
                        }

                        resolve(result);
                    };
                    reader.onerror = reject;
                    reader.readAsText(file);
                }, reject);
            }).catch(reject);
        });
    }

    writeTextToFile(fileEntry, content) {
        var self = this;

        return self.getFilesDirectory()
            .then(function () {
                return self._getWriterWrap(fileEntry, content);
            });
    }

    getFileSize(filename: string, folder: string) {
        var self = this;

        return new Promise(function (resolve, reject) {
            var fileLocation = Utils.joinPath(folder, filename);

            return self.getFile(fileLocation)
                .then(function (fileEntry: any) {
                    fileEntry.file(function (file: any) {
                        resolve(file.size);
                    }, reject);
                });
        });
    }

    getFile(fileName, dirEntry?) {
        return this.getFilesDirectory()
            .then(function (directoryEntry) {
                var fileDirectory;
                if (dirEntry) {
                    fileDirectory = dirEntry;
                } else {
                    fileDirectory = directoryEntry;
                }

                return new Promise(function (resolve, reject) {
                    fileDirectory.getFile(fileName, {
                        create: true,
                        exclusive: false
                    }, resolve, reject);
                });
            });
    }

    getFileByAbsolutePath(path: string) {
        var self = this;
        path = Utils.transformPlatformPath(path);

        return new Promise(function (resolve, reject) {
            self._resolveLocalFileSystemURL.call(window, path, resolve, function (err) {
                if (err && err.code === FileError.NOT_FOUND_ERR) {
                    return resolve();
                }

                return reject(err);
            });
        });
    }

    createDirectory(directory) {
        var self = this;

        return this.getFilesDirectory()
            .then(function (directoryEntry) {
                return self._getDirectoryWrap(directory, directoryEntry, {
                    create: true,
                    exclusive: false
                });
            });
    }

    renameFile(directoryEntry, fileEntry, filename) {
        return new Promise(function (resolve, reject) {
            fileEntry.moveTo(directoryEntry, filename, resolve, reject);
        });
    }

    _getDirectoryWrap(directory, directoryEntry, options) {
        return new Promise(function (resolve, reject) {
            directoryEntry.getDirectory(directory, options, resolve, reject);
        });
    }

    _removeFolderWrap(filesDirEntry) {
        return new Promise(function (resolve, reject) {
            filesDirEntry.removeRecursively(function () {
                resolve();
            }, reject);
        });
    }

    _getWriterWrap(fileEntry, content) {
        return new Promise(function (resolve, reject) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function () {
                    resolve();
                };

                fileWriter.onerror = reject;

                var bb = new Blob([content]);
                fileWriter.write(bb);
            }, reject);
        });
    }

    writeText(fileName: string, text: string, path?: string) {
        var self = this;
        var fileHandle;

        return this.getFilesDirectory()
            .then(function (directoryEntry) {
                if (path) {
                    return self.createDirectory(path);
                } else {
                    return directoryEntry;
                }
            })
            .then(function (directoryEntry) {
                return self.getFile(fileName, directoryEntry);
            })
            .then(function (fileEntry) {
                fileHandle = fileEntry;
                return self.writeTextToFile(fileEntry, text);
            })
            .then(function () {
                // there  is a difference between the cordova implementation and the standard FileTransfer fileEntry
                return fileHandle.nativeURL || fileHandle.toURL();
            });
    }

    // http://stackoverflow.com/questions/9583363/get-base64-from-imageuri-with-phonegap
    readFileAsBase64(fileEntry) {
        return new Promise(function (resolve, reject) {
            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (evt: any) {
                    resolve(Utils.arrayBufferToBase64(evt.target.result));
                };

                reader.readAsArrayBuffer(file);
            }, reject);
        });
    }
}
