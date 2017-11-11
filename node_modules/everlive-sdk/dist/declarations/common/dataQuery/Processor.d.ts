import { Sdk } from '../Sdk';
export declare class DataQueryProcessor {
    sdk: Sdk;
    preProcessors: any[];
    processors: any[];
    postProcessors: any[];
    errorProcessors: any[];
    constructor(sdk: Sdk);
    _iterate(query: any, processors: any, data: any, value?: any): Promise<{}>;
    _preProcess(query: any, data: any): Promise<{}>;
    _process(query: any, data: any, value: any): Promise<{}>;
    _postProcess(query: any, data: any, value: any): Promise<{}>;
    _processError(query: any, data: any, err: any): any;
    process<T>(query: any, data: any, success: any, error: any): Promise<T>;
}
