import * as platform from '../common/platform';

const isNativeScript = platform.isNativeScript;
const isNodejs = platform.isNodejs;

export interface ReqwestOptions {
    url: string,
    method: string,
    data: any,
    headers: any,
    contentType: string,
    crossOrigin: boolean
}

export let reqwest;

if (!isNodejs && !isNativeScript) {
    reqwest = require('reqwest');
} else if (isNativeScript) {
    reqwest = require('./reqwest.nativescript');
} else if (isNodejs) {
    reqwest = require('./reqwest.nodejs');
}
