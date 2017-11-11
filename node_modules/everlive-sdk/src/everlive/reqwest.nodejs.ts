let url = null;
let zlib = null;
let https = null;

try {
    url = require('url');
    zlib = require('zlib');
    https = require('https');
} catch (e) { throw e; } // because of webpack external dependency declaration - this marks it as optional

const http = require('http');

import { Constants } from './constants';
import { ReqwestOptions } from "./reqwest.everlive";
import { EverliveError } from './EverliveError';

function reqwest(options: ReqwestOptions) {
    const urlParts = url.parse(options.url);
    let request;
    if (urlParts.protocol === 'https:') {
        request = https.request;
    }
    else {
        request = http.request;
    }
    const headers = options.headers || {};

    headers[Constants.Headers.ContentType] = options.contentType;

    return new Promise(function (resolve, reject) {
        const req = request({
            method: options.method,
            hostname: urlParts.hostname,
            port: urlParts.port,
            path: urlParts.path,
            headers: headers
        }, function (res) {
            let json = '';
            const contentEncoding = res.headers['content-encoding'];
            let responseProxy;
            switch (contentEncoding){
                case 'gzip':
                    responseProxy = zlib.createGunzip();
                    res.pipe(responseProxy);
                    break;
                default:
                    responseProxy = res;
                    responseProxy.setEncoding('utf8');
                    break;
            }

            responseProxy.on('data', function (data) {
                json += data.toString();
            });

            responseProxy.on('end', function () {
                // 1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, 5xx Server Error
                if (200 <= res.statusCode && res.statusCode < 400) {
                    const result = JSON.parse(json);
                    resolve(result);
                } else {
                    if (json) {
                        reject(json);
                    }
                    else { // empty response
                        var error: any = new EverliveError({message: 'Response error.'});
                        error.statusCode = res.statusCode;
                        reject(error);
                    }
                }
            });
        });

        req.on('error', function (e) {
            reject({ responseText: e });
        });

        if (options.data) {
            var contentEncoding = headers['content-encoding'];
            switch (contentEncoding){
                case 'gzip':
                    var buf = new Buffer(options.data, 'utf-8');
                    zlib.gzip(buf, function (err, result) {
                        req.end(result);
                    });
                    break;
                default:
                    req.end(options.data);
                    break;
            }
        }
        else {
            req.end();
        }
    });
}

export = reqwest;
