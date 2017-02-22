/*jslint nomen: true */
var define, console;
define([
    'underscore',
    'jquery',
    'core',
    'controls',
    'template!../../content/toolbarTemplate.html',
    './filterView'
], function (_, $, Core, Controls, ToolbarTemplate, FilterView) {
    'use strict';

    return Core.View.extend({
        className: 'toolbar-view',
        
        domEvents: {
            'click [data-action]': 'onAction',
            'deselect button[data-action]': 'onAction',
            'select button[data-action]': 'onAction'
        },
        
        initialize: function (options) {
            this.FilterView = options.FilterView || FilterView;
        },

        render: function (options) {
            this.$element.empty();
            this.element.innerHTML = ToolbarTemplate.render(options);
            this.toolbar = new Controls.Toolbar(this.element.querySelector('.toolbar-control'));
            return this;
        },

        onAction: function (e) {
            var eventName = (e.type === 'click') ? 'click:action' : 'toggle:action';

            this.trigger(eventName, {
                action: e.currentTarget.getAttribute('data-action'),
                value: e.currentTarget.getAttribute('data-value'),
                type: e.type
            }, e.currentTarget);
            
            if (e.currentTarget.getAttribute('data-value') !== 'navigation') {
                this.$element.find('.selected').removeClass('selected');
                e.currentTarget.classList.add('selected');
                this.displayType = e.currentTarget.getAttribute('data-view');
            }
        },
        
        loadFilterView: function (data) {
            this.filterView = new FilterView();
            this.listenTo(this.filterView, 'toolbar:runFilteredView', this.runFilteredView);
            var viewCat = data.selectedViewCat;
            this.filterView.render(data);
            this.$('.filter-group').replaceWith(this.filterView.element);
        },
        
        runFilteredView: function (options) {
            this.viewInfo = options;
            this.trigger('main:runFilteredView', this.viewInfo);
        }
    });
});