/**
 * Constants used by the SDK* @typedef {Object} Everlive.Constants
 */
export declare enum DataQueryOperation {
    Read = 0,
    Create = 1,
    Update = 2,
    Delete = 3,
    DeleteById = 4,
    ReadById = 5,
    Count = 6,
    RawUpdate = 7,
    SetAcl = 8,
    SetOwner = 9,
    UpdateById = 10,
    UserLogin = 11,
    UserLogout = 12,
    UserChangePassword = 13,
    UserLoginWithProvider = 14,
    UserLinkWithProvider = 15,
    UserUnlinkFromProvider = 16,
    UserResetPassword = 17,
    UserSetPassword = 18,
    FilesUpdateContent = 19,
    FilesGetDownloadUrlById = 20,
    Aggregate = 21,
    InvokeCloudFunction = 22,
    InvokeStoredProcedure = 23,
}
export declare class Constants {
}
