import * as _ from 'underscore';
import {DataQuery} from './DataQuery';
import {Query} from '../query/Query';
import {DataQueryOperation} from '../Constants';

export class DataQueryBuilder {
    _getInitialDataQuery(operation: DataQueryOperation, meta: any): DataQuery {
        return new DataQuery({meta, operation});
    }

    buildDataQuery(data: any, op: DataQueryOperation, meta: any): DataQuery {
        const dataQuery = this._getInitialDataQuery(op, meta);

        if (data instanceof Query) {
            dataQuery.query = <Query>data;
        }

        if (data) {
            dataQuery.additionalOptions = data.additionalOptions;
        }

        return _.extend(dataQuery, meta);
    }
}