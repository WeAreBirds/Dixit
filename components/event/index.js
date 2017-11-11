'use strict';

app.eventView = kendo.observable({
    event: {
        id: null,
        image: ''
    },

    onInit: function () {
        // Translate the view
        app.eventView.set('translations', app.translations);
        app.eventView.translations.bind('change', function (e) {
            if (e.field == 'selectedLanguage') {
                app.eventView.event = {
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
        if (e.view.params.id != app.eventView.event.id) {
            var content = $('#eventView').find('[data-role=content],[data-role=footer]');

            // Hide content and show loading indicator
            content.css('visibility', 'hidden');
            app.mobileApp.showLoading();

            // Get the event details
            app.webservices.getEvent(e.view.params.id)
                .done(function (event) {
                    app.eventView.set('event', event);

                    app.analytics.trackPage('Event : ' + app.eventView.event.analyticTitle);

                    // Show content
                    content.css('visibility', '');
                })
                .always(function () {
                    // Hide loading indicator
                    app.mobileApp.hideLoading();
                });
        } else {
            app.analytics.trackPage('Event : ' + app.eventView.event.analyticTitle);
        }
    }
});