import { UserLoginResult } from './UserLoginResult';

export interface SocialLoginResult extends UserLoginResult {
    CreatedAt?: Date;
    Id?: string;
}
