(function () {
    var Searchbar = kendo.ui.Widget.extend({
        inputElm: null,

        init: function (element, options) {
            kendo.ui.Widget.fn.init.call(this, element, options);

            this.inputElm = this.element.find('input[type=text]');

            this.inputElm.on('keypress', this.onKeypress.bind(this));
            this.inputElm.on('blur', this.onBlur.bind(this));
            this.element.on('submit', this.onSubmit.bind(this));

            // Translate the view
            kendo.bind(this.inputElm, app.translations);
        },

        options: {
            name: 'Searchbar'
        },

        show: function () {
            this.element.fadeIn('fast');
            this.inputElm.focus();
        },

        hide: function () {
            this.element.fadeOut('fast');
        },

        onKeypress: function (e) {
            if (e.which == 13) {
                this.element.submit();
                return false;
            }
        },

        onBlur: function () {
            if (this.element.data('blur') != 'no') {
                this.hide();
            }
        },

        onSubmit: function (e) {
            e.preventDefault();

            var value = $.trim(this.inputElm.val());

            if (value) {
                app.mobileApp.navigate('components/search/view.html?search=' + value, this.element.data('blur') != 'no' ?'slide' : '');
            }
        },

        destroy: function () {
            this.element.off('submit', this.onSubmit);
            this.inputElm.off('blur', this.onBlur);
            this.inputElm.off('keypress', this.onKeypress);
        }
    });

    kendo.ui.plugin(Searchbar);
})(jQuery);