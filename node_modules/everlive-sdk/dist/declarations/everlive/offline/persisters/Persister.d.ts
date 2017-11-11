export interface Persister {
    getAllData(success: any, error: any): any;
    getData(contentType: any, success: any, error: any): any;
    count(contentType: any, success: any, error: any, filter?: any): any;
    queryData(contentType: any, success: any, error: any, filter?: any, sort?: any, skip?: any, limit?: any, select?: any): any;
    saveData(contentType: any, data: any, success: any, error: any): any;
    removeData(contentType: any, success: any, error: any, filter?: any): any;
    updateData(contentType: any, updateObj: any, success: any, error: any, filter?: any): any;
    purge(contentType: any, success: any, error: any): any;
    purgeAll(success: any, error: any): any;
    purgeById(contentType: any, itemId: any, success: any, error: any): any;
}
