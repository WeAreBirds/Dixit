'use strict';

app.cache = kendo.observable({
    isUserLogged : false,
    articleDetailUrl : '',
    setIsUserLogged: function(isLogged){
        this.set('isUserLogged', isLogged);
    },
    setArticleDetailUrl: function(detialUrl){
        this.set('articleDetailUrl', detialUrl);
    }
});
