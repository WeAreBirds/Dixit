import {DataQueryProcessor} from './dataQuery/Processor';
import ErrorProcessor from './processors/ErrorProcessor';
import {DataQueryBuilder} from './dataQuery/DataQueryBuilder';
import {DataQuery} from './dataQuery/DataQuery';
import {EventEmitterExtended} from './EventEmitterExtended';
import { Data } from '../everlive/types/Data';
import { CommonSetup } from './CommonSetup';
import { Item } from "../everlive/interfaces/Item";

const MethodMustBeOverridenError = new Error('Method must be overriden');
export class Sdk extends EventEmitterExtended {
    setup: CommonSetup;
    dataQueryProcessor: DataQueryProcessor;
    dataQueryBuilder: DataQueryBuilder;
    authentication: any;

    constructor(
        public options: any
    ) {
        super();
        this.setup = this._getSetup(options);

        this.dataQueryProcessor = this._getDataQueryProcessor();
        this.dataQueryBuilder = this._getDataQueryBuilder();

        this.authentication = this._getAuthentication();

        this.registerErrorProcessor(new ErrorProcessor());
    }

    registerDataQueryPreProcessor(processor) {
        this.dataQueryProcessor.preProcessors.push(processor);
    }

    registerDataQueryProcessor(processor) {
        this.dataQueryProcessor.processors.push(processor);
    }

    registerDataQueryPostProcessor(processor) {
        this.dataQueryProcessor.postProcessors.push(processor);
    }

    registerErrorProcessor(processor) {
        this.dataQueryProcessor.errorProcessors.push(processor);
    }

    processDataQuery<T>(query, data, success, error): Promise<T> {
        return this.dataQueryProcessor.process(query, data, success, error);
    }

    buildDataQuery(data = {}, op, meta): DataQuery {
        return this.dataQueryBuilder.buildDataQuery(data, op, meta);
    }

    data<T extends Item>(name: string): Data<T> {
        return this._getData<T>(name);
    }

    protected _getDataQueryProcessor(): DataQueryProcessor {
        return new DataQueryProcessor(this);
    }

    protected _getDataQueryBuilder(): DataQueryBuilder {
        return new DataQueryBuilder();
    }

    protected _getSetup(options): CommonSetup {
        throw MethodMustBeOverridenError;
    }

    protected _getData<T extends Item>(name: string): Data<T> {
        throw MethodMustBeOverridenError;
    }

    protected _getAuthentication() {
        throw MethodMustBeOverridenError;
    }
}
