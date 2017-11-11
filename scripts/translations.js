'use strict';

app.translations = kendo.observable({
    supportedLanguages: ['fr', 'nl'],
    selectedLanguage: 'nl',
    texts: window.texts['nl'],
    isNl: true,
    isFr: false,

    init: function () {
        var _this = this;

        // Load the saved language
        app.storage.getItem('language', function (lg) {
            if (lg === null) {
                // If no language was saved then we use the device language
                lg = (navigator.language || navigator.userLanguage).substr(0, 2);
            }

            _this.setLanguage(lg);
        });
    },

    setLanguage: function (lg) {
        // Check if the app support the specified language
        if (this.supportedLanguages.indexOf(lg) === -1) {
            return;
        }

        moment.locale(lg);
        lscache.setBucket(lg);

        // Check if the language changed
        if (lg != this.selectedLanguage) {
            // Apply the change
            this.set('selectedLanguage', lg);
            this.set('isNl', lg == 'nl');
            this.set('isFr', lg == 'fr');
            this.set('texts', window.texts[lg]);

            // Save the selected language in the persistent storage
            app.storage.setItem('language', this.selectedLanguage);
        }
    }
});
