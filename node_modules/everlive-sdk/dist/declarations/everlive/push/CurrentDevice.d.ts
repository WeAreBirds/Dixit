export interface Device {
    emulatorMode: boolean;
    _pushHandler: any;
    enableNotifications(pushSettings: any, success?: Function, error?: Function): any;
    disableNotifications(success?: Function, error?: Function): any;
    register(customParameters: any, success?: Function, error?: Function): any;
    unregister(success?: Function, error?: Function): any;
    updateRegistration(customParameters: any, success?: Function, error?: Function): any;
    areNotificationsEnabled(options: any, onSuccess?: Function, onError?: Function): any;
    notificationProcessed(): any;
    getRegistration(): any;
    _getPlatformType(): any;
    _getDeviceId(): any;
}
export declare function getCurrentDevice(pushHandler: any): Device;
export declare function ensurePushIsAvailable(): void;
