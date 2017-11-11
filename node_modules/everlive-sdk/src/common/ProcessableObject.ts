import { Sdk } from "./Sdk";
import { DataQuery } from "./dataQuery/DataQuery";

export class ProcessableObject {
    constructor(
        public sdk: Sdk,
        public collectionName: string
    ) {}

    buildDataQuery(data, op, meta): DataQuery {
        return this.sdk.buildDataQuery(data, op, meta);
    }

    //TODO: these callbacks should be removed if I recall correctly, check after TS migration is ready
    processDataQuery<T>(query, success?, error?): Promise<T> {
        return this.sdk.processDataQuery<T>(query, this, success, error);
    }
}
