export interface Item {
    CreatedAt: Date;
    CreatedBy: string;
    Id: string | number;
    Meta: {
        Permissions: {
            CanDelete: boolean;
            CanRead: boolean;
            CanUpdate: boolean;
        };
    };
    ModifiedAt: Date;
    ModifiedBy: string;
    Owner: string;
    Role: string;
}
