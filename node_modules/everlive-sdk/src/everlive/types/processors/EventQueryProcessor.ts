import * as _ from 'underscore';

import { DataQueryOperation, Constants } from '../../constants';
import { EventQuery } from '../../query/EventQuery';

const beforeExecuteAllowedOperations = [
    DataQueryOperation.Count,
    DataQueryOperation.Read,
    DataQueryOperation.Create,
    DataQueryOperation.Update,
    DataQueryOperation.UpdateById,
    DataQueryOperation.Delete,
    DataQueryOperation.DeleteById,
    DataQueryOperation.ReadById,
    DataQueryOperation.Aggregate,
    DataQueryOperation.RawUpdate
];

export default class EventQueryProcessor {
    processDataQuery(query, iterator, data, value) {
        if (_.contains(beforeExecuteAllowedOperations, query.operation)) {
            var eventQuery = EventQuery.fromDataQuery(query);
            data.sdk.emit(Constants.Events.BeforeExecute, eventQuery);
            if (eventQuery.isCancelled()) {
                return iterator.cancel();
            }

            query.applyEventQuery(eventQuery);
        }

        return iterator.next(value);
    }
}