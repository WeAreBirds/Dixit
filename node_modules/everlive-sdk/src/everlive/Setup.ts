import * as _ from 'underscore';

import { CommonSetup } from '../common/CommonSetup';
import { Constants } from './constants';
import { AuthenticationSetup } from './auth/AuthenticationSetup';

export class Setup extends CommonSetup {
    _emulatorMode: boolean = false;

    url: string = Constants.everliveUrl;
    appId: string = null;
    apiKey: string;
    masterKey: string = null;
    token: string = null;
    tokenType: string = null;
    principalId: string = null;
    scheme: string = 'http';
    parseOnlyCompleteDateTimeObjects: boolean = false;
    authentication: AuthenticationSetup;
    caching: any;

    constructor(options: string|any) {
        super();
        
        if (typeof options === 'string') {
            this.appId = options;
        } else {
            this._emulatorMode = options.emulatorMode;
            _.extend(this, options);
            if(options.apiKey) {
                this.appId = options.apiKey; // backward compatibility
            }
        }

        this.authentication = new AuthenticationSetup(this, options.authentication);
    }

    setAuthorizationProperties(token, tokenType, principalId) {
        this.token = token;
        this.tokenType = tokenType;
        this.principalId = principalId;
    }

    getAuthorizationProperties() {
        return {
            token: this.token,
            tokenType: this.tokenType,
            principalId: this.principalId
        };
    }
}