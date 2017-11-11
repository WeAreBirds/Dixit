import { DataQuery } from "../dataQuery/DataQuery";
/**
 * @class EventQuery
 * @classdesc A query which is passed in the 'beforeExecute' event of [Everlive]{@link Everlive}. Allows changing the parameters of
 * a query before executing it.
 */
export declare class EventQuery {
    contentTypeName: any;
    operation: any;
    itemId: any;
    data: any;
    headers: any;
    powerfields: any;
    isSync: boolean;
    settings: any;
    filter: any;
    fields: any;
    sort: any;
    skip: any;
    take: any;
    expand: any;
    aggregate: any;
    private _cancelled;
    static fromDataQuery(dataQuery: DataQuery): EventQuery;
    /**
     * Cancels the query.
     * @memberOf EventQuery.prototype
     * @method cancel
     */
    cancel(): void;
    /**
     * Indicates whether the query has been canceled.
     * @memberOf EventQuery.prototype
     * @method isCanceled
     * @returns {boolean}
     */
    isCancelled(): boolean;
}
