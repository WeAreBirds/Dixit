import { EventEmitter } from 'events';
export declare class EventEmitterExtended extends EventEmitter {
    _events: any[];
    emit(eventName: string, ...args: any[]): boolean;
    addListener(eventName: string, listener: Function): this;
    prependOnceListener(eventName: string, listener: Function): this;
    once(eventName: string, listener: Function): this;
    on(eventName: string, listener: Function): this;
    off(eventName: string, listener: Function): this;
}
