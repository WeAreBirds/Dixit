'use strict';

app.privatePasswordView = kendo.observable({
    onInit: function () {
        app.privatePasswordView.set('translations', app.translations);

        $("#password").val('');
        var form = $("#validateUserForm");
        form.on("submit", function (e) {
            e.preventDefault();
            var password = $("#password").val();
            app.storage.getItem('userInfo', function (user) {
                var userId = JSON.parse(user).userId;
                if (userId) {
                    app.mobileApp.showLoading();
                    app.webservices.validateUser(userId, password)
                        .done(function (result) {
                            if (result.ResultCode == 200) {
                                if (result.Result == true) {
                                    $("#labelPasswordError").css("display", "none");
                                    app.mobileApp.navigate('components/privateSuccess/view.html');
                                } else {
                                    lscache.set("refreshData", false);
                                    $("#labelPasswordError").css("display", "block");
                                }
                            } else {
                                alert(app.translations.texts.error);
                            }
                        }).always(function () {
                            app.mobileApp.hideLoading();
                        });
                } else {
                    app.mobileApp.navigate('components/privateLogin/view.html');
                }
            });

        });
    }
});