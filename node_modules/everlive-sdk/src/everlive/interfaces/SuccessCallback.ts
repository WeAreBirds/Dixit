export interface SuccessCallback<T> extends Function {
    (res: T): void;
}