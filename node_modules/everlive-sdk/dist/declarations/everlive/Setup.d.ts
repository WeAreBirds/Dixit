import { CommonSetup } from '../common/CommonSetup';
import { AuthenticationSetup } from './auth/AuthenticationSetup';
export declare class Setup extends CommonSetup {
    _emulatorMode: boolean;
    url: string;
    appId: string;
    apiKey: string;
    masterKey: string;
    token: string;
    tokenType: string;
    principalId: string;
    scheme: string;
    parseOnlyCompleteDateTimeObjects: boolean;
    authentication: AuthenticationSetup;
    caching: any;
    constructor(options: string | any);
    setAuthorizationProperties(token: any, tokenType: any, principalId: any): void;
    getAuthorizationProperties(): {
        token: string;
        tokenType: string;
        principalId: string;
    };
}
