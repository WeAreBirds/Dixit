'use strict';

app.privateSuccessView = kendo.observable({
    onInit: function () {
        app.privateSuccessView.set('translations', app.translations);
    }
});