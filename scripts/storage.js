'use strict';

app.storage = {
    setItem: function (key, value, success, error) {
        localStorage.setItem(key, value);
            if (success) success();
        /*if (window.NativeStorage) {
            NativeStorage.putString(key, value, success, error);
        } else {
            
        }*/
    },

    getItem: function (key, success, error) {
        success(localStorage.getItem(key));
        /*if (window.NativeStorage) {
            alert("Native");
            NativeStorage.getString(key, success, error);
        } else {
            success(localStorage.getItem(key));
        }*/
    },

    removeItem: function (key, success, error) {
        localStorage.removeItem(key);
            success();
        /*f (window.NativeStorage) {
            NativeStorage.remove(key, success, error);
        } else {
            
        }*/
    }
};
