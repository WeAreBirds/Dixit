export interface SaveItemResult {
    ModifiedAt?: Date;
    CreatedAt?: Date;
    Id?: string;
    result: number;
    type: 'update'|'create';
}