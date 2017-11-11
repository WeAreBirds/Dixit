import { Request } from '../Request';
export declare const RequestService: {
    buildRequest(query: any, data: any): Request;
    setAdditionalHeaders(query: any, requestOptions: any): void;
    handleRequestProcessing(query: any, data: any, request?: any): Promise<{}>;
    sendRequest(request: any): Promise<{}>;
};
