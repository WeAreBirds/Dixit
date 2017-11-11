import * as _ from 'underscore';
import * as platform from '../../../common/platform';

import { CordovaSQLiteStore } from '../../storages/CordovaSQLiteStore';
import { NativeScriptSQLiteStore } from '../../storages/NativeScriptSQLiteStore';
import { SQLiteStore } from '../../interfaces/SQLiteStore';
import { BasePersister } from './BasePersister';
import { getDefinition } from './sqlite/SystemDefinitions';
import { EverliveError } from '../../EverliveError';
import { Utils } from "../../utils";


function getSQLiteStore(storagePath: string, typeSettings: any): SQLiteStore {
    if (platform.isNativeScript) {
        return new NativeScriptSQLiteStore(storagePath, typeSettings);
    } else if (platform.isCordova) {
        return new CordovaSQLiteStore(storagePath, typeSettings);
    } else {
        throw new EverliveError({message: 'Unsupported platform for SQLite'});
    }
}

export class SQLitePersister extends BasePersister {
    private sqliteStore: SQLiteStore;
    private contentTypes: string[];
    private jsonSql: any;

    /**
     * @class SQLitePersister
     * @extends BasePersister
     */
    constructor(key: string, options: any) {
        super(key, options);
        const jsonSqlOptions = {
            dialect: 'sqlite',
            separatedValues: false
        };
        this.jsonSql = require('json-sql')(jsonSqlOptions);

        this.contentTypes = _.keys(options.typeSettings);
        const extendedSettings = this.extendTypeSchemes(options.typeSettings);
        const storagePath = `${options.storage.storagePath}_${options.appId}`;
        this.sqliteStore = getSQLiteStore(options.storage.storagePath, extendedSettings);
    }

    getData(contentType, success, error) {
        return this.queryData(contentType, success, error);
    }

    count(contentType, success, error, filter?) {
        try {
            const sqlQuery = this.prepareCount(contentType, filter);
            this.sqliteStore.queryData(contentType, sqlQuery.query, function (resultSet) {
                const resultCount = resultSet && resultSet[0] && resultSet[0].Count ? resultSet[0].Count : 0;
                success({Count: resultCount })
            }, error);
        } catch (e) {
            error(e);
        }
    }

    queryData(contentType, success, error, filter?, sort?, skip?, limit?, select?) {
        try {
            const sqlQuery = this.prepareQuery(contentType, 'select', filter, sort, skip, limit, select);
            this.sqliteStore.queryData(contentType, sqlQuery.query, success, error);
        } catch (e) {
            error(e);
        }
    }

    removeData(contentType, success, error, filter?) {
        try {
            const sqlQuery = this.prepareQuery(contentType, 'remove', filter);
            this.sqliteStore.removeData(contentType, sqlQuery.query, success, error);
        } catch (e) {
            error(e);
        }
    }

    updateData(contentType, updateObj, success, error, filter?) {
        try {
            const sqlQuery = this.prepareUpdate(contentType, updateObj, filter);
            this.sqliteStore.updateData(contentType, sqlQuery.query, success, error);
        } catch (e) {
            error(e);
        }
    }

    saveData(contentType, data, success, error) {
        try {
            this.sqliteStore.addData(contentType, data, success, error);
        } catch (e) {
            error(e);
        }
    }

    purgeById(contentType, itemId, success, error) {
        const sqlQuery = this.prepareQuery(contentType, 'remove', {_id: itemId});
        this.sqliteStore.removeData(contentType, sqlQuery.query, function () {
            // omit the number of deleted items
            success();
        }, error);
    }

    purge(contentType, success, error) {
        const sqlQuery = this.prepareQuery(contentType, 'remove');
        this.sqliteStore.removeData(contentType, sqlQuery.query, function () {
            // omit the number of deleted items
            success();
        }, error);
    }

