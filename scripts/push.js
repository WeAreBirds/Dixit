'use strict';

app.push = kendo.observable({
    isActive: true,
    // Change this to the 'Application Code' of your Pushwoosh.com Application
    PUSHWOOSH_APPID: 'E4A37-DE4E5',

    // For Android, we need the 'Project Number' you created at https://console.developers.google.com
    // While you're there, make sure that 'Google Cloud Messaging for Android' is enabled (menu item API's)
    GOOGLE_PROJECT_ID: '370890989369',

    init: function () {
        var _this = this;
        _this.initPushwoosh();
        // Load the saved active state
        /*app.storage.getItem('push', function (active) {
            if (active === null) {
                active = _this.isActive;
            } else {
                active = ((active === 'true') || (active === 1) || (active === '1'));
            }

            _this.set('isActive', active);

            if (!_this.isSupported()) {
                return;
            }

            switch (kendo.support.mobileOS.device) {
                case 'android':
                    _this.initPushwooshAndroid();
                    _this.registerDevice();
                    break;
                case 'iphone':
                case 'ipad':
                    _this.initPushwooshIOS();
                    _this.registerDevice();
                    break;
                case 'wp':
                case 'windows':
                    _this.initPushwooshWP8();
                    _this.registerDevice();
                    break;
            }
        });*/
    },

    initPushwoosh: function initPushwoosh () {
        var _this = this;
        console.log(window.navigator.simulator);
        // The first thing you need to do is registering this callback.
        // It's called when a push notification is received by the plugin.
        document.addEventListener('push-notification', function (event) {
          // The exact payload differs per platform - use an alert to inspect it.
         alert('Push received: ' + JSON.stringify(event));
        });
      
        // Now init the plugin.
        if(this.isSupported){
            /*window.plugins.pushNotification.onDeviceReady({
                pw_appid : PUSHWOOSH_APPID,  // iOS
                   appid : PUSHWOOSH_APPID,  // WP8 and Android
               projectid : GOOGLE_PROJECT_ID // Android
             });*/
        }else{
            alert('Not supported');
        }
        
      },

    setActive: function (active) {
        this.set('isActive', active);

        // Save the active state in the persistent storage
        app.storage.setItem('push', active);

        if (active) {
            this.registerDevice();
        } else {
            this.unregisterDevice();
        }
    },
    isSupported: function () {
        if (window.navigator.simulator === true || window.plugins.pushNotification === undefined || typeof window.plugins.pushNotification.onDeviceReady == 'undefined') {
            return false;
        }

        return true;
    },

    initPushwooshWP8: function () {
        var pushNotification = window.plugins.pushNotification;

        // Set push notification callback before we initialize the plugin. This is called when a push is received.
        document.addEventListener('push-notification', function (event) {
        });

        // Initialize the plugin
        pushNotification.onDeviceReady({ appid: this.PUSHWOOSH_APPID });
    },

    initPushwooshIOS: function () {
        var pushNotification = window.plugins.pushNotification;

        // Set push notification callback before we initialize the plugin. This is called when a push is received.
        document.addEventListener('push-notification', function (event) {
            // Reset badges on icon
            pushNotification.setApplicationIconBadgeNumber(0);
        });

        // Initialize the plugin
        pushNotification.onDeviceReady({ pw_appid: this.PUSHWOOSH_APPID });

        // reset (hide) badges on start by setting it to 0
        pushNotification.setApplicationIconBadgeNumber(0);
    },

    initPushwooshAndroid: function () {
        var pushNotification = window.plugins.pushNotification;

        // Set push notification callback before we initialize the plugin. This is called when a push is received.
        document.addEventListener('push-notification', function (event) {
        });

        // Initialize the plugin
        pushNotification.onDeviceReady({ projectid: this.GOOGLE_PROJECT_ID, appid: this.PUSHWOOSH_APPID });
    },

    registerDevice: function () {
        if (!this.isSupported() || !this.isActive) return;
        
        window.plugins.pushNotification.registerDevice();
    },

    unregisterDevice: function () {
        if (!this.isSupported()) return;

        window.plugins.pushNotification.unregisterDevice();
    },

    getPushToken: function () {
        if (!this.isSupported()) return;

        window.plugins.pushNotification.getPushToken();
    },

    startLocationTracking: function () {
        if (!this.isSupported()) return;

        window.plugins.pushNotification.startLocationTracking();
    },

    stopLocationTracking: function () {
        if (!this.isSupported()) return;

        window.plugins.pushNotification.stopLocationTracking();
    }
});
