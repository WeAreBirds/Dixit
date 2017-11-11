import { EventEmitter } from 'events';
import { Query } from '../query/Query';
import { DataQueryOperation } from '../Constants';

export interface DataQueryConfig {
    meta:any,
    operation:DataQueryOperation,

    data?:any,
    query?:Query,
    originalParameters?:any,
    additionalOptions?:any
}

export class DataQuery extends EventEmitter {
    data:any;
    query:Query;
    originalParameters:any;
    operation:DataQueryOperation;
    additionalOptions:any;

    constructor(public config:DataQueryConfig) {
        super();

        this.data = config.data;
        this.query = config.query;
        this.originalParameters = config.originalParameters;
        this.operation = config.operation;
        this.additionalOptions = config.additionalOptions;
    }
}