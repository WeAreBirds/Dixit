'use strict';

$(function () {
    kendo.data.binders.categoryclass = kendo.data.Binder.extend({
        refresh: function () {
            var data = this.bindings['categoryclass'].get();
            $(this.element).attr('class', 'category ' + data);
        }
    });

    kendo.data.binders.date = kendo.data.Binder.extend({
        init: function (element, bindings, options) {
            kendo.data.Binder.fn.init.call(this, element, bindings, options);

            this.dateformat = $(element).data('dateformat');
        },
        refresh: function () {
            var data = this.bindings['date'].get();
            if (data) {
                $(this.element).text(moment(data).format(this.dateformat));
            }
        }
    });

    kendo.data.binders.percentbar = kendo.data.Binder.extend({
        refresh: function () {
            var data = this.bindings['percentbar'].get();
            $(this.element).css('width', data + '%');
        }
    });
});
