/*jslint nomen: true */
var define, console;
define([
    'underscore',
    'core',
    'controls',
    '../models/viewCollection',
    '../../utility/propertyMap'
], function (_, Core, Controls, ViewCollection, PropertyMap) {
    'use strict';

    return Core.View.extend({
        className: 'nav-pane',
        selectedViewId: null,

        initialize: function (options) {
            this.viewCollection = options.collection;
            this.listenTo(this.viewCollection, 'sync', this.render);
        },
        
        // Render the navigation control in navigation pane
        render: function () {
            if (this.element && this.viewCollection.length) {
                this.items = this.createNavItems(this.viewCollection);
                this.navigation = new Controls.Navigation(document.createElement('div'), this.items, {groupBy: 'groupName'});
                this.navigation.on('open:item', this.onItemOpened, this);
                this.$element.append(this.navigation.getElement());
            }
            return this;
        },
        
        // Define details of view data (returned from View Collection) and format them for display in navigation pane
        createNavItems: function (data) {
            var navItems = [], i, navItemRoot, navItem, navItemCategory;
            for (i in data.models) {
                if (data.models.hasOwnProperty(i)) {
                    navItemRoot = data.models[i].attributes;
                    switch (navItemRoot.category) {
                    case 'DOCUMENT':
                        navItemCategory = 'icon-views';
                        break;
                    case 'WORKFLOW':
                        navItemCategory = 'icon-workflow';
                        break;
                    case 'FOLDER':
                        navItemCategory = 'icon-folder';
                        break;
                    case 'TASK':
                        navItemCategory = 'icon-tasks';
                        break;
                    }
                    navItem = {
                        id: navItemRoot.id,
                        name: navItemRoot.name,
                        description: navItemRoot.description,
                        groupName: navItemRoot.category,
                        iconClass: navItemCategory
                    };
                    navItems.push(navItem);
                }
            }
            return navItems;
        }.bind(this),

        
        // When a new navigation item is selected, update the UI and URL, then broadcast the change
        onItemOpened: function (e, item) {
            Core.Location.navigate(this.options.path + '/view/' + item.sourceItem.id, {replace: !this.options.isSmallForm});
            this.selectedViewId = item.sourceItem.id;
            this.selectView(item.sourceItem);
        },
        
        //Triggers change:selection in mainView.js
        selectView: function (item) {
            if (item.id !== this.selectedViewId) {
                this.selectedViewId = item.id;
            }
            this.trigger('change:selectedView', item);
        }
    });
});