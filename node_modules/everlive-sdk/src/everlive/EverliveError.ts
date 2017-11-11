import { Errors } from '../common/errors';

export class EverliveErrors extends Errors {
    static itemNotFound = {
        code: 801,
        message: 'Item not found.'
    };
    static syncConflict = {
        code: 10001,
        message: 'A conflict occurred while syncing data.'
    };
    static syncError = {
        code: 10002,
        message: 'Synchronization failed for item.'
    };
    static syncInProgress = {
        code: 10003,
        message: 'Cannot perform operation while synchronization is in progress.'
    };
    static syncCancelledByUser = {
        code: 10004,
        message: 'Synchronization cancelled by user.'
    };
    static syncErrorUnknown = {
        code: 10005,
        message: 'An unknown error occurred while synchronizing. Please make sure there is internet connectivity.'
    };
    static operationNotSupportedOffline = {
        code: 20000 // the error message is created dynamically based on the query filter for offline storage
    };
    static invalidId = {
        code: 20001,
        message: 'Invalid or missing Id in model.'
    };
    static bodyWithGetRequestNotSupported = {
        code: 601,
        message: 'Sending a request body is not supported for "GET" requests.'
    };
    static invalidOrMissingFunctionName = {
        code: 601,
        message: 'Invalid or missing cloud function name.'
    };
    static invalidOrMissingProcedureName = {
        code: 601,
        message: 'Invalid or missing procedure name.'
    };
    static generalDatabaseError = {
        code: 107,
        message: 'General database error.'
    };
    static invalidToken = {
        code: 301,
        message: 'Invalid access token.'
    };
    static expiredToken = {
        code: 302,
        message: 'Expired access token.'
    };
    static invalidExpandExpression = {
        code: 618,
        message: 'Invalid expand expression.'
    };
    static invalidRequest = {
        code: 601,
        message: 'Invalid request.'
    };
    static queryCancelled = {
        code: 700,
        message: 'Query cancelled.'
    };
    static missingContentType = {
        code: 701,
        message: 'ContentType not specified.'
    };
    static missingOrInvalidFileContent = {
        code: 702,
        message: 'Missing or invalid file content.'
    };
    static customFileSyncNotSupported = {
        code: 703,
        message: 'Custom ConflictResolution for files is not allowed.'
    };
    static cannotDownloadOffline = {
        code: 704,
        message: 'Cannot download a file while offline.'
    };
    static cannotForceCacheWhenDisabled = {
        code: 705,
        message: 'Cannot use forceCache while the caching is disabled.'
    };
    static filesNotSupportedInBrowser = {
        code: 706,
        message: 'Create and Update operations are not supported for Files in browsers while in offline mode.'
    };
    static pushNotSupportedOffline = {
        code: 707,
        message: 'Push is not supported in offline mode.'
    };
    static noOfflineSupport = {
        code: 708,
        message: 'You have instantiated the SDK without support for offline storage.'
    };
	static cacheDisabled = {
        code: 709 // the error message is created dynamically based on the cache operation
    };
    static singleValueExpected = {
        code: 710
    }
}

export class EverliveErrorHelper {
    static buildCacheDisabledErrorMessage = function (cacheOperation) {
        return 'Cannot use ' + cacheOperation + ' while the caching is disabled.';
    };

    static buildSingleValueExpectedErrorMessage = function (operation) {
        return 'A single value is expected in ' + operation + ' query modifier.';
    }
}

export class EverliveError extends Error {
    private _err: Error;

    name: string = 'EverliveError';
    message: string;
    code: number;

    constructor(err: { message?: string, code?: number}) {
        super(err.message);
        this.message = err.message;
        this.code = err.code;
        this._err = new Error();
    }

    get stack(): string {
        return this._err.stack;
    }

    public toJSON(): any {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            stack: this.stack
        };
    }
}

export enum DeviceRegistrationErrorType {
    EverliveError = 1,
    PluginError = 2
}

export class DeviceRegistrationError extends EverliveError {
    constructor(
        public errorType: DeviceRegistrationErrorType,
        message: string,
        public additionalInformation?: any
    ) {
        super({message, code: additionalInformation && additionalInformation.code});
    }
    public static fromEverliveError(err: any): DeviceRegistrationError {
        return new DeviceRegistrationError(
            DeviceRegistrationErrorType.EverliveError, err.message, err);
    }

    public static fromPluginError(errorObj: any): DeviceRegistrationError {
        var message = 'A plugin error occurred';
        if (errorObj) {
            if (typeof errorObj.error === 'string') {
                message = errorObj.error;
            } else if (typeof errorObj.message === 'string') {
                message = errorObj.message;
            }
        }

        return new DeviceRegistrationError(DeviceRegistrationErrorType.PluginError, message, errorObj);
    }
}