var define;
define([
    'core',
    'controls',
    'template!../../content/filterTemplate.html',
    '../../utility/filterFields'
], function (Core, Controls, FilterTemplate, FilterFields) {
    'use strict';
    
    return Core.View.extend({
        className: 'filter-group',
        
        domEvents: {
            'click .primary': 'filterView'
        },
        
        render: function (options) {
            this.viewId = options.selectedViewId;
            this.viewCat = options.selectedViewCat;
            this.viewCollection = options.viewCollection;
            
            // Get filter fields for view based on view category
            this.fields = FilterFields.getData(this.viewCat);
            this.$element.html(FilterTemplate.render(this.fields));
        },
        
        filterView: function () {
            // Assemble filterVialue string to be passed to mainView
            this.filterField = document.getElementById('field-select').value;
            this.filterOperator = document.getElementById('operator-select').value;
            this.filterValue = document.getElementById('filter-input').value;
            this.vslFilter = this.filterField + " " + this.filterOperator + " '" + this.filterValue + "'";
                
            // create object to pass back view category and viewId
            this.viewInfo = {
                viewId: this.viewId,
                viewCat: this.viewCat,
                vslText: this.vslFilter,
                viewCollection: this.viewCollection
            };
            
            //Trigger even to run filtered view
            this.trigger('toolbar:runFilteredView', this.viewInfo);
        }
        
    });
});