import { FieldDefinition } from '../offline/persisters/sqlite/FieldDefinition';
import { BaseSQLiteStore } from './SQLiteStore';
import * as _ from 'underscore';

export class NativeScriptSQLiteStore extends BaseSQLiteStore {

    constructor(storagePath:string, typeSettings:any) {
        super(storagePath, typeSettings);
        let Sqlite;
        try {
            Sqlite = require('nativescript-sqlite');
        } catch (err) {
            throw err;
        } // because of webpack external dependency declaration - this marks it as optional
        const db_promise = new Sqlite(`${this.storagePath}.db`, (err, db) => {
            if (err) {
                console.error("Failed to open database", err);
                throw err;
            } else {
                this.sqliteDb = db;
                this.sqliteDb.resultType(Sqlite.RESULTSASOBJECT);
                this.prepareTables();
            }
        });
    }

    queryData(tableName, query, success, error) {
        this.sqliteDb.all(query, [], (err, dbResult) => {
            if (err) {
                error(err);
            } else {
                var resultSet = [];
                for (var x = 0; x < dbResult.length; x++) {
                    resultSet.push(this.processResultItem(tableName, dbResult[x]));
                }
                success(resultSet);
            }
        });
    }

    addData(tableName, data, success, error) {
        const batchInsertQueries = this.buildSqlBatchInsert(tableName, data);
        if (batchInsertQueries.length === 0) {
            return success();
        }
        const insertPromises: Promise<undefined>[] = [];
        _.each<any>(batchInsertQueries, (query) => {
            _.each<any>(query, (insertQuery) => {
                insertPromises.push(new Promise((resolve, reject) => {
                    // nativescript sqlite driver need the INSERT statement and the values array as two separate parameters
                    // check sample reuslt from buildSqlBatchInsert
                    this.sqliteDb.execSQL(insertQuery[0], insertQuery[1], (err, dbResult) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }));
            });
        });
        return Promise.all(insertPromises).then(success, error);
    }

    removeData(tableName, query, success, error) {
        this.sqliteDb.execSQL(query, (err, dbResult) => {
            if (err) {
                error(err);
            } else {
                success(dbResult);
            }
        });
    }

    updateData(tableName, query, success, error) {
        this.sqliteDb.execSQL(query, (err, dbResult) => {
            if (err) {
                error(err);
            } else {
                success(dbResult);
            }
        });
    }

    ensureTableExists(tableName, columns:FieldDefinition[]) {
        const createTableStatement = `CREATE TABLE IF NOT EXISTS ${tableName} (_id TEXT PRIMARY KEY)`; // creating empty tables are not supported
        this.sqliteDb.execSQL(createTableStatement, [], () => {
            _.each(columns, (column:FieldDefinition) => {
                const addColumn = `ALTER TABLE ${tableName} ADD COLUMN ${column.getDefinition()}`;
                this.sqliteDb.execSQL(addColumn, (err, dbResult) => {
                    // errors for duplicated columns are omited here in order to ensure the scheme is always latest
                });
            })
        }, function (e) {
            console.log(e);
            throw e;
        });
    }

}