    purgeAll(success, error) {
        const purgeAllPromises = _.map(this.options.typeSettings, (definition, type:string) => {
            const sqlQuery = this.prepareQuery(type, 'remove');
            const purgePromise = new Promise((resolve, reject) => {
                this.sqliteStore.removeData(type, sqlQuery.query, resolve, reject);
            });
            return purgePromise;
        });

        return Promise.all(purgeAllPromises).then(() => {
            // omit the number of deleted items
            success();
        }, error);
    }

    private extendTypeSchemes(types) {
        let resultScheme = {};
        _.each(types, (definition, type:string) => {
            resultScheme[type] = getDefinition(type, definition['Scheme']);
        });
        if (!resultScheme['Files']) {
            resultScheme['Files'] = getDefinition('Files', []);
        }
        if (!resultScheme['Users']) {
            resultScheme['Users'] = getDefinition('Users', []);
        }
        return resultScheme;
    }

    private prepareCount(tableName, filter?) {
        const jsonQuery = {
            type: 'select',
            table: tableName
        };

        jsonQuery['count'] = {Count: 'COUNT(*)'};

        if (filter) {
            jsonQuery['condition'] = filter;
        }

        const sqlQuery = this.jsonSql.build(jsonQuery);
        return sqlQuery;
    }

    private prepareUpdate(tableName, updateObj, filter?) {
        const jsonQuery = {
            type: 'update',
            table: tableName
        };

        if (updateObj.$set) {
            // cannot update unsupported data types in sqlite.
            // Meta is always part of the updateObject, when passing the whole item for update
            delete updateObj.$set.Meta;
        }

        _.each(updateObj.$set, (value, key) => {
            if (value instanceof Date) {
                updateObj.$set[key] = value.toISOString();
            }
        });

        jsonQuery['modifier'] = updateObj;

        if (filter) {
            jsonQuery['condition'] = filter;
        }

        const sqlQuery = this.jsonSql.build(jsonQuery);
        return sqlQuery;
    }

    private prepareFilter(filter: any) {
        this.traverseAndRemoveUndefined(filter);
        this.traverseAndTransformRegexFilter(filter);
    }

    private traverseAndTransformRegexFilter(filterObj: any){
        if (filterObj && filterObj['$regex']) {
            const start = Utils.startsWith(filterObj['$regex'], '^') ? '' : '%';
            const end = Utils.endsWith(filterObj['$regex'], '$') ? '' : '%';
            const textValue = filterObj['$regex'].substring(1, filterObj['$regex'].length - 1);
            filterObj['$like'] = `${start}${textValue}${end}`;
            delete filterObj['$regex'];
            delete filterObj['$options']; // invariant search is part of the configuration of the SQLite database.
        }

        for (let prop in filterObj) {
            if (filterObj.hasOwnProperty(prop)) {
                let objectMember = filterObj[prop];
                if (typeof objectMember === 'object') {
                    this.traverseAndTransformRegexFilter(objectMember);
                }
            }
        }
    }

    // passing object as filter with undefined fields will make the query invalid
    // this usually happens when you are passing the item itself for filter
    private traverseAndRemoveUndefined(filterObj: any){
        for (let prop in filterObj) {
            if (filterObj.hasOwnProperty(prop)) {
                let member = filterObj[prop];
                if (typeof member === 'object') {
                    this.traverseAndRemoveUndefined(member );
                } else if(member === undefined){
                    delete filterObj[prop];
                }
            }
        }
    }

    private prepareQuery(tableName:string, type:string, filter?, sort?, skip?:number, limit?:number, select?) {
        const jsonQuery:any = {
            type: type,
            table: tableName
        };

        if (filter) {
            this.prepareFilter(filter);
            jsonQuery['condition'] = filter;
        }

        if (sort) {
            jsonQuery['sort'] = sort;
        }

        if (skip) {
            jsonQuery['offset'] = skip;
        }

        if (limit) {
            jsonQuery['limit'] = limit;
        }

        if (select) {
            jsonQuery['fields'] = _.keys(select);
        }

        const sqlQuery = this.jsonSql.build(jsonQuery);
        return sqlQuery;
    }

    _getContentTypes(success, error) {
        success(this.contentTypes);
    }
}