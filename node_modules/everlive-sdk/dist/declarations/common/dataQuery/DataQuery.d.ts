import { EventEmitter } from 'events';
import { Query } from '../query/Query';
import { DataQueryOperation } from '../Constants';
export interface DataQueryConfig {
    meta: any;
    operation: DataQueryOperation;
    data?: any;
    query?: Query;
    originalParameters?: any;
    additionalOptions?: any;
}
export declare class DataQuery extends EventEmitter {
    config: DataQueryConfig;
    data: any;
    query: Query;
    originalParameters: any;
    operation: DataQueryOperation;
    additionalOptions: any;
    constructor(config: DataQueryConfig);
}
