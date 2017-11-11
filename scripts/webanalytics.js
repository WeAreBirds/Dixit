'use strict';

app.analytics = kendo.observable({
    id: '',
    lastPage: '',

    init: function (id) {
        if ((typeof id === 'undefined') || (id.length === 0)) {
            throw new Error('Analytics: The tracking ID is not defined.');
        }

        this.id = id;
    },

    callGoogle: function (params) {
        var url = 'https://www.google-analytics.com/collect?v=1';
        url += '&tid=' + this.id;
        url += '&ds=app';
        //url += '&cid=' + device.uuid;
        url += '&ul=' + app.translations.selectedLanguage + '-be';
        url += '&an=Dixit%20v3';

        url += params;

        if (window.navigator.simulator !== true) {
            $.get(url);
        } else {
            console.log(url);
        }
    },

    trackEvent: function (category, action, label, value) {
        var params = '&t=event';
        params += '&ec=' + category;
        params += '&ea=' + action;
        params += '&el=' + label;
        if (value !== undefined) {
            params += '&ev=' + value;
        }

        this.callGoogle(params);
    },

    trackPage: function (title) {
        if (this.lastPage == title) {
            return;
        }

        this.lastPage = title;

        var params = '&t=screenview';
        params += '&cd=' + $.trim(title);
        params += '&cd1=' + app.translations.selectedLanguage.toUpperCase();

        this.callGoogle(params);
    }
});

app.analytics.init('UA-47380614-3');
