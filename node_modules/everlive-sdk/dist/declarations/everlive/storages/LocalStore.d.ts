export declare class LocalStore {
    options: any;
    private _localStorage;
    constructor(options: any);
    getItem(key: any): string;
    removeItem(key: any): void;
    setItem(key: any, value: any): void;
}
