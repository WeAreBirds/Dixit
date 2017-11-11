import { DataQueryBuilder as CommonDataQueryBuilder } from '../../common/dataQuery/DataQueryBuilder';
import { DataQueryOperation } from '../../common/Constants';
import { DataQuery as CommonDataQuery } from '../../common/dataQuery/DataQuery';
import { DataQuery } from '../dataQuery/DataQuery';
import { Query } from '../query/Query';
export declare class DataQueryBuilder extends CommonDataQueryBuilder {
    static _tryBuildQueryAllowedOperations: DataQueryOperation[];
    static _tryGetDataAllowedOperations: DataQueryOperation[];
    static _tryGetDataFields: string[];
    _getInitialDataQuery(operation: any, meta: any): DataQuery;
    _isOperationAllowed(operations: any, operation: any): boolean;
    _buildQuery(filterOrQuery: any): Query;
    _tryBuildQuery(op: any, data: any): Query;
    _tryGetData(op: any, data: any): any;
    _isAuthenticationOperation(op: any): boolean;
    _isCloudCodeOperation(op: any): boolean;
    _applyOperationSpecificProperties(op: any, query: any): any;
    buildDataQuery(data: any, op: DataQueryOperation, meta: any): CommonDataQuery;
}
