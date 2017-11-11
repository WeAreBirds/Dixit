'use strict';

app.webservices = {
    //privateMode: false,
    //privateToken: '6f3c15c2-1a36-4a90-8f99-ec364fd4d13a',
    //prefix: 'http://dixit.tld/restapi/',
    //prefix: 'http://dixit.qabnpparibasfortis.be/restapi/',
    prefix: 'https://dixit.bnpparibasfortis.be/restapi/',

    version: 'V3',

    newsPosition: 3,
    articlesPageSize: 10,
    cacheExpiration: 5, // Minutes

    events: [],

    init: function () {
        app.storage.getItem('userInfo', function (user) {
            if (user) {
                app.cache.setIsUserLogged(true);
                $.ajaxSetup({
                    data: { isMobile: true, UserId: JSON.parse(user).userId, UserPassword: JSON.parse(user).userPassword }
                });
            } else {
                app.cache.setIsUserLogged(false);
                $.ajaxSetup({
                    data: { isMobile: true }
                });
            }
        });
    },

    getRequestHash: function () {
        var params = arguments[0];

        if (arguments.length > 1) {
            params += JSON.stringify(arguments[1]);
        }

        return murmurhash3_32_gc(params);
    },

    getCachedJSON: function () {
        // Hash the request parameters (url + options)
        var hash = this.getRequestHash.apply(this, arguments);
        // Check if the request is cached
        var cachedData = lscache.get('json_' + hash);
        if (true || !cachedData) {
            // Call the webservice
            return this.getJSON.apply(this, arguments)
                .then(function (response) {
                    // Save the response to the cache
                    lscache.set('json_' + hash, response, app.webservices.cacheExpiration);
                    return response;
                });
        }

        // Return the cached data
        return $.Deferred().resolve(cachedData);
    },

    getJSON: function () {
        var _this = this;
        var args = arguments;

        var deferred = $.Deferred();

        (function makeRequest() {
            $.getJSON.apply(this, args)
                .done(deferred.resolve)
                .fail(function () {
                    //alert(app.translations.texts.plz_connect);

                    makeRequest(this);
                });
        }());
        return deferred.promise();
    },

    post: function () {
        var _this = this;
        var args = arguments;

        var deferred = $.Deferred();

        (function makeRequest() {
            $.post.apply(this, args)
                .done(deferred.resolve)
                .fail(function () {
                    //alert(app.translations.texts.plz_connect);

                    makeRequest(this);
                });
        }());
        return deferred.promise();
    },

    getArticlesCategories: function () {
        return this.getCachedJSON(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/categories')
            .then(function (response) {
                return app.dataTransformer.categories(response.SearchResults.ListCategories);
            });
    },

    getProfessionCategories: function () {
        return this.getCachedJSON(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/works')
            .then(function (response) {
                return app.dataTransformer.professionCategories(response.SearchResults.ListWorks);
            });
    },

    getTopArticles: function (catId, isProfession) {
        var options = {
            IndexName: 'article-search',
            Skip: 0,
            Take: 4,
            TopArticles: true
        };
        if (catId) {
            options.Take = 1;
            if (isProfession) {
                options.searchWorks = catId;
            } else {
                options.CategoryId = catId;
            }
        }

        return this.getCachedJSON(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/search', options)
            .then(function (response) {
                if (response.ResultCode == 206) {
                    app.webservices.userExpired();
                }
                return app.dataTransformer.topArticles(response.SearchResults.ListArticles);
            });
    },

    searchArticles: function (search, page) {
        var options = {
            IndexName: 'article-search',
            Skip: page,
            Take: this.articlesPageSize,
            Keyword: search
        };

        return this.getCachedJSON(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/search', options)
            .then(function (response) {
                if (response.ResultCode == 206) {
                    app.webservices.userExpired();
                }
                return app.dataTransformer.articles(response.SearchResults.ListArticles);
            });
    },

    searchArticlesByTag: function (tagId, page) {
        var options = {
            IndexName: 'article-search',
            Skip: page,
            Take: this.articlesPageSize,
            selectedTag: tagId
        };

        return this.getCachedJSON(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/search', options)
            .then(function (response) {
                if (response.ResultCode == 206) {
                    app.webservices.userExpired();
                }
                return app.dataTransformer.articles(response.SearchResults.ListArticles);
            });
    },

    getArticles: function (catId, page, isProfession) {
        var options = {
            IndexName: 'article-search',
            Skip: page,
            Take: this.articlesPageSize,
            ExcludeTops: true
        };

        if (catId) {
            if (isProfession) {
                options.searchWorks = catId;
            } else {
                options.CategoryId = catId;
            }
        }
        return this.getCachedJSON(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/search', options)
            .then(function (response) {
                if (response.ResultCode == 206) {
                    app.webservices.userExpired();
                }
                return app.dataTransformer.articles(response.SearchResults.ListArticles);
            });
    },

    getArticle: function (articleId) {
        var deferred = $.Deferred();
        var options = {
            ArticleId: articleId
        };
        this.getCachedJSON(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/detail', options)
            .then(function (response) {
                if (response.ResultCode == 206) {
                    app.webservices.userExpired();
                }
                app.dataTransformer.article(response.SearchResult.Article).then(function (response) {
                    deferred.resolve(response);
                })
            });

        return deferred;
    },

    getComments: function (articleId) {
        var deferred = $.Deferred();
        var options = {
            IndexName: 'comment-search',
            ArticleId: articleId
        };
        return this.getCachedJSON(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/comment', options)
            .then(function (response) {
                return app.dataTransformer.comments(response.SearchResults.ListComments);
            });
    },

    getRelatedArticles: function (articleId) {
        var options = {
            IndexName: 'article-search',
            ArticleId: articleId,
            Skip: 0,
            Take: 3
        };

        return this.getCachedJSON(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/related', options)
            .then(function (response) {
                if (response.ResultCode == 206) {
                    app.webservices.userExpired();
                }
                return app.dataTransformer.relatedArticles(response.SearchResults.ListArticles);
            });
    },
    getLastVideoArticles:function(){
        var options = {
            IndexName: 'article-search',
            ArticleTypes: 1
        };
        return this.getCachedJSON(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/search', options)
        .then(function (response) {
            
            if (response.ResultCode == 206) {
                app.webservices.userExpired();
            }
            return app.dataTransformer.articles(response.SearchResults.ListArticles);
        });
    },

    getEvents: function (year, month) {
        var options = {
            Year: year,
            Month: month,
            Skip: 0,
            Take: 0
        };
        return this.getCachedJSON(this.prefix + 'event/' + this.version + '/' + app.translations.selectedLanguage + '/filter', options)
            .then(function (response) {
                if (response.ResultCode == 206) {
                    app.webservices.userExpired();
                }
                app.webservices.events = app.dataTransformer.events(response.SearchResults.ListEvents);
                return app.webservices.events;
            });
    },

    getEvent: function (eventId) {
        var event = null;
        var deferred = $.Deferred();

        for (var i = 0; i < app.webservices.events.length; i++) {
            if (app.webservices.events[i].id == eventId) {
                event = app.dataTransformer.event($.extend(true, {}, app.webservices.events[i]));

                break;
            }
        }

        return deferred.resolve(event);
    },

    likeArticle: function (articleId) {
        var _this = this;
        var options = {
            ArticleId: articleId
        };

        return this.getJSON(this.prefix + 'article/' + this.version + '/articleLike', options)
            .done(function () {
                app.storage.getItem('likes', function (likes) {
                    if (likes === null) {
                        likes = [];
                    } else {
                        likes = JSON.parse(likes);
                    }

                    // Save likes we did locally
                    likes.push(articleId);
                    app.storage.setItem('likes', JSON.stringify(likes));

                    // Delete the cache for this article
                    for (var i = 0; i < app.translations.supportedLanguages.length; i++) {
                        lscache.setBucket(app.translations.supportedLanguages[i]);
                        var hash = _this.getRequestHash(_this.prefix + 'article/' + _this.version + '/' + app.translations.supportedLanguages[i] + '/detail', { ArticleId: articleId });
                        lscache.remove('json_' + hash);
                    }

                    lscache.setBucket(app.translations.selectedLanguage);
                });
            });
    },

    answerSurvey: function (articleId, surveyId, answerId) {
        var _this = this;
        var options = {
            SurveyId: surveyId,
            AnswerId: answerId
        };

        return this.getJSON(this.prefix + 'article/' + this.version + '/survey', options)
            .done(function () {
                app.storage.getItem('surveys', function (surveys) {
                    if (surveys === null) {
                        surveys = [];
                    } else {
                        surveys = JSON.parse(surveys);
                    }

                    // Save likes we did locally
                    surveys.push(surveyId);
                    app.storage.setItem('surveys', JSON.stringify(surveys));

                    // Delete the cache for this article
                    for (var i = 0; i < app.translations.supportedLanguages.length; i++) {
                        lscache.setBucket(app.translations.supportedLanguages[i]);
                        var hash = _this.getRequestHash(_this.prefix + 'article/' + _this.version + '/' + app.translations.supportedLanguages[i] + '/detail', { ArticleId: articleId });
                        lscache.remove('json_' + hash);
                    }

                    lscache.setBucket(app.translations.selectedLanguage);

                    app.analytics.trackEvent('Survey', 'Answer', surveyId);
                });
            });
    },

    saveComment: function(articleId, articleName, commentName, commentEmail, commentMessage, relatedCommentId){
        var options = {
            ArticleId: articleId,
            ArticleName: articleName,
            CommentName: commentName,
            CommentEmail: commentEmail,
            CommentMessage: commentMessage,
            RelatedCommentId: relatedCommentId,
        };
        return this.post(this.prefix + 'article/' + this.version + '/' + app.translations.selectedLanguage + '/comment?format=json', options)
        .done(function () { });
    },

    createUser: function (email) {
        var options = {
            Email: email
        };
        return this.post(this.prefix + 'user/' + this.version + '/' + app.translations.selectedLanguage + '/create?format=json', options)
            .done(function () { });
    },
    validateUser: function (userId, password) {
        var options = {
            UserId: userId,
            UserPassword: password
        };
        return this.post(this.prefix + 'user/' + this.version + '/' + app.translations.selectedLanguage + '/validate?format=json', options)
            .done(function () {
                var userInfo = { 'userId': userId, 'userPassword': password };
                app.storage.setItem('userInfo', JSON.stringify(userInfo));
                lscache.set("refreshData", true);
                app.webservices.init();
            });
    },
    userValidationDate: function (userId, password) {
        return this.post(this.prefix + 'user/' + this.version + '/' + app.translations.selectedLanguage + '/validationDate?format=json')
            .done(function () { });
    },
    userExpired: function () {
        app.storage.getItem('userInfo', function (user) {
            if (user) {
                alert(app.translations.texts.sessionExpired);
                app.storage.removeItem("userInfo", function () {
                    app.webservices.init();
                    app.cache.setIsUserLogged(false);
                });
            }
        });
        lscache.flush();
        lscache.set("refreshData", true);
    }
};
