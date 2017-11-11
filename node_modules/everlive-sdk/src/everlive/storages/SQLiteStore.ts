import * as _ from 'underscore';
import { Constants } from "../constants";
import { EverliveError } from "../EverliveError";
import { FieldDefinition } from '../offline/persisters/sqlite/FieldDefinition';
import { SQLiteStore } from '../interfaces/SQLiteStore';
import { SuccessCallback } from '../interfaces/SuccessCallback';
import { ErrorCallback } from '../interfaces/ErrorCallback';

export class BaseSQLiteStore implements SQLiteStore {
    sqliteDb;
    private batchSize: number = 5000;
    private specialFields: any; // those fields are not supported by SQLite and should be stringified/parsed

    constructor(
        protected storagePath: string,
        private typeSettings: any
    ) {
        this.specialFields = {};
    }

    queryData(tableName: string, query, success: SuccessCallback<any>, error: ErrorCallback) {
        throw new EverliveError({message: 'The method queryData is not implemented'});
    }

    addData(tableName: string, data, success: SuccessCallback<any>, error: ErrorCallback) {
        throw new EverliveError({message: 'The method addData is not implemented'});
    }

    removeData(tableName: string, query, success: SuccessCallback<any>, error: ErrorCallback) {
        throw new EverliveError({message: 'The method removeData is not implemented'});
    }

    updateData(tableName: string, query, success: SuccessCallback<any>, error: ErrorCallback) {
        throw new EverliveError({message: 'The method updateData is not implemented'});
    }

    ensureTableExists(tableName, columns: FieldDefinition[]) {
        throw new EverliveError({message: 'The method ensureTableExists is not implemented'});
    }

    buildSqlBatchInsert(tableName: string, data) {
        if (!_.isArray(data)) {
            data = [data];
        }
        if(data.length === 0){
            return [];
        }
        const columns: FieldDefinition[] = this.typeSettings[tableName];
        const fields = _.map(columns, c => c.name);
        const query = this.buildInsertStatement(tableName, fields);
        let batchCounter = 1;
        let currentBatchIndex = 0;
        let insertQueries = [];
        insertQueries[currentBatchIndex] = [];
        _.each(data, (item) => {
            let columnValues = _.map(fields, (key) => {
                if (item[key] instanceof Date) {
                    return item[key].toISOString();
                } else if (this.specialFields[tableName][key] && item[key]) {
                    return JSON.stringify(item[key]);
                } else {
                    return item[key];
                }
            });
            columnValues.push(item[Constants.offlineItemsStateMarker]);
            insertQueries[currentBatchIndex].push([query, columnValues]);
            batchCounter++;
            if (batchCounter % this.batchSize == 0) {
                currentBatchIndex++;
                insertQueries[currentBatchIndex] = [];
            }
        });
        // sample item from the insert queries looks like this:
        // insertQueries[batchNumber] = [
        //     [ 'INSERT INTO TableName VALUES (?,?)' , [ value1, value2] ];
        //     [ 'INSERT INTO TableName VALUES (?,?)' , [ value1, value2] ];
        // ]
        return insertQueries;
    }

    buildInsertStatement(tableName, itemKeys) {
        let columnsDefinition = '';
        let valuesDefinition = '';
        _.each(itemKeys, (column: string) => {
            columnsDefinition += `"${column}",`;
            valuesDefinition += '?,';
        });
        columnsDefinition += Constants.offlineItemsStateMarker;
        valuesDefinition += '?';
        const insertStatement = `INSERT OR REPLACE INTO "${tableName}" ( ${columnsDefinition} ) VALUES ( ${valuesDefinition} ) `;
        return insertStatement;
    }

    prepareTables() {
        _.each(this.typeSettings, (definition: FieldDefinition[], type: string) => {
            this.ensureTableExists(type, definition);
            this.findSpecialFields(type, definition);
        });
    }

    protected processResultItem(type: string, item: any) {
        _.each(this.specialFields[type], (isSpecial: boolean, fieldKey: string) => {
            if (item[fieldKey]) {
                try {
                    if (item[fieldKey] === 'true' || item[fieldKey] === 'false') {  // parse boolean fields
                        item[fieldKey] = item[fieldKey] === 'true';
                    } else {
                        item[fieldKey] = JSON.parse(item[fieldKey]);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        });
        return item;
    }

    private findSpecialFields(type: string, scheme: FieldDefinition[]) {
        this.specialFields[type] = {};
        _.each(scheme, (field: FieldDefinition) => {
            if (field.isSpecialType) {
                this.specialFields[type][field.name] = true;
            }
        });
    }
}