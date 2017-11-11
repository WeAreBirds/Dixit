declare module "events" {
    export class EventEmitter {
        static EventEmitter: EventEmitter;
        static listenerCount(emitter: EventEmitter, event: string): number; // deprecated
        static defaultMaxListeners: number;

        addListener(event: string, listener: Function): this;
        on(event: string, listener: Function): this;
        once(event: string, listener: Function): this;
        prependListener(event: string, listener: Function): this;
        prependOnceListener(event: string, listener: Function): this;
        removeListener(event: string, listener: Function): this;
        removeAllListeners(event?: string): this;
        setMaxListeners(n: number): this;
        getMaxListeners(): number;
        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
        eventNames(): string[];
        listenerCount(type: string): number;
    }
}