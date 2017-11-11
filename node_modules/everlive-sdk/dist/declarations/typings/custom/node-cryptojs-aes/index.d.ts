declare module 'node-cryptojs-aes' {
    interface EncryptionResult {
        toString(encoding?: string): string;
    }

    interface AES {
        encrypt(content: string, key: string): EncryptionResult;
        decrypt(content: string, key: string): EncryptionResult;
    }

    interface Enc {
        Utf8: string;
    }

    interface CryptoJS {
        AES: AES;
        enc: Enc;

        MD5(data: string): EncryptionResult;
    }

    export const CryptoJS: CryptoJS;
}