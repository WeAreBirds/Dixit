import { Item } from './Item';

export interface User extends Item {
    Id: string;
    Username: string;
    IdentityProvider: string;
    IsVerified: boolean;
    Email?: string;
    DisplayName?: string;
}