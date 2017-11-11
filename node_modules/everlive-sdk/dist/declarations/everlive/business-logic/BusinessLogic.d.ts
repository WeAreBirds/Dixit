import { ProcessableObject } from "../../common/ProcessableObject";
import { SuccessCallback } from "../interfaces/SuccessCallback";
import { ErrorCallback } from "../interfaces/ErrorCallback";
import { CloudFunctionInvocationParameters } from "../interfaces/CloudFunctionInvocationParameters";
export declare class BusinessLogic extends ProcessableObject {
    static _isValidFuncName(name: any): boolean;
    /**
     * @class BusinessLogic
     * @classdesc A class for invoking your app's Business Logic such as Cloud Functions and Stored Procedures.
     * @protected
     * @param sdk {Everlive} The sdk instance
     */
    constructor(sdk: any);
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
    invokeCloudFunction(funcName: string, params: CloudFunctionInvocationParameters, success?: SuccessCallback<any>, error?: ErrorCallback): Promise<any>;
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
    invokeStoredProcedure(funcName: string, funcParams: any, success?: SuccessCallback<any>, error?: ErrorCallback): Promise<any>;
    private _invokeFunction(params, operation);
}
