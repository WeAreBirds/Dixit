import { EventEmitterExtended } from '../EventEmitterExtended';
import { Query } from '../query/Query';
import { DataQueryOperation } from '../Constants';
export declare class QueryProcessorIterator extends EventEmitterExtended {
    done: boolean;
    position: number;
    processors: any[];
    $id: number;
    $query: Query;
    $operation: DataQueryOperation;
    private _initialValue;
    constructor(processors: any, query: any);
    restart(value?: any): boolean;
    start(value: any): boolean;
    next(value: any): boolean;
    end(value: any): boolean;
    cancel(reason: any): boolean;
    error(error: any): boolean;
}
