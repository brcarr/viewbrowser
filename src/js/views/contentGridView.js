/*jslint nomen: true */
var define, console;
define([
    'underscore',
    'jquery',
    'core',
    'controls',
    'template!../../content/filterTemplate.html',
    './navigationView',
    '../../utility/filterFields',
    '../../utility/viewColumns',
    'template!../../content/cardView.html',
    'template!../../content/listView.html',
    './formatter'
], function (_, $, Core, Controls, FilterTemplate, NavigationView, FilterFields, ViewColumns, CardTemplate, ListTemplate, Formatter) {
    'use strict';

    function formatDates(value) {
        return Core.Dates.format(value, {date: 'long'});
    }
    
    return Core.View.extend({
        className: 'content-view',
        
        //When no view is selected, display an alert telling user to select a view
        noViewSelected: function () {
            var alert = new Controls.Alert({
                message: Core.Strings.translate('viewbrowser.alerts.noViewSelected'),
                type: 'info',
                showCloseButton: false
            });
            alert.getElement().prependTo(this.element); // Would like to have this render into .filter-group
            alert.show();
        },
        
        //Set view display type of grid
        setDisplayType: function (options) {
            this.grid.setOptions({displayType: this.getDisplayType(options)});
        },
        
        renderContentGrid: function (item) {
            var viewCat, viewId, view, gridElement, columns, rows, displayType, eventName, i;
            viewCat = item.selectedViewCat;
            viewId = item.selectedViewId;
            view = item.viewCollection.models.filter(function (model) {
                return model.id === viewId;
            })[0];
            
            columns = item.columns;
            rows = item.rows;
            
            gridElement = document.createElement('div');
            this.element.appendChild(gridElement);

            this.grid = new Controls.Grid(gridElement, columns, rows, {
                useMultiSelection: false,
                displayType: this.getDisplayType(displayType),
                createCardItem: function (row) {
                    var cardData = Formatter.format(row, columns, viewCat);
                    return $(CardTemplate.render(cardData));
                },
                createListItem: function (row) {
                    var cardData = Formatter.format(row, columns, viewCat);
                    return $(ListTemplate.render(cardData));
                }
            });

            // automatically resize columns to fit width
            this.grid.onLoaded(function () {
                for (i = 0; i < columns.length; i += 1) {
                    this.grid.resizeColumnToFit(i);
                }
            }.bind(this));
        },
        
        render: function (item) {
            this.$element.empty();
            var renderMe = (item) ? this.renderContentGrid(item) : this.noViewSelected();
        },
        
        // Function that returns the currently selected display type
        getDisplayType: function (displayType) {
            if (displayType !== 'grid') {
                return displayType;
            }
        }
    });
});