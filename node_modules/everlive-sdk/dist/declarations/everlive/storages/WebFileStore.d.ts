import { FileStore } from './FileStore';
export declare class WebFileStore implements FileStore {
    filesDirectoryPath: any;
    _requestFileSystem: any;
    _resolveLocalFileSystemURL: any;
    _PERSISTENT_FILE_SYSTEM: any;
    options: any;
    private fileSystemRoot;
    constructor(storagePath: string, options: any);
    getErrorHandler(callback: any): (e: any) => void;
    getDataDirectory(): Promise<{}>;
    getFilesDirectory(): Promise<{}>;
    removeFilesDirectory(): Promise<{}>;
    removeFile(fileEntry: any): Promise<{}>;
    readFileAsText(fileEntry: any): Promise<{}>;
    writeTextToFile(fileEntry: any, content: any): Promise<{}>;
    getFileSize(filename: string, folder: string): Promise<{}>;
    getFile(fileName: any, dirEntry?: any): Promise<{}>;
    getFileByAbsolutePath(path: string): Promise<{}>;
    createDirectory(directory: any): Promise<{}>;
    renameFile(directoryEntry: any, fileEntry: any, filename: any): Promise<{}>;
    _getDirectoryWrap(directory: any, directoryEntry: any, options: any): Promise<{}>;
    _removeFolderWrap(filesDirEntry: any): Promise<{}>;
    _getWriterWrap(fileEntry: any, content: any): Promise<{}>;
    writeText(fileName: string, text: string, path?: string): Promise<any>;
    readFileAsBase64(fileEntry: any): Promise<{}>;
}
