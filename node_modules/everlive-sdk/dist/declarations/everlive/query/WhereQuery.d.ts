/**
 * @classdesc A fluent API operation for creating a filter for a query by chaining different rules.
 * @class WhereQuery
 * @protected
 * @borrows WhereQuery#eq as WhereQuery#equal
 * @borrows WhereQuery#ne as WhereQuery#notEqual
 * @borrows WhereQuery#gt as WhereQuery#greaterThan
 * @borrows WhereQuery#gte as WhereQuery#greaterThanEqual
 * @borrows WhereQuery#lt as WhereQuery#lessThan
 * @borrows WhereQuery#lte as WhereQuery#lessThanEqual
 */
export declare class WhereQuery {
    parent: any;
    single: any;
    expr: any;
    constructor(parentQuery: any, exprOp?: any, singleOperand?: any);
    /**
     * Adds an `and` clause to the current condition and returns it for further chaining.
     * @method and
     * @memberOf WhereQuery.prototype
     * @returns {WhereQuery}
     */
    and(): WhereQuery;
    /**
     * Adds an `or` clause to the current condition and returns it for further chaining.
     * @method or
     * @memberOf WhereQuery.prototype
     * @returns {WhereQuery}
     */
    or(): WhereQuery;
    /**
     * Adds a `not` clause to the current condition and returns it for further chaining.
     * @method not
     * @memberOf WhereQuery.prototype
     * @returns {WhereQuery}
     */
    not(): WhereQuery;
    _simple(operator: any, ...args: any[]): any;
    /**
     * Adds a condition that a field must be equal to a specific value.
     * @method eq
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (to which the fields must be equal).
     * @returns {WhereQuery}
     */
    eq(field: any, value: any): any;
    /**
     * Adds a condition that a field must *not* be equal to a specific value.
     * @method ne
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (to which the field must not be equal).
     * @returns {WhereQuery}
     */
    ne(field: any, value: any): any;
    /**
     * Adds a condition that a field must be `greater than` a certain value. Applicable to Number, String, and Date fields.
     * @method gt
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (that the field should be greater than).
     * @returns {WhereQuery}
     */
    gt(field: any, value: any): any;
    /**
     * Adds a condition that a field must be `greater than or equal` to a certain value. Applicable to Number, String, and Date fields.
     * @method gte
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (that the field should be greater than or equal to).
     * @returns {WhereQuery}
     */
    gte(field: any, value: any): any;
    /**
     * Adds a condition that a field must be `less than` a certain value. Applicable to Number, String, and Date fields.
     * @method lt
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (that the field should be less than).
     * @returns {WhereQuery}
     */
    lt(field: any, value: any): any;
    /**
     * Adds a condition that a field must be `less than or equal` to a certain value. Applicable to Number, String, and Date fields.
     * @method lte
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {*} value Comparison value (that the field should be less than or equal to).
     * @returns {WhereQuery}
     */
    lte(field: any, value: any): any;
    /**
     * Adds a condition that a field must be in a set of values.
     * @method isin
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {Array} value An array of the values that the field should be in.
     * @returns {WhereQuery}
     */
    isin(field: any, value: any): any;
    /**
     * Adds a condition that a field must *not* be in a set of values.
     * @method notin
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {Array} value An array of values that the field should not be in.
     * @returns {WhereQuery}
     */
    notin(field: any, value: any): any;
    /**
     * Adds a condition that a field must include *all* of the specified values. Applicable to Array fields.
     * @method all
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {Array} value An array of values that the field must include.
     * @returns {WhereQuery}
     */
    all(field: any, value: any): any;
    /**
     * Adds a condition that a field must contain an array whose length is larger than a specified value. Applicable to Array fields.
     * @method size
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {number} value The size that the array must be bigger than.
     * @returns {WhereQuery}
     */
    size(field: any, value: any): any;
    /**
     * Adds a condition that a field must satisfy a specified regex.
     * @method regex
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {string} regularExpression Regular expression in PCRE format.
     * @param {string} [options] A string of regex options to use. See [specs](http://docs.mongodb.org/manual/reference/operator/query/regex/#op._S_options) for a description of available options.
     * @returns {WhereQuery}
     */
    regex(field: any, value: any, flags: any): any;
    /**
     * Adds a condition that a field value must *start* with a specified string.
     * @method startsWith
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {string} value The string that the field should start with.
     * @param {string} [options] A string of regex options to use. See [specs](http://docs.mongodb.org/manual/reference/operator/query/regex/#op._S_options) for a description of available options.
     * @returns {WhereQuery}
     */
    startsWith(field: any, value: any, flags: any): any;
    /**
     * Adds a condition that a field value must *end* with a specified string.
     * @method endsWith
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name.
     * @param {string} value The string that the field should end with.
     * @param {string} [options] A string of  regex options to use. See [specs](http://docs.mongodb.org/manual/reference/operator/query/regex/#op._S_options) for a description of available options.
     * @returns {WhereQuery}
     */
    endsWith(field: any, value: any, flags: any): any;
    /**
     * Adds a Geospatial condition that a specified geopoint must be within a certain distance from another geopoint. Applicable to GeoPoint fields only.
     * @method nearSphere
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name containing a {GeoPoint} in the following format: `(decimal_degrees_latitude,decimal_degrees_longitude)`, where *decimal_degrees_latitude* ranges from -90 to 90 and *decimal_degrees_longitude* ranges from -180 to 180. Example: `(42.6954322,123.3239467)`
     * @param {Everlive.GeoPoint} point Comparison geopoint value.
     * @param {number} distance Distance value.
     * @param {string} [metrics=radians] A string representing what unit of measurement is used for distance. Possible values: radians, km, miles.
     * @returns {WhereQuery}
     */
    nearSphere(field: any, point: any, distance: any, metrics: any): any;
    /**
     * Adds a Geospatial condition that a specified geopoint must be within a specified coordinate rectangle. Applicable to GeoPoint fields only.
     * @method withinBox
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name containing a {GeoPoint} in the following format: `(decimal_degrees_latitude,decimal_degrees_longitude)`, where *decimal_degrees_latitude* ranges from -90 to 90 and *decimal_degrees_longitude* ranges from -180 to 180. Example: `(42.6954322,123.3239467)`
     * @param {Everlive.GeoPoint} pointBottomLeft Value representing the bottom left corner of the box.
     * @param {Everlive.GeoPoint} pointUpperRight Value representing the upper right corner of the box.
     * @example ```js
     var query = new Everlive.Query();
     query.where().withinBox('Location',
     new Everlive.GeoPoint(23.317871, 42.687709),
     new Everlive.GeoPoint(23.331346, 42.707075));
     ```
     * @returns {WhereQuery}
     */
    withinBox(field: any, pointBottomLeft: any, pointUpperRight: any): any;
    /**
     * Adds a Geospatial condition that a specified geopoint must be within a specified coordinate polygon. The polygon is specified as an array of geopoints. The last point in the array is implicitly connected to the first point thus closing the shape. Applicable to GeoPoint fields only.
     * @method withinPolygon
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name containing a {GeoPoint} in the following format: `(decimal_degrees_latitude,decimal_degrees_longitude)`, where *decimal_degrees_latitude* ranges from -90 to 90 and *decimal_degrees_longitude* ranges from -180 to 180. Example: `(42.6954322,123.3239467)`
     * @param {Everlive.GeoPoint[]} points Comparison value in the form of an array of geopoints defining the polygon.
     * @example ```js
     var point1 = new Everlive.GeoPoint(23.317871, 42.687709);
     var point2 = new Everlive.GeoPoint(42.698749, 42.698749);
     var point3 = new Everlive.GeoPoint(23.331346, 42.702282);

     var query = new Everlive.Query();
     query.where().withinPolygon("location", [point1, point2, point3]);
     * ```
     * @returns {WhereQuery}
     */
    withinPolygon(field: any, points: any): any;
    /**
     * Adds a Geospatial condition that a specified geopoint must be within a coordinate circle. Applicable to GeoPoint fields only.
     * @method withinCenterSphere
     * @memberOf WhereQuery.prototype
     * @param {string} field Field name containing a {GeoPoint} in the following format: `(decimal_degrees_latitude,decimal_degrees_longitude)`, where *decimal_degrees_latitude* ranges from -90 to 90 and *decimal_degrees_longitude* ranges from -180 to 180. Example: `(42.6954322,123.3239467)`
     * @param {Everlive.GeoPoint} center Comparison value specifying the center of the coordinate circle.
     * @param {number} radius Value specifying the radius length.
     * @param {string} [metrics=radians] A string representing what unit of measurement is used for radius length. Possible values: radians, km, miles.
     * @returns {WhereQuery}
     */
    withinCenterSphere(field: any, center: any, radius: any, metrics: any): any;
    /**
     * Ends the definition of the current WhereQuery. You need to call this method in order to continue with the definition of the parent `Query`. All other `WhereQuery` methods return the current instance of `WhereQuery` to allow chaining.
     * @method done
     * @memberOf WhereQuery.prototype
     * @returns {Query}
     */
    done(): any;
    _done(): any;
    equal(...args: any[]): any;
    notEqual(...args: any[]): any;
    greaterThan(...args: any[]): any;
    greaterThanEqual(...args: any[]): any;
    lessThan(...args: any[]): any;
    lessThanEqual(...args: any[]): any;
}
