'use strict';

app.aboutView = kendo.observable({
    about: {
        id: null,
        image: ''
    },

    onInit: function () {
        // Translate the view
        app.aboutView.set('translations', app.translations);
        app.aboutView.translations.bind('change', function (e) {
            if (e.field == 'selectedLanguage') {
                app.aboutView.about = {
                    id: null,
                    image: ''
                };
            }
        });
    },

    onShow: function (e) {
        // Scroll to top
        e.view.scroller.reset();
        $('iframe').attr('src', $('iframe').attr('src'));
        if (e.view.params.id != app.aboutView.about.id) {
            var content = $('#aboutView').find('[data-role=content],[data-role=footer]');

            // Hide content and show loading indicator
            content.css('visibility', 'hidden');
            app.mobileApp.showLoading();

            // Get the about details
            app.webservices.getabout(e.view.params.id)
                .done(function (about) {
                    app.aboutView.set('about', about);

                    app.analytics.trackPage('about : ' + app.aboutView.about.analyticTitle);

                    // Show content
                    content.css('visibility', '');
                })
                .always(function () {
                    // Hide loading indicator
                    app.mobileApp.hideLoading();
                });
        } else {
            app.analytics.trackPage('About : ' + app.aboutView.about.analyticTitle);
        }
    }
});