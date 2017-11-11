import {QueryProcessorIterator} from './QueryProcessorIterator';
import {Errors} from '../errors';
import {Utils} from '../utils';
import {Sdk} from '../Sdk';

export class DataQueryProcessor {
    preProcessors: any[];
    processors: any[];
    postProcessors: any[];
    errorProcessors: any[]; //TODO: types

    constructor(
        public sdk: Sdk
    ) {
        this.preProcessors = [];
        this.processors = [];
        this.postProcessors = [];
        this.errorProcessors = [];
    }

    _iterate(query, processors, data, value?) {
        return new Promise((resolve, reject) => {
            const iterator = new QueryProcessorIterator(processors, query);

            let iteratorTimeout = null;
            const onNext = (processor, value) => {
                clearTimeout(iteratorTimeout);
                iteratorTimeout = setTimeout(() => {
                    return iterator.error(new Error(`Iterator timed out. Processor: ${processor.constructor.name}. Value - ${JSON.stringify(value)}`));
                }, 10 * 6000); //throw error if somewhere the chain hangs for more than 10 seconds

                try {
                    return processor.processDataQuery(query, iterator, data, value);
                } catch (e) {
                    return iterator.error(e);
                }
            };

            const cleanUp = () => {
                iterator.removeListener('next', onNext);
                clearTimeout(iteratorTimeout);
            };

            iterator
                .on('next', onNext)
                .once('end', value => {
                    cleanUp();
                    return resolve(value);
                })
                .once('error', err => {
                    cleanUp();
                    const processedError = this._processError(query, data, err);
                    const error = processedError || err;
                    return reject(error);
                })
                .once('cancel', reason => {
                    cleanUp();
                    return reject({
                        reason,
                        error: Errors.cancelled
                    });
                })
                .start(value);
        });
    }

    _preProcess(query, data) {
        return this._iterate(query, this.preProcessors, data);
    }

    _process(query, data, value) {
        return this._iterate(query, this.processors, data, value);
    }

    _postProcess(query, data, value) {
        return this._iterate(query, this.postProcessors, data, value);
    }

    _processError(query, data, err) {
        let error = err;
        this.errorProcessors.forEach(p => {
            error = p.processError(query, data, error);
        });

        return error;
    }

    process<T>(query, data, success, error): Promise<T> {
        return Utils.buildPromise<T>((resolve, reject) => {
            return this._preProcess(query, data)
                .then(value => {
                    return this._process(query, data, value);
                })
                .then(value => {
                    return this._postProcess(query, data, value);
                })
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        }, success, error);
    }
}