var define;
define(['core'], function (Core) {
    'use strict';

    var ViewResultModel = Core.IntegrationServerModel.extend({
        initialize: function (args) {
            this.viewId = args;
        },

        fetch: function (options) {
            options = options || {};
            options.type = 'POST';
            options.data = JSON.stringify({
                "vslText": ""
            });
            Core.IntegrationServerModel.prototype.fetch.call(this, options);
        }
    });
    return ViewResultModel;
});