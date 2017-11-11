import { User } from './User';

export interface AuthInfoResult {
    status: 'unauthenticated' | 'masterKey' | 'invalidAuthentication' | 'authenticated' | 'expiredAuthentication' | 'authenticating';
    user?: User;
}
