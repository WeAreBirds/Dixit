import { ErrorCallback } from './ErrorCallback';
import { Query } from '../query/Query';

export interface RequestOptions {
    endpoint: string;
    method?: 'GET'|'POST'|'PUT'|'DELETE'|'PATCH';
    data?: any;
    success?: Function;
    error?: ErrorCallback
    headers?: any;
    filter?: Query|any;
    authHeaders?: boolean;
}