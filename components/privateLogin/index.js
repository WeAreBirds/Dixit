'use strict';

app.privateLoginView = kendo.observable({
    onShow: function () {
        $('iframe').attr('src', $('iframe').attr('src'));
        app.storage.getItem('userInfo', function (user) {
            if (user) {
                var userId = JSON.parse(user).userId;
                var userPassword = JSON.parse(user).userPassword;
                app.mobileApp.showLoading();
                app.webservices.userValidationDate(userId, userPassword)
                    .done(function (result) {
                        if (result.ResultCode == 200) {
                            if (result.ValidationDate) {
                                var arr = result.ValidationDate.split(/\/|\s|:/);
                                var validationDate = new Date(arr[2], arr[1], arr[0], arr[3], arr[4], arr[5]);
                                validationDate.setMonth(validationDate.getMonth() - 1);
                                var today = new Date();
                                if (today < validationDate) {
                                    app.cache.setIsUserLogged(true);
                                    app.mobileApp.navigate('components/privateSuccess/view.html');
                                } else {
                                    app.cache.setIsUserLogged(false);
                                    app.storage.removeItem("userInfo", function () {
                                        app.webservices.init();
                                    });
                                }
                            }
                        } else {
                            alert(app.translations.texts.error);
                        }
                    }).always(function () {
                        app.mobileApp.hideLoading();
                    });
            }
        });
        $("#mailDropDown label").click( function(){
            $("#mailDropDown label").removeClass("active");
            $(this).addClass("active");
        });
    },
    onInit: function () {
        app.privateLoginView.set('translations', app.translations);

        $("#email").val('');
        /*$('#email').on('input', function (e) {
            var lastChar = $('#email').val().slice(-1);
            if (lastChar == '@') {
                var mailDropDown = $('#mailDropDown');
                mailDropDown.css('display','block');
                $('#mails').focus().click();
            }
        });*/
        var form = $("#createUserForm");
        form.on("submit", function (e) {
            e.preventDefault();
            var mail = $("#email").val();
            mail = mail.replace(/\s/g, "");
            mail = mail.toLowerCase();
            var domain = $('input[name=domainName]:checked', '#createUserForm').val();
            if (!mail || !domain) {
                $("#labelError").css("display", "block");
                $("#formInput").addClass("error");
            } else {
                $("#labelError").css("display", "none");
                $("#formInput").removeClass("error");
                app.mobileApp.showLoading();
                var fullMail = mail + domain;
                app.webservices.createUser(fullMail)
                    .done(function (result) {
                        if (result.ResultCode == 200 && result.UserId) {
                            var userInfo = { 'userId': result.UserId, 'userPassword': '' };
                            app.storage.setItem('userInfo', JSON.stringify(userInfo));
                            app.mobileApp.navigate('components/privatePassword/view.html');
                        } else {
                            alert(app.translations.texts.errorNames);
                        }
                    }).always(function () {
                        app.mobileApp.hideLoading();
                    });
            }
        });
    },
    dropDown: function dropDown() {
        $("#mails").kendoDropDownList();
    }
});


