import { ProcessableObject } from './ProcessableObject';
import { Sdk } from './Sdk';

export default class CommonData extends ProcessableObject {
    constructor(
        sdk: Sdk,
        public collectionName: string,
        public settings?: any
    ) {
        super(sdk, collectionName);
    }
}
