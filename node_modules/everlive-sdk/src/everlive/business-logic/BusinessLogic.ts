import * as path from 'path';
import * as _ from 'underscore';

import { Constants } from '../constants';
import { EverliveError, EverliveErrors } from '../EverliveError';
import { DataQueryOperation } from "../../common/Constants";
import { Utils } from '../utils';
import { ProcessableObject } from "../../common/ProcessableObject";
import { SuccessCallback } from "../interfaces/SuccessCallback";
import { ErrorCallback } from "../interfaces/ErrorCallback";
import { CloudFunctionInvocationParameters } from "../interfaces/CloudFunctionInvocationParameters";

export class BusinessLogic extends ProcessableObject {
    static _isValidFuncName(name) {
        return _.isString(name) && name !== '';
    }

    /**
     * @class BusinessLogic
     * @classdesc A class for invoking your app's Business Logic such as Cloud Functions and Stored Procedures.
     * @protected
     * @param sdk {Everlive} The sdk instance
     */
    constructor(sdk) {
        super(sdk, 'BusinessLogic');
    }

    /**
     * Invokes a Cloud Function from the app's Business Logic layer.
     * @method invokeCloudFunction
     * @memberOf BusinessLogic.prototype
     * @param {String} funcName The name of the function to invoke.
     * @param {Object} params An object containing all invocation request parameters.
     * @param {HttpMethod} [params.method=GET] HTTP request method.
     * @param {Object} [params.queryStringParams] Parameters to be passed in the query string.
     * @param {Object} [params.data] Data to be sent with the request.
     * @param {Boolean} [params.authHeaders=true] Whether to send the credentials of the currently logged-in user.
     * @param {Object} [params.headers] Additional headers to be sent with the request.
     * @param {Object} [params.customParameters] Custom parameters to be sent with the request. They will be accessible in the Cloud Function code.
     * @returns {Promise} A promise resolved on successful response and rejected on error response.
     */
    /**
     * Invokes a Cloud Function from the app's Business Logic layer.
     * @method invokeCloudFunction
     * @memberOf BusinessLogic.prototype
     * @param {String} funcName The name of the function to invoke.
     * @param {Object} params An object containing all invocation request parameters.
     * @param {HttpMethod} [params.method=GET] HTTP request method.
     * @param {Object} [params.queryStringParams] Parameters to be passed in the query string.
     * @param {Object} [params.data] Data to be sent with the request.
     * @param {Boolean} [params.authHeaders=true] Whether to send the credentials of the currently logged-in user.
     * @param {Object} [params.headers] Additional headers to be sent with the request.
     * @param {Object} [params.customParameters] Custom parameters to be sent with the request. They will be accessible in the Cloud Function code.
     * @param {Function} success Success callback function.
     * @param {Function} error Error callback function.
     */
    invokeCloudFunction(funcName: string, params: CloudFunctionInvocationParameters, success?: SuccessCallback<any>, error?: ErrorCallback): Promise<any> {
        if (!BusinessLogic._isValidFuncName(funcName)) {
            const err = new EverliveError(EverliveErrors.invalidOrMissingFunctionName);
            return Utils.callbackAndPromiseErrorResponse(err, error);
        }

        let parameters: any = _.extend({
            method: Constants.HttpMethod.GET,
            success: success,
            error: error
        }, params);

        if (parameters.method.toUpperCase() === Constants.HttpMethod.GET && _.size(parameters.data)) {
            const err = new EverliveError(EverliveErrors.bodyWithGetRequestNotSupported);
            return Utils.callbackAndPromiseErrorResponse(err, error);
        }

        parameters.endpoint = path.join(Constants.cloudFuncsEndpoint, funcName);
        return this._invokeFunction(parameters, DataQueryOperation.InvokeCloudFunction);
    }

    /**
     * Invokes a Stored Procedure from the app's Business Logic layer.
     * @method invokeStoredProcedure
     * @memberOf BusinessLogic.prototype
     * @param {String} funcName The name of the Stored Procedure to invoke.
     * @param {Object} funcParams Parameters to be passed to the Stored Procedure.
     * @returns {Promise} A promise resolved on successful response and rejected on error response.
     */
    /**
     * Invokes a Stored Procedure from the app's Business Logic layer.
     * @method invokeStoredProcedure
     * @memberOf BusinessLogic.prototype
     * @param {String} funcName The name of the stored procedure to invoke.
     * @param {Object} funcParams Parameters to be passed to the Stored Procedure.
     * @param {Function} success Success callback function.
     * @param {Function} error Error callback function.
     */
    invokeStoredProcedure(funcName: string, funcParams: any, success?: SuccessCallback<any>, error?: ErrorCallback): Promise<any> {
        if (!BusinessLogic._isValidFuncName(funcName)) {
            const err = new EverliveError(EverliveErrors.invalidOrMissingProcedureName);
            return Utils.callbackAndPromiseErrorResponse(err, error);
        }

        const reqParams = {
            method: Constants.HttpMethod.POST,
            endpoint: path.join(Constants.sqlProceduresEndpoint, funcName),
            data: funcParams || {},
            success: success,
            error: error
        };

        return this._invokeFunction(reqParams, DataQueryOperation.InvokeStoredProcedure);
    }

    private _invokeFunction(params, operation: DataQueryOperation) {
        const {
            customParameters,
            method,
            endpoint,
            success,
            error
        } = params;

        const additionalOptions = _.extend({
            customParameters,
            method,
            endpoint,
            authHeaders: true,
            isCustomRequest: true
        }, params);
        const dataQuery = this.buildDataQuery({ additionalOptions }, operation, {
            collectionName: this.collectionName
        });
        return this.processDataQuery<any>(dataQuery, success, error);
    }
}
