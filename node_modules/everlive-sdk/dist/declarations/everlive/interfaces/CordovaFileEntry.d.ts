export interface CordovaFileEntry {
    isFile: true;
    isDirectory: false;
    name: string;
    fullPath: string;
    getMetadata(successCallback: Function, errorCallback: Function): any;
    setMetadata(successCallback: Function, errorCallback: Function, metadataObject: any): void;
    moveTo(parent: string, newName: string, successCallback: Function, errorCallback: Function): void;
    copyTo(parent: string, newName: string, successCallback: Function, errorCallback: Function): void;
    toURL(): string;
    remove(successCallback: Function, errorCallback: Function): void;
    getParent(successCallback: Function, errorCallback: Function): any;
    createWriter(successCallback: Function, errorCallback: Function): any;
    file(successCallback: Function, errorCallback: Function): any;
}
