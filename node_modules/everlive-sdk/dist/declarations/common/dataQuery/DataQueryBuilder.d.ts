import { DataQuery } from './DataQuery';
import { DataQueryOperation } from '../Constants';
export declare class DataQueryBuilder {
    _getInitialDataQuery(operation: DataQueryOperation, meta: any): DataQuery;
    buildDataQuery(data: any, op: DataQueryOperation, meta: any): DataQuery;
}
