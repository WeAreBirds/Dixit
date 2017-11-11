app.articlesView = kendo.observable({
    mode: 'news',
    categories: [],
    videoArticles:[],
    swiperCategories: null,
    swiperArticles: null,
    swiperVideo: null,
    tplArticles: null,
    initialSlide: app.webservices.newsPosition,

    forceReload: false,

    onInit: function () {
        app.mobileApp.showLoading();
        lscache.set('refreshData', false);
        // Translate the view
        app.articlesView.set('translations', app.translations);
        app.articlesView.translations.bind('change', function (e) {
            if (e.field == 'selectedLanguage') {
                if (app.mobileApp.view().id == 'components/articles/view.html') {
                    app.articlesView.resetData();
                    app.articlesView.loadData();
                } else {
                    app.articlesView.forceReload = true;
                }
            }
        });

        app.articlesView.tplArticles = kendo.template($('#articlesViewArticleTemplate').html());

        $(document).on('click', '#articlesView .card', function (e) {
            e.preventDefault();
            var type = $(e.currentTarget).data('type');
            if(type == 2){
                var id = $(e.currentTarget).data('id');
                $('[id=pictureDetail-' + id + ']').insertAfter( $('.km-header') ).fadeToggle();
            }else{
                app.mobileApp.navigate('components/article/view.html?id=' + $(e.currentTarget).data('id'), 'slide');
            }
        });

        app.articlesView.loadData();
        
    },

    onShow: function (e) {
        $('iframe').attr('src', $('iframe').attr('src'));
        var refresh = lscache.get('refreshData');
        var mode = 'news';
        if (e.view.params.mode) {
            mode = e.view.params.mode;
        }

        var initialSlide = app.webservices.newsPosition;
        if (e.view.params.idx !== undefined) {
            initialSlide = e.view.params.idx;
        }
        if (app.articlesView.mode != mode) {
            // The mode changed, reload everything
            app.articlesView.mode = mode;
            app.articlesView.initialSlide = initialSlide;

            app.articlesView.resetData();
            app.articlesView.loadData();
        } else if (refresh == true || refresh == "true") {
            app.articlesView.resetData();
            app.articlesView.loadData();
            lscache.set('refreshData', false);
        } else if (app.articlesView.forceReload) {
            app.articlesView.resetData();
            app.articlesView.loadData();
        } else if (app.articlesView.swiperCategories && (app.articlesView.swiperCategories.activeIndex != initialSlide)) {
            // The slide index changed, just show the right one
            app.articlesView.initialSlide = initialSlide;

            app.articlesView.swiperCategories.slideTo(app.articlesView.initialSlide);
        } else if ($('.swiper-categories .swiper-slide-active').length) {
            app.analytics.trackPage('Articles List : ' + $('.swiper-categories .swiper-slide-active').data('analytic-title'));
        }
    },

    resetData: function () {
        app.mobileApp.showLoading();

        // Destroy the slides
        this.swiperCategories.destroy(true, true);
        this.swiperArticles.destroy(true, true);
        $('#articlesView .swiper-wrapper').html('');
    },

    loadData: function () {
        // Load the slides
        if (this.mode == 'news') {
            app.webservices.getArticlesCategories().done(function (categories) {
                app.articlesView.set('categories', categories);
            });
        } else {
            app.webservices.getProfessionCategories().done(function (categories) {
                app.articlesView.set('categories', categories);
            });
        }
        app.webservices.getLastVideoArticles().done(function (videoArticles) {
            this.videoArticles = videoArticles;
            app.articlesView.set('videoArticles', videoArticles);
        });
    },

    updateQueryStringParameter: function (uri, key, value) {
        var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
        var separator = uri.indexOf('?') !== -1 ? '&' : '?';
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + '=' + value + '$2');
        }

        return uri + separator + key + '=' + value;
    },

    onCategoriesLoaded: function () {
        var _this = this;
        if (_this.categories.length) {
            setTimeout(function () {
                // Create the categories slider
                _this.swiperCategories = new Swiper('#articlesView .swiper-categories', {
                    initialSlide: _this.initialSlide,
                    spaceBetween: 50,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    touchRatio: 0.2,
                    slideToClickedSlide: true,
                    onSlideChangeEnd: function (swiper) {
                        // Update slide index in the url
                        window.location.hash = app.articlesView.updateQueryStringParameter(window.location.hash, 'idx', swiper.activeIndex);
                        app.analytics.trackPage('Articles List : ' + $('.swiper-categories .swiper-slide-active').data('analytic-title'));
                    }
                });

                if (_this.swiperArticles) {
                    // If the articles slider is already loaded, link them together
                    _this.swiperArticles.params.control = _this.swiperCategories;
                    _this.swiperCategories.params.control = _this.swiperArticles;
                }
            }, 100);
        }
    },

    onArticlesLoaded: function () {
        var _this = this;
        if (this.categories.length) {
            // Create the articles slider
            this.swiperArticles = new Swiper('#articlesView .swiper-articles', {
                initialSlide: this.initialSlide,
                spaceBetween: 0,
                onInit: function () {
                    var slides = $('#articlesView .swiper-articles .swiper-slide');
                    var slide = $(slides[app.articlesView.initialSlide]);
                    // Load the content of the initial slide
                    $('.swiper-videos').hide();
                    $.when(app.webservices.getTopArticles(app.articlesView.mode == 'news' ? null : slide.data('id'), app.articlesView.mode != 'news'), app.webservices.getArticles(app.articlesView.mode == 'news' ? null : slide.data('id'), 0, app.articlesView.mode != 'news'), slide).done(function (topArticles, articles, slide) {
                        app.articlesView.renderTopArticles(slide, topArticles);
                        topArticles.forEach(function(element) {
                            if(element.articleType == 2){ 
                                $('[id="pictureClick-' + element.id + '"]').show();
                                $('[id="closePictureDetail-' + element.id + '"]').on('click', function (e) {
                                    $('[id="pictureDetail-' + element.id + '"]').hide();
                                });
                            }
                        }, this);
                        app.articlesView.renderArticles(slide, articles, false);
                        articles.forEach(function(element) {
                            if(element.articleType == 2){
                                $('[id="pictureClick-' + element.id + '"]').show();
                                $('[id="closePictureDetail-' + element.id + '"]').on('click', function (e) {
                                    $('[id="pictureDetail-' + element.id + '"]').hide();
                                });
                            }
                        }, this);
                        app.articlesView.forceReload = false;
                        setTimeout(function () {
                            this.swiperVideo = new Swiper('#articlesView .swiper-videos', {
                                initialSlide: this.initialSlide,
                                pagination: '.swiper-pagination',
                                paginationClickable: true,
                                slidesPerView: 'auto',
                                paginationClickable: true,
                                spaceBetween: 30,
                            });
                        }, 100);
                        $('.swiper-videos').insertAfter('.buttonSeeMore');
                        $('.swiper-videos:first').show();
                        if($('.swiper-videos .swiper-slide').on('click', function(e){
                            var vimeo = $(this).data('url-vimeo');
                            var youtube = $(this).data('url-youtube');
                            var vimeoUrl = 'https://player.vimeo.com/video/' + vimeo;
                            var youtubeUrl = 'https://www.youtube.com/embed/' + youtube;
                            if ($(this).attr('data-url-vimeo')) {
                                window.open(vimeoUrl, '_blank', 'location=yes');
                            } else {
                                window.open(youtubeUrl, '_blank', 'location=yes');
                            }
                            e.preventDefault();
                        }));

                        app.mobileApp.hideLoading();
                    });


                    for (var i = 0; i < app.articlesView.categories.length; i++) {
                        // Skip the initial slide, it is already loaded
                        if (i == app.articlesView.initialSlide) {
                            continue;
                        }
                        // Load the content of the slide
                        slide = $(slides[i]);
                        $.when(app.webservices.getTopArticles(slide.data('id'), app.articlesView.mode != 'news'), app.webservices.getArticles(slide.data('id'), 0, app.articlesView.mode != 'news'), slide).done(function (topArticles, articles, slide) {
                            app.articlesView.renderTopArticles(slide, topArticles);
                            topArticles.forEach(function(element) {
                                if(element.articleType == 2){
                                    $('[id="pictureClick-' + element.id + '"]').show();
                                    $('[id="closePictureDetail-' + element.id + '"]').on('click', function (e) {
                                        $('[id="pictureDetail-' + element.id + '"]').hide();
                                    });
                                }
                            }, this);
                            app.articlesView.renderArticles(slide, articles, false);
                            articles.forEach(function(element) {
                                if(element.articleType == 2){
                                    $('[id="pictureClick-' + element.id + '"]').show();
                                    $('[id="closePictureDetail-' + element.id + '"]').on('click', function (e) {
                                        $('[id="pictureDetail-' + element.id + '"]').hide();
                                    });
                                }
                            }, this);
                        });
                    }
                }
            });

            if (this.swiperCategories) {
                // If the categories slider is already loaded, link them together
                this.swiperArticles.params.control = this.swiperCategories;
                this.swiperCategories.params.control = this.swiperArticles;
            }
        }
    },

    renderTopArticles: function (slide, articles) {
        // Fill the top articles div and show the images when they are loaded
        slide.find('.topStories')
            .html(kendo.render(this.tplArticles, articles))
            .waitForImages(true)
            .progress(function () {
                $(this).css('visibility', '');
            });
    },

    renderArticles: function (slide, articles, append) {
        // Fill the articles div
        var loadMoreButton = slide.find('.recentArticles .buttonSeeMore');
        var html = '';

        if (!append) {
            loadMoreButton
                .data('page', 0)
                .prevAll()
                .remove();

            if (slide.data('id') == null) {
                html += '<h2 class="title">' + app.translations.texts.recent_news + '</h2>'
            }
        }

        html += kendo.render(this.tplArticles, articles);
        loadMoreButton.before(html)

        // Hide or show the "Load more" button
        loadMoreButton
            .data('page', loadMoreButton.data('page') + 1)
            .toggle(articles.length == app.webservices.articlesPageSize);

        // Show the images when they are loaded
        slide.find('.recentArticles')
            .waitForImages(true)
            .progress(function () {
                $(this).css('visibility', '');
            });

        var cards = slide.find('.card');
        var tooltip = slide.find('.tooltipDate');

        var scroller = slide.find('[data-role=scroller]').data('kendoMobileScroller').scrollElement;
        scroller.bind('scroll', function (e) {
            if ($(slide.find('.card')[0]).offset().top > 85) {
                tooltip.hide();
                return;
            }

            tooltip.show();
            var pos = tooltip.offset().top;
            var activeItem = null;

            cards.each(function () {
                if (pos >= $(this).offset().top) {
                    activeItem = $(this);
                }
            });

            if (activeItem) {
                var date = activeItem.data('date');
                if (date) {
                    tooltip.text(moment(activeItem.data('date')).fromNow());
                } else {
                    tooltip.text(app.translations.texts.in_the_news);
                }
            } else {
                tooltip.hide();
            }
        });

        scroller.trigger('scroll');

    },

    loadMore: function (e) {
        e.preventDefault();

        app.analytics.trackEvent('User Action', 'Load More', $('.swiper-categories .swiper-slide-active').data('analytic-title'));

        app.mobileApp.showLoading();

        var btn = $(e.currentTarget);
        var slide = btn.closest('.swiper-slide');

        // Append new articles to the current slide
        app.webservices.getArticles(slide.data('id'), btn.data('page') * app.webservices.articlesPageSize, app.articlesView.mode != 'news').done(function (articles) {
            app.articlesView.renderArticles(slide, articles, true);
            articles.forEach(function(element) {
                if(element.articleType == 2){
                    $('[id="pictureClick-' + element.id + '"]').show();
                    $('[id="closePictureDetail-' + element.id + '"]').on('click', function (e) {
                        $('[id="pictureDetail-' + element.id + '"]').hide();
                    });
                }
            }, this);
            app.mobileApp.hideLoading();
        });
    },
});
