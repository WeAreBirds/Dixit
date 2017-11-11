import { FieldDefinition } from '../offline/persisters/sqlite/FieldDefinition';
import { SQLiteStore } from '../interfaces/SQLiteStore';
import { SuccessCallback } from '../interfaces/SuccessCallback';
import { ErrorCallback } from '../interfaces/ErrorCallback';
export declare class BaseSQLiteStore implements SQLiteStore {
    protected storagePath: string;
    private typeSettings;
    sqliteDb: any;
    private batchSize;
    private specialFields;
    constructor(storagePath: string, typeSettings: any);
    queryData(tableName: string, query: any, success: SuccessCallback<any>, error: ErrorCallback): void;
    addData(tableName: string, data: any, success: SuccessCallback<any>, error: ErrorCallback): void;
    removeData(tableName: string, query: any, success: SuccessCallback<any>, error: ErrorCallback): void;
    updateData(tableName: string, query: any, success: SuccessCallback<any>, error: ErrorCallback): void;
    ensureTableExists(tableName: any, columns: FieldDefinition[]): void;
    buildSqlBatchInsert(tableName: string, data: any): any[];
    buildInsertStatement(tableName: any, itemKeys: any): string;
    prepareTables(): void;
    protected processResultItem(type: string, item: any): any;
    private findSpecialFields(type, scheme);
}
