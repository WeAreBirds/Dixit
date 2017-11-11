import { FieldDefinition } from '../offline/persisters/sqlite/FieldDefinition';
import { BaseSQLiteStore } from './SQLiteStore';
export declare class NativeScriptSQLiteStore extends BaseSQLiteStore {
    constructor(storagePath: string, typeSettings: any);
    queryData(tableName: any, query: any, success: any, error: any): void;
    addData(tableName: any, data: any, success: any, error: any): any;
    removeData(tableName: any, query: any, success: any, error: any): void;
    updateData(tableName: any, query: any, success: any, error: any): void;
    ensureTableExists(tableName: any, columns: FieldDefinition[]): void;
}
