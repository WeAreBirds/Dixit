import * as _ from 'underscore';
import * as path from 'path';

import { DataQueryOperation } from '../../common/Constants';
import { Request } from '../Request';

export const RequestOptionsBuilder = {
    _buildEndpointUrl(dataQuery) {
        let endpoint = dataQuery.collectionName;
        const isQueryById = dataQuery.additionalOptions && dataQuery.additionalOptions.id !== undefined;
        const queryType = typeof dataQuery.query;

        if (isQueryById) {
            endpoint = path.join(endpoint, dataQuery.additionalOptions.id.toString());
        } else if (queryType === 'string' || queryType === 'number') {
            endpoint = path.join(endpoint, dataQuery.query);
        }

        return endpoint;
    },

    _buildBaseObject(dataQuery) {
        const defaultObject: any = {
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery),
            query: dataQuery.query,
            data: dataQuery.data,
            headers: dataQuery.headers
        };

        if (dataQuery.parse) {
            defaultObject.parse = dataQuery.parse;
        }

        return defaultObject;
    },

    _build(dataQuery, additionalOptions) {
        const options = _.extend(RequestOptionsBuilder._buildBaseObject(dataQuery), additionalOptions);

        if (additionalOptions.endpointSupplement) {
            options.endpoint = path.join(options.endpoint, additionalOptions.endpointSupplement);
        }

        return options;
    },

    [DataQueryOperation.Read](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET'
        });
    },

    [DataQueryOperation.ReadById](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET'
        });
    },

    [DataQueryOperation.Count](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET',
            endpoint: dataQuery.collectionName + '/_count'
        });
    },

    [DataQueryOperation.Create](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST'
        });
    },

    [DataQueryOperation.RawUpdate](dataQuery) {
        var query = dataQuery.query;
        var ofilter = typeof query === 'object' ? query : null; // request options filter

        return RequestOptionsBuilder._build(dataQuery, {
            method: 'PUT',
            query: ofilter
        });
    },

    [DataQueryOperation.Update](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'PUT'
        });
    },

    [DataQueryOperation.Delete](dataQuery) {
        return deleteOperation(dataQuery);
    },

    [DataQueryOperation.DeleteById](dataQuery) {
        return deleteOperation(dataQuery);
    },

    [DataQueryOperation.SetAcl](dataQuery) {
        let method, data;
        if (dataQuery.additionalOptions.acl === null) {
            method = 'DELETE';
        } else {
            method = 'PUT';
            data = dataQuery.additionalOptions.acl;
        }

        return RequestOptionsBuilder._build(dataQuery, {
            method: method,
            endpointSupplement: '/_acl',
            data: data
        });
    },

    [DataQueryOperation.SetOwner](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'PUT',
            endpointSupplement: '/_owner'
        });
    },

    [DataQueryOperation.UserLogin](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: 'oauth/token',
            authHeaders: false,
            parse: Request.parsers.single
        });
    },

    [DataQueryOperation.UserLogout](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET',
            endpoint: 'oauth/logout'
        });
    },

    [DataQueryOperation.UserChangePassword](dataQuery) {
        const keepTokens = dataQuery.additionalOptions.keepTokens;
        let endpoint = 'Users/changepassword';
        if (keepTokens) {
            endpoint += '?keepTokens=true';
        }

        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: endpoint,
            parse: Request.parsers.single
        });
    },

    [DataQueryOperation.UserLoginWithProvider](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            authHeaders: false
        });
    },

    [DataQueryOperation.UserLinkWithProvider](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery) + '/link'
        });
    },

    [DataQueryOperation.UserUnlinkFromProvider](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery) + '/unlink'
        });
    },

    [DataQueryOperation.UserResetPassword](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery) + '/resetpassword'
        });
    },

    [DataQueryOperation.UserSetPassword](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'POST',
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery) + '/setpassword'
        });
    },

    [DataQueryOperation.FilesUpdateContent](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'PUT',
            endpoint: RequestOptionsBuilder._buildEndpointUrl(dataQuery) + '/Content'
        });
    },

    [DataQueryOperation.FilesGetDownloadUrlById](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET'
        });
    },

    [DataQueryOperation.Aggregate](dataQuery) {
        return RequestOptionsBuilder._build(dataQuery, {
            method: 'GET',
            endpoint: dataQuery.collectionName + '/_aggregate'
        });
    },

    [DataQueryOperation.InvokeCloudFunction](dataQuery) {
        return businessLogic(dataQuery);
    },

    [DataQueryOperation.InvokeStoredProcedure](dataQuery) {
        return businessLogic(dataQuery);
    }
};

function deleteOperation(dataQuery) {
    return _.extend(RequestOptionsBuilder._buildBaseObject(dataQuery), {
        method: 'DELETE'
    });
}

function businessLogic(dataQuery) {
    return RequestOptionsBuilder._build(dataQuery, dataQuery.additionalOptions);
}

