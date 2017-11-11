import * as _ from 'underscore';
import { FieldDefinition } from './FieldDefinition';
import { Constants } from '../../../constants';
import { Utils } from '../../../utils';

class BaseDefinition {
    protected _scheme:FieldDefinition[];

    constructor() {
        this._scheme = [];
        this._scheme.push(new FieldDefinition('_id', Constants.SqliteTypes.Text, 'PRIMARY KEY'));
        this._scheme.push(new FieldDefinition('CreatedAt', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('ModifiedAt', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('CreatedBy', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('ModifiedBy', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('Owner', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('Meta', Constants.SqliteUnsupportedTypes.OBJECT));
        this._scheme.push(new FieldDefinition(Constants.offlineItemsStateMarker, Constants.SqliteTypes.Text));
    }

    extendScheme(externalScheme):FieldDefinition[] {
        let externalDefinition = _.map(externalScheme, function (field: any) {
            return new FieldDefinition(field.Name, field.Type || Constants.SqliteTypes.Text);
        });
        const extended = _.union(externalDefinition, this._scheme);
        return extended;
    }
}

class UsersDefinition extends BaseDefinition {
    constructor() {
        super();
        this._scheme.push(new FieldDefinition('Username', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('Email', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('DisplayName', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('Role', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('IdentityProvider', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('IsVerified', Constants.SqliteUnsupportedTypes.BOOLEAN));
    }
}

class FilesDefinition extends BaseDefinition {
    constructor() {
        super();
        this._scheme.push(new FieldDefinition('Filename', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('ContentType', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('Length', Constants.SqliteTypes.Number));
        this._scheme.push(new FieldDefinition('totalSize', Constants.SqliteTypes.Number));
        this._scheme.push(new FieldDefinition('Storage', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('Uri', Constants.SqliteTypes.Text));
        this._scheme.push(new FieldDefinition('base64', Constants.SqliteTypes.Text));
    }
}

export function getDefinition(type: string, externalScheme):FieldDefinition[] {
    let typeDefinition:BaseDefinition = null;
    if (Utils.isContentType.files(type)) {
        typeDefinition = new FilesDefinition();
    } else if (Utils.isContentType.users(type)) {
        typeDefinition = new UsersDefinition();
    } else {
        typeDefinition = new BaseDefinition();
    }
    return typeDefinition.extendScheme(externalScheme);
}