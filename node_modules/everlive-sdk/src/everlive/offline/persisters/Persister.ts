export interface Persister {
    getAllData(success, error);
    getData(contentType, success, error);
    count(contentType, success, error, filter?);
    queryData(contentType, success, error, filter?, sort?, skip?, limit?, select?);
    saveData(contentType, data, success, error);
    removeData(contentType, success, error, filter?)
    updateData(contentType, updateObj, success, error, filter?)
    purge(contentType, success, error);
    purgeAll(success, error);
    purgeById(contentType, itemId, success, error);
}