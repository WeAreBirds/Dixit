import { Setup } from './Setup';
import { RequestOptions } from './interfaces/RequestOptions';
export declare class Request {
    setup: Setup;
    options: RequestOptions;
    static reviver: (key: any, value: any) => any;
    static parsers: {
        simple: {
            result: any;
            error: any;
        };
        single: {
            result: any;
            error: any;
        };
        update: {
            result: any;
            error: any;
        };
        customRequest: {
            result: <T>(value: T) => T;
            error: (xhrRequest: any) => any;
        };
    };
    static sendRequest(request: any): Promise<{}>;
    method: string;
    endpoint: string;
    data: any;
    queryStringParams: any;
    private _headers;
    constructor(setup: Setup, options: RequestOptions);
    headers: any;
    static buildAuthHeader(setup: any, options?: any): {
        authorization: string;
    };
    send(): Promise<{}>;
    buildUrl(): string;
    static buildQueryHeaders(query: any): {};
    _init(options: any): void;
    private static _buildQueryHeaders(query);
    private static _buildFilterHeader(filter);
    encodeHeaders(): void;
}
