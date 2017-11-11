export interface SQLiteStore {
    queryData(tableName: string, query: any, success: any, error: any): any;
    addData(tableName: string, data: any, success: any, error: any): any;
    removeData(tableName: string, query: any, success: any, error: any): any;
    updateData(tableName: string, query: any, success: any, error: any): any;
}
