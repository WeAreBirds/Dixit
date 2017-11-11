import {Request} from '../Request';
import {Utils} from '../utils';
import {RequestOptionsBuilder} from '../query/RequestOptionsBuilder';
import {EverliveErrors} from '../EverliveError';
import { Constants } from '../constants';
import { platform } from '../../common/platform';

export const RequestService = {
    buildRequest(query, data) {
        const getRequestOptionsFromQuery = RequestOptionsBuilder[query.operation];
        const requestOptions = getRequestOptionsFromQuery(query);
        this.setAdditionalHeaders(query, requestOptions);
        return new Request(data.sdk.setup, requestOptions);
    },

    setAdditionalHeaders(query, requestOptions) {
        if (query.isSync) {
            requestOptions.headers[Constants.Headers.sync] = true;
        }

        var sdkHeaderValue = {
            sdk: 'js',
            platform: platform.platform
        };

        requestOptions.headers[Constants.Headers.sdk] = JSON.stringify(sdkHeaderValue);
    },

    /**
     * Sends a request and if it must applies the result offline.
     * @param query
     * @param data
     * @param [request]
     * @returns {Promise} Resolves with the response.
     */
    handleRequestProcessing(query, data, request = this.buildRequest(query, data)) {
        return new Promise(function (resolve, reject) {
            let successData;

            request.send()
                .then(function (res) {
                    successData = res;
                    if (query.applyOffline) {
                        return data.applyQueryOffline(query, successData);
                    } else {
                        return successData;
                    }
                }, function (err) {
                    reject(err);
                }).then(function () {
                    resolve(successData);
                }, function (err) {
                    const notSupported = EverliveErrors.operationNotSupportedOffline.code;
                    const notFound = EverliveErrors.itemNotFound.code;
                
                    const online = !query.canUseOffline || !query.useCache;
                    if (online && (err.code === notSupported || err.code === notFound)) {
                        resolve(successData);
                    } else {
                        reject(err);
                    }
                });
        });
    },

    /**
     * Sends a request.
     * @param request
     * @returns {Promise} Resolves with the parsed response.
     */
    sendRequest(request) {
        return new Promise(function (resolve, reject) {
            request.send()
                .then(function (res) {
                    const result = res.Result || res;
                    const reviver = Utils.parseUtilities.getReviver();
                    Utils.parseUtilities.parseResult(reviver, result);
                    resolve(result);
                }, function (err) {
                    reject(err);
                });
        });
    }
};