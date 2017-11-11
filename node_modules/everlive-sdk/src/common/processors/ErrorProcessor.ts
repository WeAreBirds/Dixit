import {Utils} from '../utils';

export default class ErrorProcessor {
    processError(query, data, err) {
        const setup = data.sdk.setup;

        var parseOnlyCompleteDateTimeString = setup && setup.parseOnlyCompleteDateTimeObjects;
        var reviver = Utils.parseUtilities.getReviver(parseOnlyCompleteDateTimeString);

        return Utils.parseUtilities.parseXhrError(reviver, err);
    }
}