'use strict';

import * as _ from 'underscore';

import { CacheModule } from './CacheModule';
import { Everlive } from '../Everlive';

const getDefaultOptions = function () {
    return {
        maxAge: 60,
        enabled: false,
        storage: {
            storagePath: 'el_cache'
        }
    }
};

export function initCaching(options: any, sdk: Everlive) {
    var cachingOptions;
    var defaultOptions = getDefaultOptions();
    if (options.caching === true) {
        cachingOptions = (<any>_).deepExtend({}, defaultOptions);
        cachingOptions.enabled = true;
    } else {
        cachingOptions = (<any>_).deepExtend(defaultOptions, options.caching);
    }

    if (options.caching !== false) {
        sdk.setup.caching = cachingOptions;
    }

    sdk.cache = new CacheModule(cachingOptions, sdk);
}

export function initStore(options, sdk) {
    sdk.cache._initStore(options);
}
