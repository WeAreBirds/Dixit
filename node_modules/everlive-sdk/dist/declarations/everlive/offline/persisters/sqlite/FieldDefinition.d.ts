export declare class FieldDefinition {
    name: string;
    type: string;
    key: string;
    isSpecialType: boolean;
    constructor(name: string, type: string, key?: string);
    getDefinition(): string;
}
