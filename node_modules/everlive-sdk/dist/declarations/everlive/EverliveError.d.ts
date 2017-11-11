import { Errors } from '../common/errors';
export declare class EverliveErrors extends Errors {
    static itemNotFound: {
        code: number;
        message: string;
    };
    static syncConflict: {
        code: number;
        message: string;
    };
    static syncError: {
        code: number;
        message: string;
    };
    static syncInProgress: {
        code: number;
        message: string;
    };
    static syncCancelledByUser: {
        code: number;
        message: string;
    };
    static syncErrorUnknown: {
        code: number;
        message: string;
    };
    static operationNotSupportedOffline: {
        code: number;
    };
    static invalidId: {
        code: number;
        message: string;
    };
    static bodyWithGetRequestNotSupported: {
        code: number;
        message: string;
    };
    static invalidOrMissingFunctionName: {
        code: number;
        message: string;
    };
    static invalidOrMissingProcedureName: {
        code: number;
        message: string;
    };
    static generalDatabaseError: {
        code: number;
        message: string;
    };
    static invalidToken: {
        code: number;
        message: string;
    };
    static expiredToken: {
        code: number;
        message: string;
    };
    static invalidExpandExpression: {
        code: number;
        message: string;
    };
    static invalidRequest: {
        code: number;
        message: string;
    };
    static queryCancelled: {
        code: number;
        message: string;
    };
    static missingContentType: {
        code: number;
        message: string;
    };
    static missingOrInvalidFileContent: {
        code: number;
        message: string;
    };
    static customFileSyncNotSupported: {
        code: number;
        message: string;
    };
    static cannotDownloadOffline: {
        code: number;
        message: string;
    };
    static cannotForceCacheWhenDisabled: {
        code: number;
        message: string;
    };
    static filesNotSupportedInBrowser: {
        code: number;
        message: string;
    };
    static pushNotSupportedOffline: {
        code: number;
        message: string;
    };
    static noOfflineSupport: {
        code: number;
        message: string;
    };
    static cacheDisabled: {
        code: number;
    };
    static singleValueExpected: {
        code: number;
    };
}
export declare class EverliveErrorHelper {
    static buildCacheDisabledErrorMessage: (cacheOperation: any) => string;
    static buildSingleValueExpectedErrorMessage: (operation: any) => string;
}
export declare class EverliveError extends Error {
    private _err;
    name: string;
    message: string;
    code: number;
    constructor(err: {
        message?: string;
        code?: number;
    });
    readonly stack: string;
    toJSON(): any;
}
export declare enum DeviceRegistrationErrorType {
    EverliveError = 1,
    PluginError = 2,
}
export declare class DeviceRegistrationError extends EverliveError {
    errorType: DeviceRegistrationErrorType;
    additionalInformation: any;
    constructor(errorType: DeviceRegistrationErrorType, message: string, additionalInformation?: any);
    static fromEverliveError(err: any): DeviceRegistrationError;
    static fromPluginError(errorObj: any): DeviceRegistrationError;
}
