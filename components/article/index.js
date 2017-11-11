'use strict';

app.articleView = kendo.observable({
    article: {
        id: null,
        image: '',
        gallery: []
    },
    showMoreInfo: false,
    relatedArticles: [],
    swiperGallery: null,

    onInit: function () {
        // Translate the view
        app.articleView.set('translations', app.translations);
        app.articleView.translations.bind('change', function (e) {
            if (e.field == 'selectedLanguage') {
                app.articleView.article = {
                    id: null,
                    image: ''
                };
            }

        });
        $(document).on('click', '#articleView .card', function (e) {
            e.preventDefault();
            app.mobileApp.navigate('components/article/view.html?id=' + $(e.currentTarget).data('id'), 'slide');
        });
        $('#sendComment').on("click", function (e) {
            e.preventDefault();
            app.mobileApp.showLoading();
            var articleId = app.articleView.article.id;
            var articleName = app.articleView.article.title;
            var commentName = $("#commentName").val();
            var commentEmail = $("#commentEmail").val();
            var commentMessage = $("#commentMessage").val();
            if (!articleId || !commentName || !commentEmail || !commentMessage) {
                app.mobileApp.hideLoading();
                $('.errorPopup').fadeIn();
                setTimeout(function () {
                    $('.errorPopup').fadeOut();
                }, 2000);
            } else {
                app.webservices.saveComment(articleId, articleName, commentName, commentEmail, commentMessage, '')
                    .done(function (result) {
                        if (result.ResultCode == 200) {
                            $('.confirmPopup').fadeIn();
                            setTimeout(function () {
                                $('.confirmPopup').fadeOut();
                            }, 1500);
                            $("#commentName, #commentEmail, #commentMessage").val('');
                        } else {
                            alert(app.translations.texts.error);
                        }
                    }).always(function () {
                        app.mobileApp.hideLoading();
                    });
            }
        });
    },

    /*replyComment: function (e) {
        var elm = $(e.currentTarget);
        var commentId = elm.data('comment-id');

        //console.log(commentId);
        $('.answerLink[data-comment-id=' + commentId + ']').hide();
        $('#reply-' + commentId).appendTo($('#comment-' + commentId)).show();
        $('#sendComment-' + commentId).on("click", function (e) {
            e.preventDefault();
            var articleId = app.articleView.article.id;
            var articleName = app.articleView.article.title;
            var commentName = $("#commentName-" + commentId).val();
            var commentEmail = $("#commentMail-" + commentId).val();
            var commentMessage = $("#commentMessage-" + commentId).val();
            var commentRelatedId = commentId;
            if (!articleId || !commentName || !commentEmail || !commentMessage || !commentRelatedId) {
                app.mobileApp.hideLoading();
                $('.errorPopup').fadeIn();
                setTimeout(function () {
                    $('.errorPopup').fadeOut();
                }, 1500);
            } else {
                app.webservices.saveComment(articleId, articleName, commentName, commentEmail, commentMessage, commentRelatedId)
                    .done(function (result) {
                        if (result.ResultCode == 200) {
                            $('#reply-' + commentId).hide();
                            
                            $('#sendCommentConfirm-' + commentId).fadeIn();
                            setTimeout(function () {
                                $('#sendCommentConfirm-' + commentId).fadeOut();
                            }, 1500);
                            $('.answerLink[data-comment-id=' + commentId + ']').show();
                        } else {
                            alert(app.translations.texts.error);
                        }
                    }).always(function () {
                        app.mobileApp.hideLoading();
                    });
            }
        });

    },*/

    onShow: function (e) {
        // Scroll to top
        e.view.scroller.reset();
        $('iframe').attr('src', $('iframe').attr('src'));
        if (e.view.params.id != app.articleView.article.id) {
            if ((app.articleView.swiperGallery !== null) && app.articleView.swiperGallery.destroy) {
                app.articleView.swiperGallery.destroy(true, true);
                app.articleView.swiperGallery = null;
            }

            var content = $('#articleView').find('[data-role=content],[data-role=footer]');

            // Hide content and show loading indicator
            content.css('visibility', 'hidden');
            app.mobileApp.showLoading();

            // Get the article details
            app.webservices.getArticle(e.view.params.id)
                .done(function (article) {

                    if (article.externalContent || article.internalContent) {
                        app.articleView.set('showMoreInfo', true);
                    } else {
                        app.articleView.set('showMoreInfo', false);
                    }
                    var mail = article.contactEmail;
                    if (mail == "") {
                        mail = 'dixit.bnpparibasfortis.com';
                    }
                    $('#contactButton').attr("href", "mailto:" + mail);
                    app.webservices.getComments(article.id)
                        .done(function (comments) {
                            app.articleView.set('comments', comments);
                            $('*[id=replyComment]').on("click", function (e) {
                                var commentId = $(this).closest('div').attr('id');
                                $('.answerLink[data-comment-id=' + commentId + ']').hide();
                                $('#reply-' + commentId).show();
                                $('#sendComment-' + commentId).on("click", function (e) {
                                    e.preventDefault();
                                    var articleId = app.articleView.article.id;
                                    var articleName = app.articleView.article.title;
                                    var commentName = $("#commentName-" + commentId).val();
                                    var commentEmail = $("#commentMail-" + commentId).val();
                                    var commentMessage = $("#commentMessage-" + commentId).val();
                                    var commentRelatedId = commentId;
                                    if (!articleId || !commentName || !commentEmail || !commentMessage || !commentRelatedId) {
                                        app.mobileApp.hideLoading();
                                        $('.errorPopup').fadeIn();
                                        setTimeout(function () {
                                            $('.errorPopup').fadeOut();
                                        }, 1500);
                                    } else {
                                        app.webservices.saveComment(articleId, articleName, commentName, commentEmail, commentMessage, commentRelatedId)
                                            .done(function (result) {
                                                if (result.ResultCode == 200) {
                                                    $('#reply-' + commentId).hide();
                                                    $('#sendCommentConfirm-' + commentId).fadeIn();
                                                    setTimeout(function () {
                                                        $('#sendCommentConfirm-' + commentId).fadeOut();
                                                    }, 1500);
                                                    $('.answerLink[data-comment-id=' + commentId + ']').show();
                                                } else {
                                                    alert(app.translations.texts.error);
                                                }
                                            }).always(function () {
                                                app.mobileApp.hideLoading();
                                            });
                                    }
                                });
                            });
                        }).always(function () {
                            // Hide loading indicator
                            app.mobileApp.hideLoading();
                        });
                    app.cache.setArticleDetailUrl(article.url);
                    app.articleView.set('article', article);

                    // Show content
                    content.css('visibility', '');

                    // Get related articles
                    app.webservices.getRelatedArticles(article.id).done(function (articles) {
                        app.articleView.set('relatedArticles', articles);
                        app.articleView.set('hasRelatedArticles', articles.length > 0);
                    });

                    app.analytics.trackPage('Article : ' + app.articleView.article.analyticTitle);
                })
                .always(function () {
                    // Hide loading indicator
                    app.mobileApp.hideLoading();
                });
        } else {
            app.analytics.trackPage('Article : ' + app.articleView.article.analyticTitle);
        }
    },

    like: function (e) {
        e.preventDefault();
        e.stopPropagation();

        var elm = $(e.currentTarget);
        if (!elm.hasClass('active')) {
            app.mobileApp.showLoading();

            app.analytics.trackEvent('User Action', 'Like', elm.data('analytic-title'));
            app.webservices.likeArticle(elm.attr('data-id'))
                .done(function () {
                    // Add the active class and increase the counter
                    elm.addClass('active');
                    var counterElm = elm.find('span');
                    counterElm.text(parseInt(counterElm.text()) + 1);
                })
                .always(function () {
                    // Hide loading indicator
                    app.mobileApp.hideLoading();
                });
        }
    },

    answer: function (e) {
        e.preventDefault();
        e.stopPropagation();

        var elm = $(e.currentTarget);

        app.mobileApp.showLoading();

        app.webservices.answerSurvey(elm.data('article-id'), elm.data('id'), elm.val())
            .done(function () {
                app.articleView.set('article.showSurveyAnswers', false);
                app.articleView.set('article.showSurvey', true);
            })
            .always(function () {
                // Hide loading indicator
                app.mobileApp.hideLoading();
            });
    },

    onGalleryLoaded: function () {
        // Create the gallery slider
        this.swiperGallery = new Swiper('#articleView .swiper-container', {
            loop: true,
            pagination: '.swiper-pagination'
        });
    },

    videoFullscreen: function () {
        var elm = $('.article-video iframe');

        elm.setAttribute('allowfullscreen');
    }
});