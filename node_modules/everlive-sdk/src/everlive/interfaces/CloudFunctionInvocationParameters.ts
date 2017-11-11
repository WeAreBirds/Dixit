export interface CloudFunctionInvocationParameters {
    method?: string;
    queryStringParams?: any;
    data?: any;
    authHeaders?: boolean;
    headers?: any;
    customParameters?: any;
}
