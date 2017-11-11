import { FieldDefinition } from '../offline/persisters/sqlite/FieldDefinition';
import { BaseSQLiteStore } from './SQLiteStore';
export declare class CordovaSQLiteStore extends BaseSQLiteStore {
    constructor(storagePath: string, typeSettings: any);
    queryData(tableName: string, query: any, success: any, error: any): void;
    addData(tableName: string, data: any, success: any, error: any): Promise<{}>;
    removeData(tableName: string, query: any, success: any, error: any): void;
    updateData(tableName: string, query: any, success: any, error: any): void;
    ensureTableExists(tableName: string, columns: FieldDefinition[]): void;
}
