import * as _ from 'underscore';

//http://stackoverflow.com/questions/14058193/remove-empty-properties-falsy-values-from-object-with-underscore-js
export function compactObject(o) {
    var newObject = {};
    _.each(o, function(v, k) {
        if(v !== null && v !== undefined) {
            newObject[k] = v
        }
    });

    return newObject;
}
