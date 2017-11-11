import {DataQueryOperation} from '../constants';
import {Request} from '../Request';

export class ResponseParserProcessor {
    processDataQuery(query, iterator, data, value) {
        if (query.operation === DataQueryOperation.InvokeCloudFunction ||
            query.operation === DataQueryOperation.InvokeStoredProcedure) {
            return iterator.next(value);
        }

        let parser = null;
        switch (query.operation) {
            case DataQueryOperation.ReadById:
            case DataQueryOperation.Aggregate:
            case DataQueryOperation.Count:
            case DataQueryOperation.Create:
            case DataQueryOperation.SetAcl:
            case DataQueryOperation.FilesGetDownloadUrlById:
            case DataQueryOperation.UserLinkWithProvider:
            case DataQueryOperation.UserUnlinkFromProvider:
                parser = Request.parsers.single;
                break;
            case DataQueryOperation.RawUpdate:
            case DataQueryOperation.Update:
                parser = Request.parsers.update;
                break;
            default:
                if (query.isCustomRequest) {
                    parser = Request.parsers.customRequest;
                } else {
                    parser = Request.parsers.simple;
                }
        }

        const parsedResponse = parser.result(value);

        return iterator.next(parsedResponse);
    }
}