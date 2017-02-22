/*jslint nomen: true */
var define, console;
define([
    'underscore',
    'core',
    './views/mainView',
    'psw-framework-application-context'
], function (_, Core, MainView, ApplicationContext) {
    'use strict';
    
    return Core.Module.extend({
        mainView: null,
        path: 'viewbrowser',
        urlParts: null,
        
        icon: {
            className: 'icon-app_plan',
            text: Core.Strings.translate('viewbrowser.title')
        },
        
        routes: {
            '': function () {
                Core.Location.navigate(this.path + '/view', {
                    replace: true
                });
            },
            'view': 'runView',
            'view/:id': 'runView'
        },
       
        connected: function () {
            this.mainView = this.mainView || new MainView({
                //mainView: this.mainView,
                path: this.path,
                urlParts: this.urlParts
            });
            this.$element.html(this.mainView.render().$element);
            
            // Listener used for application context change events
            this.listenTo(ApplicationContext.Manager, 'change:context', function (change) {
                this.mainView.contextDocSearch(change);
            });
        },
        
        // Run view based on current URL
        runView: function (viewId) {
            var viewObj = {
                id: viewId,
                groupName: 'DOCUMENT'
            };
            this.mainView.navigateToView(viewObj); // This would have to change to not be hardcoded to 'DOCUMENT'
        }
    });
});