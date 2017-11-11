import { DataQueryProcessor } from './dataQuery/Processor';
import { DataQueryBuilder } from './dataQuery/DataQueryBuilder';
import { DataQuery } from './dataQuery/DataQuery';
import { EventEmitterExtended } from './EventEmitterExtended';
import { Data } from '../everlive/types/Data';
import { CommonSetup } from './CommonSetup';
import { Item } from "../everlive/interfaces/Item";
export declare class Sdk extends EventEmitterExtended {
    options: any;
    setup: CommonSetup;
    dataQueryProcessor: DataQueryProcessor;
    dataQueryBuilder: DataQueryBuilder;
    authentication: any;
    constructor(options: any);
    registerDataQueryPreProcessor(processor: any): void;
    registerDataQueryProcessor(processor: any): void;
    registerDataQueryPostProcessor(processor: any): void;
    registerErrorProcessor(processor: any): void;
    processDataQuery<T>(query: any, data: any, success: any, error: any): Promise<T>;
    buildDataQuery(data: {}, op: any, meta: any): DataQuery;
    data<T extends Item>(name: string): Data<T>;
    protected _getDataQueryProcessor(): DataQueryProcessor;
    protected _getDataQueryBuilder(): DataQueryBuilder;
    protected _getSetup(options: any): CommonSetup;
    protected _getData<T extends Item>(name: string): Data<T>;
    protected _getAuthentication(): void;
}
