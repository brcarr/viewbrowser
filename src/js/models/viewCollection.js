var define;
define(['core', './viewModel'], function (Core, ViewModel) {
    "use strict";

    return Core.IntegrationServerCollection.extend({
        url: function () {
            return '/view/';
        },

        model: ViewModel
    });
});