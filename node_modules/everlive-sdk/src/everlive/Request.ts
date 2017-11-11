import * as _ from 'underscore';

import { Utils } from './utils';
import { reqwest, ReqwestOptions } from './reqwest.everlive';
import { Constants } from './constants';
import { isNodejs } from '../common/platform';
import { Query } from './query/Query';
import { Setup } from './Setup';
import { RequestOptions } from './interfaces/RequestOptions';

const Headers = Constants.Headers;
const EncodableHeaders = Constants.EncodableHeaders;
const buildAuthHeader = Utils.buildAuthHeader;
const parseUtilities = Utils.parseUtilities;
const guardUnset = Utils.guardUnset;

export class Request {

    static reviver = parseUtilities.getReviver();

    static parsers = {
        simple: {
            result: parseUtilities.parseResult.bind(null, Request.reviver),
            error: parseUtilities.parseXhrError.bind(null, Request.reviver)
        },
        single: {
            result: parseUtilities.parseSingleResult.bind(null, Request.reviver),
            error: parseUtilities.parseXhrError.bind(null, Request.reviver)
        },
        update: {
            result: parseUtilities.parseUpdateResult.bind(null, Request.reviver),
            error: parseUtilities.parseXhrError.bind(null, Request.reviver)
        },
        customRequest: {
            result: _.identity,
            error: parseUtilities.parseXhrResponse
        }
    };

    static sendRequest(request) {
        var url = request.buildUrl();
        url = Utils.disableRequestCache(url, request.method);
        request.method = request.method || Constants.HttpMethod.GET;
        var data = request.method === Constants.HttpMethod.GET ? request.data : JSON.stringify(request.data);
        request.headers['Accept'] = '*/*'; // Reqwest is case sensitive regarding this header

        var requestParams: ReqwestOptions = {
            url: url,
            method: request.method,
            data: data,
            headers: request.headers,
            contentType: 'application/json',
            crossOrigin: false
        };

        if (!isNodejs) {
            requestParams.crossOrigin = true;
        }

        return new Promise(function (resolve, reject) {
            return reqwest(requestParams)
                .then(function (res) {
                    resolve(res);
                }, function (err) {
                    reject(err);
                });
        });
    }

    method: string;
    endpoint: string;
    data;
    queryStringParams;

    private _headers;

    constructor(
        public setup: Setup,
        public options: RequestOptions
    ) {
        guardUnset(setup, 'setup');
        guardUnset(options, 'options');
        this.method = null;
        this.endpoint = null;
        this.data = null;

        this._headers = {};

        _.extend(this, options);
        this._init(options);
    }

    //make sure that the headers are always normalized
    get headers(): any {
        return this._headers;
    }

    set headers(val) {
        // If we let two identical headers with different casing slip into a request
        // the browser concatenates them which brings chaos to earth
        this._headers = Utils.normalizeKeys(val);
    }

    // Calls the underlying Ajax library
    // If there is a logged in user for the Everlive instance then her/his authentication will be used.
    static buildAuthHeader(setup, options?) {
        return buildAuthHeader(setup, options);
    }

    send() {
        return Request.sendRequest(this);
    }

    // Builds the URL of the target Everlive service
    buildUrl() {
        var url = Utils.buildUrl(this.setup) + this.endpoint;

        if (_.size(this.queryStringParams)) {
            url = url + '?' + Utils.toQueryString(this.queryStringParams);
        }

        return url;
    }

    // Processes the given query to return appropriate headers to be used by the request
    static buildQueryHeaders(query) {
        if (query) {
            if (query instanceof Query) {
                return Request._buildQueryHeaders(query);
            } else {
                return Request._buildFilterHeader(query.filter);
            }
        } else {
            return {};
        }
    }

    // Initialize the Request object by using the passed options
    _init(options) {
        _.extend(this.headers, Request.buildAuthHeader(this.setup, options), Request.buildQueryHeaders(options.query));
        this.encodeHeaders();
    }

    // Translates an Everlive.Query to request headers
    private static _buildQueryHeaders(query) {
        query = query.build();
        var headers = {};
        if (query.$where !== null) {
            headers[Headers.filter] = JSON.stringify(query.$where);
        }
        if (query.$select !== null) {
            headers[Headers.select] = JSON.stringify(query.$select);
        }
        if (query.$sort !== null) {
            headers[Headers.sort] = JSON.stringify(query.$sort);
        }
        if (query.$skip !== null) {
            headers[Headers.skip] = query.$skip;
        }
        if (query.$take !== null) {
            headers[Headers.take] = query.$take;
        }
        if (query.$expand !== null) {
            headers[Headers.expand] = JSON.stringify(query.$expand);
        }
        if (query.$aggregate !== null) {
            headers[Headers.aggregate] = JSON.stringify(query.$aggregate);
        }

        return headers;
    }

    private static _buildFilterHeader(filter) {
        var headers = {};
        headers[Headers.filter] = JSON.stringify(filter);
        return headers;
    }

    encodeHeaders() {
        var headers = this.headers;
        _.each(EncodableHeaders, function (headerName) {
            if (headers[headerName] !== undefined) {
                headers[headerName] = encodeURIComponent(headers[headerName]);
            }
        });
    }
}