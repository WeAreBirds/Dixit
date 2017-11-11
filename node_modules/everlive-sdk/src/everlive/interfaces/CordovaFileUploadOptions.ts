export interface CordovaFileUploadOptions {
    fileKey: string;
    fileName: string;
    httpMethod: 'PUT' | 'POST';
    mimeType: string;
    params: any;
    chunckedMode: boolean;
    headers: any;
}