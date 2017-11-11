(function () {
    var Repeater = kendo.ui.Widget.extend({
        init: function (element, options) {
            this.wrapper = [element];

            kendo.ui.Widget.fn.init.call(this, element, options);

            this.template = kendo.template(this.options.template || '<p><strong>#= data #</strong></p>');

            this._dataSource();
        },

        events: ['dataBinding', 'dataBound'],

        items: function () {
            if (this.options.itemsSelector == '') {
                return this.element.children();
            }

            return this.element.find(this.options.itemsSelector);
        },

        setDataSource: function (dataSource) {
            // Set the internal datasource equal to the one passed in by MVVM
            this.options.dataSource = dataSource;

            // Rebuild the datasource if necessary, or just reassign
            this._dataSource();
        },

        options: {
            name: 'Repeater',
            autoBind: true,
            template: '',
            itemsSelector: ''
        },

        _dataSource: function () {
            // Returns the datasource OR creates one if using array or configuration object
            this.dataSource = kendo.data.DataSource.create(this.options.dataSource);

            if (this.dataSource && this._refreshHandler) {
                this.dataSource.unbind('change', this._refreshHandler);
            } else {
                this._refreshHandler = $.proxy(this.refresh, this);
            }

            // Bind to the change event to refresh the widget
            this.dataSource.bind('change', this._refreshHandler);

            if (this.options.autoBind) {
                this.dataSource.fetch();
            }
        },

        refresh: function () {
            this.trigger('dataBinding');

            // Destroy widgets
            kendo.destroy(this.element.children());

            // Update repeater content
            this.element.html(kendo.render(this.template, this.dataSource.view()));

            // Initialize widgets
            kendo.mobile.init(this.element);

            this.trigger('dataBound');
        }
    });

    kendo.ui.plugin(Repeater);
})(jQuery);