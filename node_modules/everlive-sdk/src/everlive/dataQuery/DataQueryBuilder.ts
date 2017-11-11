import { contains, chain, has, extend, find } from 'underscore';

import { DataQueryBuilder as CommonDataQueryBuilder } from '../../common/dataQuery/DataQueryBuilder';
import { DataQueryOperation } from '../../common/Constants';

import { DataQuery as CommonDataQuery } from '../../common/dataQuery/DataQuery';
import { DataQuery } from '../dataQuery/DataQuery';
import { Query } from '../query/Query';
import { Constants } from '../constants';

const Headers = Constants.Headers;

export class DataQueryBuilder extends CommonDataQueryBuilder {
    static _tryBuildQueryAllowedOperations = [
        DataQueryOperation.Read,
        DataQueryOperation.ReadById,
        DataQueryOperation.Count,
        DataQueryOperation.Aggregate,
        DataQueryOperation.SetAcl,
        DataQueryOperation.Update,
        DataQueryOperation.SetOwner,
        DataQueryOperation.Delete,
        DataQueryOperation.DeleteById,
        DataQueryOperation.RawUpdate
    ];

    static _tryGetDataAllowedOperations = [
        DataQueryOperation.Create,
        DataQueryOperation.RawUpdate,
        DataQueryOperation.Update,
        DataQueryOperation.SetOwner,
        DataQueryOperation.UserLogin,
        DataQueryOperation.UserLoginWithProvider,
        DataQueryOperation.FilesUpdateContent,
        DataQueryOperation.UserResetPassword,
        DataQueryOperation.UserSetPassword,
        DataQueryOperation.UserChangePassword,
        DataQueryOperation.UserLinkWithProvider,
        DataQueryOperation.UserUnlinkFromProvider
    ];

    static _tryGetDataFields = [
        'updateObject',
        'data'
    ];

    _getInitialDataQuery(operation, meta) {
        return new DataQuery({meta, operation});
    }

    _isOperationAllowed(operations, operation) {
        return contains(operations, operation);
    }

    _buildQuery(filterOrQuery) {
        if (!filterOrQuery) {
            return null;
        }

        if (filterOrQuery instanceof Query) {
            return filterOrQuery;
        } else {
            return new Query(filterOrQuery);
        }
    }

    _tryBuildQuery(op, data) {
        const operations = DataQueryBuilder._tryBuildQueryAllowedOperations;
        if (!this._isOperationAllowed(operations, op)) {
            return null;
        }

        const query = has(data, 'query') ? data.query : data;
        return this._buildQuery(query);
    }

    _tryGetData(op, data) {
        const operations = DataQueryBuilder._tryGetDataAllowedOperations;
        if (!this._isOperationAllowed(operations, op)) {
            return null;
        }

        //TODO: this will not quite work if the user wants to create an item with a "data" field for example.
        const fields = DataQueryBuilder._tryGetDataFields;
        const field = find(fields, field => has(data, field));
        if (field) {
            return data[field];
        }

        return data;
    }

    _isAuthenticationOperation(op) {
        return op === DataQueryOperation.UserLogin ||
            op === DataQueryOperation.UserLogout ||
            op === DataQueryOperation.UserLoginWithProvider ||
            op === DataQueryOperation.UserLinkWithProvider ||
            op === DataQueryOperation.UserUnlinkFromProvider;
    }

    _isCloudCodeOperation(op) {
        return op === DataQueryOperation.InvokeCloudFunction ||
                op === DataQueryOperation.InvokeStoredProcedure;
    }

    _applyOperationSpecificProperties(op, query) {
        if (op === DataQueryOperation.UserLoginWithProvider) {
            query.authHeaders = false;
        } else if (this._isCloudCodeOperation(op)) {
            const {customParameters, authHeaders} = query.additionalOptions;
            query.authHeaders = authHeaders;
            if (customParameters) {
                query.headers = extend(query.headers, {
                    [Headers.customParameters]: JSON.stringify(customParameters)
                });
            }
        }

        if (this._isAuthenticationOperation(op)) {
            query.skipAuth = true;
        }

        return query;
    }

    buildDataQuery(data, op: DataQueryOperation, meta): CommonDataQuery {
        const dataQuery = super.buildDataQuery(data, op, meta);

        if (dataQuery.query) {
            return dataQuery;
        }

        //null causes invalid request body
        dataQuery.query = this._tryBuildQuery(op, data) || undefined;
        dataQuery.data = this._tryGetData(op, data) || undefined;
        this._applyOperationSpecificProperties(op, dataQuery);

        return dataQuery;
    }
}