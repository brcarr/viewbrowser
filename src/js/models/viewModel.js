var define;
define(['core', './viewResultCollection'], function (Core, ViewResultCollection) {
    "use strict";

    var ViewModel = Core.IntegrationServerModel.extend({
        initialize: function () {
            this.viewResults = new ViewResultCollection(this.get('id'), this.get('category'));
        },
        
        url: function () {
            return '/view/' + this.get('id') + '/?category=' + this.get('category');
        }
    });
    
    // look at adding url function here similar to ViewResultsCollection
    // (won't need /results at the end of it)

    return ViewModel;
});