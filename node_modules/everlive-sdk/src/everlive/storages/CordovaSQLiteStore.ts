declare const window, document;
import * as _ from 'underscore';
import { FieldDefinition } from '../offline/persisters/sqlite/FieldDefinition';
import { BaseSQLiteStore } from './SQLiteStore';

const deviceReadyPromise = function () {
    return new Promise(function (resolve) {
        document.addEventListener('deviceready', resolve);
    });
};

export class CordovaSQLiteStore extends BaseSQLiteStore {

    constructor(storagePath: string, typeSettings: any) {
        super(storagePath, typeSettings);
        deviceReadyPromise().then(() => {
            this.sqliteDb = window.sqlitePlugin.openDatabase({
                name: `${this.storagePath}.db`,
                location: 'default'
            });
            this.prepareTables();
        });
    }

    queryData(tableName: string, query, success, error) {
        this.sqliteDb.transaction((tx) => {
            tx.executeSql(query, [], (tx, res) => {
                    let resultSet = [];
                    for (let x = 0; x < res.rows.length; x++) {
                        resultSet.push(this.processResultItem(tableName, res.rows.item(x)));
                    }
                    success(resultSet);
                },
                function (tx, e) {
                    error(e);
                });
        });
    }

    addData(tableName: string, data, success, error) {
        const batchInsertQueries = this.buildSqlBatchInsert(tableName, data);
        const insertPromises = _.map(batchInsertQueries, (currentBatchList) => {
            return new Promise((resolve, reject) => {
                this.sqliteDb.sqlBatch(currentBatchList, () => {
                    resolve();
                }, function (e) {
                    reject(e);
                });
            })
        });
        return Promise.all(insertPromises).then(success, error);
    }

    removeData(tableName: string, query, success, error) {
        this.sqliteDb.transaction((tx) => {
            tx.executeSql(query, [], (tx, res) => {
                    success(res['rowsAffected']);
                },
                function (tx, e) {
                    error(e);
                });
        });
    }

    updateData(tableName: string, query, success, error) {
        this.sqliteDb.transaction((tx) => {
            tx.executeSql(query, [], (tx, res) => {
                    success(res['rowsAffected']);
                },
                function (tx, e) {
                    error(e);
                });
        });
    }

    ensureTableExists(tableName: string, columns: FieldDefinition[]) {
        const createTableStatement = `CREATE TABLE IF NOT EXISTS "${tableName}" (_id TEXT PRIMARY KEY)`; // creating empty tables are not supported
        this.sqliteDb.transaction((tx) => {
            tx.executeSql(createTableStatement, [], (tx, res) => {
                _.each(columns, (column:FieldDefinition) => {
                    const addColumn = `ALTER TABLE "${tableName}" ADD COLUMN ${column.getDefinition()}`;
                    this.sqliteDb.executeSql(addColumn); // errors for duplicated columns are omited here in order to ensure the scheme is always latest
                })
            }, function (tx, e) {
                console.log(e);
                throw e;
            });
        });
    }
}