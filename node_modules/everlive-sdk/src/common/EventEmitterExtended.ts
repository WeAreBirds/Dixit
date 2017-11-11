import { EventEmitter } from 'events';
import { last, without } from 'underscore';

class EventArgs {
    canceled = false;

    cancel() {
        this.canceled = true;
    }
}

/*
Adds extended functionality to the event emitter:
    * Cancelable event arguments - the event arguments are always passed as last argument,
      calling cancel will stop other event listeners in the chain from being invoked
    * prependOnceListener - Prepend a listener to the start of the chain - useful if you want
      it to be able to cancel the event
 */
export class EventEmitterExtended extends EventEmitter {
    _events: any[];

    emit(eventName: string, ...args: any[]): boolean {
        args.push(new EventArgs());

        return super.emit(eventName, ...args);
    }

    addListener(eventName: string, listener: Function): this {
        const wrappedListener = (...args) => {
            const ev = last(args);
            if (ev.canceled) {
                return;
            }

            return listener.apply(this, args);
        };

        super.addListener(eventName, wrappedListener);
        return this;
    }

    prependOnceListener(eventName: string, listener: Function): this {
        this.once(eventName, listener);

        if (!Array.isArray(this._events[eventName])) {
            return this;
        }

        const lastListener = last(this._events[eventName]);
        const allListeners = without(this._events[eventName], lastListener);
        this._events[eventName] = [lastListener].concat(allListeners);
        return this;
    }

    once(eventName: string, listener: Function): this {
        super.once(eventName, listener);
        return this;
    }

    on(eventName: string, listener: Function): this {
        this.addListener(eventName, listener);
        return this;
    }

    off(eventName: string, listener: Function): this {
        this.removeListener(eventName, listener);
        return this;
    }
}
