'use strict';

(function() {
    var app = {
        mobileApp: null
    };
    
    window.app = app;

    function bootstrap() {
        $(function () {
            // Initialize the translation object
            app.translations.init();
            
            // Initialize the push object
            app.push.init();

            // Initialize the webservices helper object
            app.webservices.init();

            // Create the application and load the initial view
            app.mobileApp = new kendo.mobile.Application(document.body, {
                skin: 'nova',
                initial: 'components/articles/view.html'
            });
        });
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function() {
            app.storage.getItem('userInfo', function (user) 
            {
                app.storage.getItem('userLoginReminder', function(userLoginReminder){
                    if (user) {
                        if(userLoginReminder && userLoginReminder != -1)
                        {
                            app.storage.removeItem('userLoginReminder');
                        }
                    }else{
                        if(userLoginReminder)
                        {
                            if(userLoginReminder != -1)
                            {
                                var incremented = parseInt(userLoginReminder) + 1;
                                app.storage.setItem('userLoginReminder', incremented);
                                if(incremented % 20 == 0)
                                {
                                    $('.popupLogin').show();
                                }
                            }
                        }else{
                            app.storage.setItem('userLoginReminder', 1);
                        }
                    }
                });
            });
            navigator.splashscreen.show();
            window.setTimeout(function () {
                navigator.splashscreen.hide();
            }, 1500);

            bootstrap();
        }, false);
    } else {
        bootstrap();
    }
}());