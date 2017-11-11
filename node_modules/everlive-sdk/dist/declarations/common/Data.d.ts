import { ProcessableObject } from './ProcessableObject';
import { Sdk } from './Sdk';
export default class CommonData extends ProcessableObject {
    collectionName: string;
    settings: any;
    constructor(sdk: Sdk, collectionName: string, settings?: any);
}
