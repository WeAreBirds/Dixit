import { Sdk } from "./Sdk";
import { DataQuery } from "./dataQuery/DataQuery";
export declare class ProcessableObject {
    sdk: Sdk;
    collectionName: string;
    constructor(sdk: Sdk, collectionName: string);
    buildDataQuery(data: any, op: any, meta: any): DataQuery;
    processDataQuery<T>(query: any, success?: any, error?: any): Promise<T>;
}
