export declare class QueryBuilder {
    query: any;
    expr: any;
    constructor(query: any);
    build(): {
        $where: any;
        $select: any;
        $sort: any;
        $skip: any;
        $take: any;
        $expand: any;
        $aggregate: any;
    };
    _getSkip(): any;
    _getTake(): any;
    _getExpand(): {};
    _getAggregate(): any;
    _buildSelect(): any;
    _buildSort(): any;
    _buildWhere(): any;
    _build(expr: any): any;
    _isSimple(expr: any): boolean;
    _simple(expr: any): {};
    _isRegex(expr: any): boolean;
    _regex(expr: any): {};
    _getRegex(expr: any): RegExp;
    _getRegexValue(regex: any): {
        $regex: any;
        $options: string;
    };
    _isGeo(expr: any): boolean;
    _geo(expr: any): {};
    _getGeoTerm(expr: any): any;
    _getNearSphereTerm(expr: any): {
        '$nearSphere': any;
    };
    _getWithinBox(expr: any): {
        '$within': {
            '$box': any[];
        };
    };
    _getWithinPolygon(expr: any): {
        '$within': {
            '$polygon': any[];
        };
    };
    _getWithinCenterSphere(expr: any): {
        '$within': {
            '$centerSphere': {
                'center': any;
            };
        };
    };
    _getGeoPoint(point: any): any;
    _getGeoPoints(points: any): any[];
    _isAnd(expr: any): boolean;
    _and(expr: any): {};
    _andAppend(andObj: any, newObj: any): any;
    _isOr(expr: any): boolean;
    _or(expr: any): {
        $or: any[];
    };
    _isNot(expr: any): boolean;
    _not(expr: any): any;
    _translateoperator(operator: any): any;
}
