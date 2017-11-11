'use strict';

app.searchView = kendo.observable({
    search: '',
    tplArticles: null,
    mode: 'keyword',

    onInit: function () {
        // Translate the view
        app.searchView.set('translations', app.translations);
        app.searchView.translations.bind('change', function (e) {
            if ((e.field == 'selectedLanguage') && app.searchView.search) {
                app.searchView.resetData();
                app.searchView.loadData();
            }
        });

        app.searchView.tplArticles = kendo.template($('#searchViewArticlesTemplate').html());

        $('#searchView').on('click', '.card', function (e) {
            e.preventDefault();

            app.mobileApp.navigate('components/article/view.html?id=' + $(e.currentTarget).data('id'), 'slide');
        });
    },

    onShow: function (e) {
        $('iframe').attr('src', $('iframe').attr('src'));
        var mode = 'keyword';
        if (e.view.params.mode) {
            mode = e.view.params.mode;
        }

        if (((app.searchView.search != e.view.params.search) || (app.articlesView.mode != mode)) && e.view.params.search) {
            app.mobileApp.showLoading();

            app.searchView.set('mode', mode);
            app.searchView.set('search', e.view.params.search);

            if (mode == 'keyword') {
                $('#searchView .searchBar input[type=text]').val(e.view.params.search);
                $('#searchView .searchBar')
                    .data('blur', 'no')
                    .show();
                $('#searchView .searchButton').hide();
            } else {
                $('#searchView .searchBar')
                    .data('blur', 'yes')
                    .hide();
                $('#searchView .searchButton').show();
                app.searchView.set('tagTitle', e.view.params.tag);
            }

            app.searchView.resetData();
            app.searchView.loadData();
        }

        if (mode == 'keyword') {
            app.analytics.trackEvent('User Action', 'Search', app.searchView.search);
        } else {
            app.analytics.trackEvent('User Action', 'Search', 't:' + e.view.params.tag);
        }

        app.analytics.trackPage('Search');
    },

    resetData: function () {
        app.mobileApp.showLoading();

        $('#searchView [data-role=repeater]').html('');
    },

    loadData: function () {
        if (this.mode == 'tag') {
            app.webservices.searchArticlesByTag(app.searchView.search)
                .done(function (articles) {
                    if(articles.length > 0){
                        $('#noResults').css("display", "none");
                    }else{
                        $('#noResults').css("display", "block");
                    }
                    app.searchView.renderArticles(articles, false);

                    app.mobileApp.hideLoading();
                });
        } else {
            app.webservices.searchArticles(app.searchView.search)
                .done(function (articles) {
                    if(articles.length > 0){
                        $('#noResults').css("display", "none");
                    }else{
                        $('#noResults').css("display", "block");
                    }
                    app.searchView.renderArticles(articles, false);

                    app.mobileApp.hideLoading();
                });
        }
    },

    onArticlesLoaded: function () {
        $('#searchView [data-role=repeater]').waitForImages(true)
            .progress(function () {
                $(this).css('visibility', '');
            });
    },

    renderArticles: function (articles, append) {
        // Fill the articles div
        var loadMoreButton = $('#searchView .recentArticles .buttonSeeMore');
        var html = '';

        if (!append) {
            loadMoreButton
                .data('page', 0)
                .prevAll()
                    .remove();

            if (this.mode == 'tag') {
                html += '<h2 class="title">#' + this.tagTitle + '</h2>'
            }
        }

        html += kendo.render(this.tplArticles, articles);
        loadMoreButton.before(html)

        // Hide or show the "Load more" button
        loadMoreButton
            .data('page', loadMoreButton.data('page') + 1)
            .toggle(articles.length == app.webservices.articlesPageSize);

        // Show the images when they are loaded
        $('#searchView .recentArticles')
            .waitForImages(true)
                .progress(function () {
                    $(this).css('visibility', '');
                });
    },

    loadMore: function (e) {
        e.preventDefault();

        app.mobileApp.showLoading();

        var btn = $(e.currentTarget);

        // Append new articles
        if (this.mode == 'tag') {
            app.webservices.searchArticlesByTag(app.searchView.search, btn.data('page') * app.webservices.articlesPageSize).done(function (articles) {
                app.searchView.renderArticles(articles, true);

                app.mobileApp.hideLoading();
            });
        } else {
            app.webservices.searchArticles(app.searchView.search, btn.data('page') * app.webservices.articlesPageSize).done(function (articles) {
                app.searchView.renderArticles(articles, true);

                app.mobileApp.hideLoading();
            });
        }
    }
});
