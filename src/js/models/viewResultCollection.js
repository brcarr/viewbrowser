var define;
define(['core', './viewResultModel'], function (Core, ViewResultsModel) {
    'use strict';

    return Core.IntegrationServerCollection.extend({
        initialize: function (id, category) {
            this.viewId = id;
            this.viewCategory = category;
        },

        url: function () {
            return '/view/' + this.viewId + '/result?category=' + this.viewCategory;
        },

        model: ViewResultsModel,

        fetch: function (options) {
            options.type = 'POST';
            Core.IntegrationServerCollection.prototype.fetch.call(this, options);
        },

        parse: function (data) {
            return data.resultRows;
        }
    });
});