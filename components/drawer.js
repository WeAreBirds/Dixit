'use strict';

app.drawer = kendo.observable({
    professions: new kendo.data.DataSource({ data: [] }),

    onInit: function () {
        // Translate the view
        app.drawer.set('translations', app.translations);
        app.drawer.translations.bind('change', function (e) {
            if (e.field == 'selectedLanguage') {
                app.drawer.loadData();
            }
        });

        app.drawer.set('push', app.push);

        app.drawer.loadData();
    },

    loadData: function () {
        app.webservices.getProfessionCategories().done(function (categories) {
            app.drawer.professions.data(categories);
        });
    },

    onShow: function () {
        app.analytics.trackEvent('User Action', 'Menu', 'open');
    },

    selectLanguage: function (e) {
        e.preventDefault();

        app.translations.setLanguage($(e.currentTarget).data('lg'));
        
        app.analytics.trackEvent('Language', 'Selection', $(e.currentTarget).data('lg'));
    }

    /*onPushChange: function (e) {
        app.push.setActive($(e.currentTarget).prop('checked'));
    }*/
});
