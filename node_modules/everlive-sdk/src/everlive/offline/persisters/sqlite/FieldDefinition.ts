import { Constants } from '../../../constants'
export class FieldDefinition {
    isSpecialType: boolean;

    constructor(
        public name: string,
        public type: string,
        public key?: string
    ) {
        this.isSpecialType = Constants.SqliteUnsupportedTypes[this.type] !== undefined;
    }

    getDefinition(): string {
        const type = this.isSpecialType ? Constants.SqliteTypes.Text : this.type;
        let definition = `"${this.name}" "${type}"`;
        if (this.key) {
            definition += ` ${this.key}`;
        }
        return definition;
    }
}