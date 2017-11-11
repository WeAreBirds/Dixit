import { DataQuery as CommonDataQuery, DataQueryConfig as DataQueryConfigCommon } from '../../common/dataQuery/DataQuery';
import { DataQueryOperation } from "../../common/Constants";
import { Query } from '../query/Query';
export interface DataQueryConfig extends DataQueryConfigCommon {
    query?: Query;
    filter?: any;
    headers?: Object;
    useOffline?: boolean;
    applyOffline?: boolean;
    noRetry?: any;
    skipAuth?: boolean;
    isSync?: boolean;
    preserveState?: boolean;
    config?: any;
}
export declare class DataQuery extends CommonDataQuery {
    headers: any;
    useOffline: boolean;
    applyOffline: boolean;
    noRetry: any;
    skipAuth: boolean;
    _normalizedHeaders: any;
    isSync: boolean;
    collectionName: string;
    query: Query;
    fields: any;
    sort: any;
    skip: any;
    take: any;
    expand: any;
    config: DataQueryConfig;
    forceCache: boolean;
    ignoreCache: boolean;
    preserveState?: boolean;
    /** @deprecated */
    filter: any;
    static operations: typeof DataQueryOperation;
    constructor(config: DataQueryConfig);
    readonly canUseOffline: any;
    _normalizeHeaders(): void;
    getHeader(header: any): any;
    getHeaders(): any;
    getHeaderAsJSON(header: any): any;
    getQueryParameters(): any;
    applyEventQuery(eventQuery: any): void;
    _applyCustomHeaders(eventQuery: any): void;
    _applyEventQueryHeaders(eventQuery: any): void;
    _applyEventQueryParams(eventQuery: any): void;
    _applyEventQuerySettings(eventQuery: any): void;
    _applyEventHeader(header: any, value: any): void;
}
