/**
 * Constants used by the SDK* @typedef {Object} Everlive.Constants
 */

export enum DataQueryOperation {
    Read = 0,
    Create,
    Update,
    Delete,
    DeleteById,
    ReadById,
    Count,
    RawUpdate,
    SetAcl,
    SetOwner,
    UpdateById,
    UserLogin,
    UserLogout,
    UserChangePassword,
    UserLoginWithProvider,
    UserLinkWithProvider,
    UserUnlinkFromProvider,
    UserResetPassword,
    UserSetPassword,
    FilesUpdateContent,
    FilesGetDownloadUrlById,
    Aggregate,
    InvokeCloudFunction,
    InvokeStoredProcedure
}

export class Constants {
}