import * as platform from '../../common/platform';

export interface Device {
    emulatorMode: boolean;
    _pushHandler;

    enableNotifications(pushSettings, success?: Function, error?: Function);
    disableNotifications(success?: Function, error?: Function);
    register(customParameters, success?: Function, error?: Function);
    unregister(success?: Function, error?: Function);
    updateRegistration(customParameters, success?: Function, error?: Function);
    areNotificationsEnabled(options, onSuccess?: Function, onError?: Function);
    notificationProcessed();
    getRegistration();
    _getPlatformType();
    _getDeviceId();
}

export function getCurrentDevice(pushHandler): Device {
    if (platform.isNativeScript) {
    	var NativeScriptCurrentDevice = require('./NativeScriptCurrentDevice');
        return new NativeScriptCurrentDevice(pushHandler);
    } else if (platform.isCordova || platform.isDesktop) {
    	var CordovaCurrentDevice = require('./CordovaCurrentDevice');
        return new CordovaCurrentDevice(pushHandler);
    } else {
        return <Device>{};
    }
}

export function ensurePushIsAvailable(): void {
    if (platform.isNativeScript) {
        var NativeScriptCurrentDevice = require('./NativeScriptCurrentDevice');
        NativeScriptCurrentDevice.ensurePushIsAvailable();
    } else if (platform.isCordova || platform.isDesktop) {
        var CordovaCurrentDevice = require('./CordovaCurrentDevice');
        CordovaCurrentDevice.ensurePushIsAvailable();
    }
}