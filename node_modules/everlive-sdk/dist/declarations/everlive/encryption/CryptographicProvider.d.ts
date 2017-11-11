export declare class CryptographicProvider {
    options: any;
    constructor(options?: any);
    _getKey(): string;
    _canEncryptDecrypt(content: string): boolean;
    encrypt(content: string): string;
    decrypt(content: string): string;
}
