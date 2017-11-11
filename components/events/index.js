'use strict';

app.eventsView = kendo.observable({
    events: [],
    months: [],
    swiperMonths: null,
    years: [],
    swiperYears: null,
    selectedMonth: moment().month(),
    selectedYear: 2,

    forceReload: false,

    onInit: function () {
        app.mobileApp.showLoading();

        // Translate the view
        app.eventsView.set('translations', app.translations);
        app.eventsView.translations.bind('change', function (e) {
            if (e.field == 'selectedLanguage') {
                if (app.mobileApp.view().id == 'components/events/view.html') {
                    app.eventsView.resetData();
                    app.eventsView.loadFilters();
                    app.eventsView.loadData();
                } else {
                    app.eventsView.forceReload = true;
                }
            }
        });

        $(document).on('click', '#eventsView .eventItem', function (e) {
            e.preventDefault();

            app.mobileApp.navigate('components/event/view.html?id=' + $(e.currentTarget).data('id'), 'slide');
        });

        app.eventsView.loadFilters();
        app.eventsView.loadData();
    },

    onShow: function () {
        $('iframe').attr('src', $('iframe').attr('src'));
        if (app.eventsView.forceReload) {
            app.eventsView.resetData();
            app.eventsView.loadFilters();
            app.eventsView.loadData();
        }

        app.analytics.trackPage('Events List : ' + $('.swiper-years .swiper-slide-active').data('analytic-title') + '/' + (parseInt($('.swiper-months .swiper-slide-active').data('analytic-title')) + 1));
    },

    resetData: function () {
        app.mobileApp.showLoading();

        // Destroy the slides
        this.swiperMonths.destroy(true, true);
        this.swiperYears.destroy(true, true);

        $('#eventsView .swiper-wrapper').html('');
    },

    loadFilters: function () {
        var i;

        var months = moment.months();
        for (i = 0; i < months.length; i++) {
            months[i] = {
                month: i,
                name: months[i]
            };
        }

        var years = [];
        for (i = moment().year() - 2; i <= moment().year() + 2; i++) {
            years.push(i);
        }

        // Load the slides
        app.eventsView.set('months', months);
        app.eventsView.set('years', years);

        // Create the months slider
        this.swiperMonths = new Swiper('#eventsView .swiper-months', {
            initialSlide: this.selectedMonth,
            spaceBetween: 50,
            centeredSlides: true,
            slidesPerView: 'auto',
            touchRatio: 0.2,
            slideToClickedSlide: true,
            runCallbacksOnInit: false,
            onSlideChangeEnd: function (swiper) {
                app.eventsView.selectedMonth = swiper.activeIndex;
                app.eventsView.loadData();

                app.analytics.trackPage('Events List : ' + $('.swiper-years .swiper-slide-active').data('analytic-title') + '/' + (parseInt($('.swiper-months .swiper-slide-active').data('analytic-title')) + 1));
            }
        });

        // Create the years slider
        this.swiperYears = new Swiper('#eventsView .swiper-years', {
            initialSlide: this.selectedYear,
            spaceBetween: 50,
            centeredSlides: true,
            slidesPerView: 'auto',
            touchRatio: 0.2,
            slideToClickedSlide: true,
            runCallbacksOnInit: false,
            onSlideChangeEnd: function (swiper) {
                app.eventsView.selectedYear = swiper.activeIndex;
                app.eventsView.loadData();

                app.analytics.trackPage('Events List : ' + $('.swiper-years .swiper-slide-active').data('analytic-title') + '/' + (parseInt($('.swiper-months .swiper-slide-active').data('analytic-title')) + 1));
            }
        });
    },

    loadData: function () {
        app.webservices.getEvents($('.swiper-years .swiper-slide-active').data('year'), this.selectedMonth + 1).done(function (events) {
            app.eventsView.set('events', events);
        });
    },

    onEventsLoaded: function () {
        $('#eventsView .listEvents').waitForImages(true)
            .progress(function () {
                $(this).css('visibility', '');
            });

        this.forceReload = false;
        app.mobileApp.hideLoading();
    }
});