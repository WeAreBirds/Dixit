import { BasePersister } from './BasePersister';
export declare class SQLitePersister extends BasePersister {
    private sqliteStore;
    private contentTypes;
    private jsonSql;
    /**
     * @class SQLitePersister
     * @extends BasePersister
     */
    constructor(key: string, options: any);
    getData(contentType: any, success: any, error: any): void;
    count(contentType: any, success: any, error: any, filter?: any): void;
    queryData(contentType: any, success: any, error: any, filter?: any, sort?: any, skip?: any, limit?: any, select?: any): void;
    removeData(contentType: any, success: any, error: any, filter?: any): void;
    updateData(contentType: any, updateObj: any, success: any, error: any, filter?: any): void;
    saveData(contentType: any, data: any, success: any, error: any): void;
    purgeById(contentType: any, itemId: any, success: any, error: any): void;
    purge(contentType: any, success: any, error: any): void;
    purgeAll(success: any, error: any): Promise<void>;
    private extendTypeSchemes(types);
    private prepareCount(tableName, filter?);
    private prepareUpdate(tableName, updateObj, filter?);
    private prepareFilter(filter);
    private traverseAndTransformRegexFilter(filterObj);
    private traverseAndRemoveUndefined(filterObj);
    private prepareQuery(tableName, type, filter?, sort?, skip?, limit?, select?);
    _getContentTypes(success: any, error: any): void;
}
