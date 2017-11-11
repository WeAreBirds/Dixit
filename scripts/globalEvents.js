'use strict';

$(function () {
    $(document).on('click', '.searchButton', function (e) {
        e.preventDefault();
        e.stopPropagation();

        $(this).closest('header').find('.searchBar').data('kendoSearchbar').show();
    });

    $(document).on('click', '[data-iab-href]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        app.analytics.trackEvent('User Action', 'Ext Click', $(this).data('iab-href'));
        if($(this).data('iab-href') == app.translations.texts.luck_url && app.cache.isUserLogged == false){
            app.mobileApp.navigate('components/privateLogin/view.html');
        }else{
            window.open($(this).data('iab-href'), '_system', 'location=no,toolbarposition=top');
        }
    });

    $(document).on('click', '[data-share]', function (e) {
        
        e.preventDefault();
        e.stopPropagation();
        app.analytics.trackEvent('User Action', 'Share', $(this).data('analytic-title'));
        window.plugins.socialsharing.shareWithOptions({
            url: app.cache.articleDetailUrl
        });
    });

    $(document).on('click', '[data-calendar]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var startDate = moment($(this).data('calendar-startdate'));
        var endDate = moment($(this).data('calendar-enddate'));

        if (endDate.hour() + endDate.minutes() == 0) {
            endDate = endDate.add(1, 'days');
        }

        app.analytics.trackEvent('User Action', 'Calendar', $(this).data('calendar-analytic-title'));

        var calOptions = window.plugins.calendar.getCalendarOptions();
        calOptions.url = $(this).data('calendar');

        window.plugins.calendar.createEventInteractivelyWithOptions($(this).data('calendar-title'), $(this).data('calendar-location'), '', startDate.toDate(), endDate.toDate(), calOptions);
    });

    $(document).on('click', '.externalLinks a', function (e) {
        e.preventDefault();
        e.stopPropagation();

        app.analytics.trackEvent('User Action', 'Ext Click', $(this).attr('href'));

        window.open($(this).attr('href'), '_blank', 'location=no,toolbarposition=top');
    });

    $('#closeNotificationPopup').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $('#notificationPopup').hide();
    });

    $('#loginNotificationPopup').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $('#notificationPopup').hide();
        app.mobileApp.navigate('components/privateLogin/view.html');
        
    });

    $('#disableNotificationPopup').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        app.storage.setItem('userLoginReminder', -1);
        $('#notificationPopup').hide();
    });
});
