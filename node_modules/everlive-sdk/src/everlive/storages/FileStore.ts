import * as platform from '../../common/platform';
import { WebFileStore } from './WebFileStore';
import { NativeScriptFileStore } from './NativeScriptFileStore';

export interface FileStore {
    removeFile(fileEntry);
    removeFilesDirectory();
    getFilesDirectory();
    readFileAsText(fileEntry);
    writeTextToFile(fileEntry, content);
    writeText(filename: string, text: string, path?: string);
    getFileByAbsolutePath(path: string);
    getFileSize(filename: string, folder: string);
    getErrorHandler(callback: Function);
    getFile(path);
}

export function getFileStore (storagePath: string, options: any): FileStore {
    if (platform.isNativeScript) {
        return new NativeScriptFileStore(storagePath, options);
    } else if (platform.isCordova || platform.isDesktop) {
        return new WebFileStore(storagePath, options);
    } else {
        return <FileStore>{};
    }
}