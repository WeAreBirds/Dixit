import {CryptoJS} from 'node-cryptojs-aes';
const {AES} = CryptoJS;

export class CryptographicProvider {
    constructor(public options: any = {}) {
    }

    _getKey(): string {
        return <string>this.options.encryption.key;
    }

    _canEncryptDecrypt(content: string) {
        return this._getKey() && content !== null && content !== undefined;
    }

    encrypt(content: string): string {
        if (!this._canEncryptDecrypt(content)) {
            return content;
        }

        return AES.encrypt(content, this._getKey()).toString();
    }

    decrypt(content: string): string {
        if (!this._canEncryptDecrypt(content)) {
            return content;
        }

        return AES.decrypt(content, this._getKey()).toString(CryptoJS.enc.Utf8);
    }
}