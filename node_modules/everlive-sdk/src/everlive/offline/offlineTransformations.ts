'use strict';

import * as _ from 'underscore';

import {Constants} from '../constants';

var traverseAndApply = function (value, operation, additionalOptions?) {
    if (_.isArray(value)) {
        return _.map(value, function (item) {
            return operation(item, additionalOptions);
        });
    } else {
        return operation(value, additionalOptions);
    }
};

var idTransformation = function (value) {
    if (typeof value === 'object' && value._id && !value.Id) {
        value.Id = value._id;
        delete value._id;
    }

    return value;
};

var removeIdTransform = function (value, opts) {
    var verifyStateCreated = opts.verifyStateCreated;
    var shouldModifyObject = verifyStateCreated ? value[Constants.offlineItemsStateMarker] === Constants.offlineItemStates.created : true;
    if (typeof value === 'object' && (value._id || value.Id) && shouldModifyObject) {
        delete value._id;
        delete value.Id;
    }

    return value;
};

var removeMarkerTransform = function (value) {
    delete value[Constants.offlineItemsStateMarker];
    return value;
};

export const offlineTransformations = {
    removeIdTransform: function (value, verifyStateCreated?) {
        return traverseAndApply(value, removeIdTransform, {verifyStateCreated: verifyStateCreated});
    },
    idTransform: function (value) {
        return traverseAndApply(value, idTransformation);
    },
    singleFieldTransform: function (singleFieldExpression, value) {
        if (typeof value === 'undefined' || value === null) {
            return null;
        } else {
            return value[singleFieldExpression];
        }
    },
    traverseAndTransformFilterId: function (filterObj) {
        if (filterObj && filterObj.Id) {
            filterObj._id = filterObj.Id;
            delete filterObj.Id;
        }

        for (var prop in filterObj) {
            if (filterObj.hasOwnProperty(prop)) {
                var objectMember = filterObj[prop];
                if (typeof objectMember === 'object') {
                    offlineTransformations.traverseAndTransformFilterId(objectMember);
                }
            }
        }
    },
    removeMarkersTransform: function (value) {
        return traverseAndApply(value, removeMarkerTransform);
    },
    removeFieldsTransform: function (value: any, fields: any) {
        _.each(fields, function (field: any) {
            delete value[field];
        });

        return value;
    }
};