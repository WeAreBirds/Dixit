export interface SQLiteStore {
    queryData(tableName: string, query, success, error)
    addData(tableName: string, data, success, error)
    removeData(tableName: string, query, success, error)
    updateData(tableName: string, query, success, error)
}
