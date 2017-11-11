export interface UserLoginResult {
    result: {
        access_token: string;
        principal_id: string;
        token_type: string;
    };
}
