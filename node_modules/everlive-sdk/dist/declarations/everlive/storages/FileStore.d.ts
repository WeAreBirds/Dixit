export interface FileStore {
    removeFile(fileEntry: any): any;
    removeFilesDirectory(): any;
    getFilesDirectory(): any;
    readFileAsText(fileEntry: any): any;
    writeTextToFile(fileEntry: any, content: any): any;
    writeText(filename: string, text: string, path?: string): any;
    getFileByAbsolutePath(path: string): any;
    getFileSize(filename: string, folder: string): any;
    getErrorHandler(callback: Function): any;
    getFile(path: any): any;
}
export declare function getFileStore(storagePath: string, options: any): FileStore;
