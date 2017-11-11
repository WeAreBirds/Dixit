import { Utils as CommonUtils } from '../common/utils';
export declare class DeviceRegistrationResult {
    token: string;
    constructor(token: string);
}
export declare class Utils extends CommonUtils {
    static normalizeKeys(obj: any): any;
    static buildAuthHeader(setup: any, options?: any): {
        authorization: string;
    };
    static buildUrl(setup: any): string;
    static getDbOperators(expression: any, shallow?: boolean): any[];
    static disableRequestCache(url?: any, method?: any): any;
    static getUnsupportedOperators(filter: any): any[];
    static isQuerySupportedOffline(query: any): boolean;
    static b64toBlob(b64Data: any, contentType?: string, sliceSize?: number): Blob;
    static arrayBufferToBase64(buffer: any): string;
    static transformPlatformPath(platformPath: any): any;
    static _stringCompare(string: any, check: any): boolean;
    static startsWith(str: any, word: any): boolean;
    static endsWith(str: any, word: any): boolean;
    static isContentType: {
        files: (collectionName: any) => boolean;
        users: (collectionName: any) => boolean;
        pushNotifications: (collectionName: any) => boolean;
        pushDevices: (collectionName: any) => boolean;
    };
    static isElement: {
        _isElement: (el: any, check: any) => boolean;
        image: (el: any) => boolean;
        anchor: (el: any) => boolean;
    };
    static joinPath(...args: string[]): any;
    static getId(obj: any): any;
    static _inAppBuilderSimulator(): any;
    static isValidId(input: any): boolean;
    static modelHasValidId(model: any): boolean;
    static callbackAndPromiseErrorResponse(err: any, errorHandler: any): Promise<any>;
    static toQueryString(obj: any): string;
    static lazyRequire(_dynamic_module_: any, exportName: any): {};
    static promiseHash(obj: any): Promise<any>;
    static promiseHashSettled(obj: any): Promise<any>;
    static promisesAllSettled(promises: Promise<any>[]): Promise<any>;
    private static _mapPromises(promises, stopOnError?);
    static isOfflineStorageEnabled(setup: any): boolean;
    static existsAndIsNotEmpty(obj: string | Array<any> | Object): boolean;
}
export declare type PromiseSettlementState = 'fulfilled' | 'rejected';
export declare type PromiseSettlement = {
    state: PromiseSettlementState;
    value: any;
} | {
    state: PromiseSettlementState;
    reason: any;
};
