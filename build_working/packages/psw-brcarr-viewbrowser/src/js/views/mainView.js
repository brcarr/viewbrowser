/*jslint nomen: true */
var define, console;
define([
    'jquery',
    'underscore',
    'core',
    'controls',
    './contentGridView',
    './navigationView',
    './toolbarView',
    '../models/viewCollection',
    'logger',
    'psw-framework-application-context',
    'psw-framework-notifications',
    '../../utility/propertyMap',
    'template!../../content/countCard.html',
    'template!../../content/previewLeftCard.html',
    './formatter'
], function ($, _, Core, Controls, ContentView, NavigationView, ToolbarView, ViewCollection, Logger, ApplicationContext, Notifications, PropertyMap, CountCardTemplate, PreviewLeftTemplate, Formatter) {
    'use strict';
    
    return Core.View.extend({
        selectedViewId: null,
        documents: null,
        className: 'main-view',
        
        initialize: function (options) {
            //Read config.json to get settings for contextDocSearch
            var packageSettings = Core.App.config.applicationContextSettings || {};
            this.applicationContextConfig = packageSettings.viewBrowser || {};
            this.contextSources = this.applicationContextConfig.contextSources || '';
            
            this.path = options.path;
            
            this.viewCollection = new ViewCollection();
            this.ContentView = ContentView;
            this.NavigationView = NavigationView;
            this.ToolbarView = ToolbarView;
            

            this.navigationView = new NavigationView({
                path: this.path,
                collection: this.viewCollection
            });
            
            this.listenTo(this.navigationView, 'change:selectedView', this.navigateToView, this);
            this.on('error', this.onControllerError);
            this.$alertElement = $('<div/>').addClass('alert-container');
            this.alertContainer = new Controls.AlertContainer(this.$alertElement);
            
            //After initializing mainView, loadViews()
            this.loadViews();
        },
        
        onControllerError: function (error) {
            var alertOptions = {
                message: error.message + " " + error.serverMessage,
                type: 'error'
            };
            this.alertContainer.showAlert(alertOptions);
        },
        
        
        // Get list of views from viewCollection and set items on Collection View of Navigation control
        loadViews: function () {
            this.viewCollection.fetch({
                error: function (model, response, options, error) {
                    this.trigger('error', error);
                }.bind(this)
            });
        },
        
        //Function to navigate to a selected view
        navigateToView: function (item, filter) {
            if (!item) { return; }
            
            //Set view properties for this
            this.selectedViewId = item.id;
            this.selectedViewCat = item.groupName;
            if (filter) {
                this.vslFilter = filter;
            }
            
            //Ensure that viewCollection has been synced before proceeding
            if (!this.viewCollection.length) {
                this.viewCollection.once('sync', _.bind(function () { this.navigateToView(item, this.vslFilter); }, this));
                return;
            }
            
            //Load view once viewCollection returns
            this.runView(this.selectedViewId, this.vslFilter);
            
            //Create this.viewInfo object that can be passed from mainView
            this.viewInfo = {
                selectedViewId: this.selectedViewId,
                selectedViewCat: this.selectedViewCat,
                viewCollection: this.viewCollection
            };
            
            //Update the URL based on selected view
            Core.Location.navigate(this.path + '/view/' + this.selectedViewId);
        
        },
        
        //Function to load viewResults from viewCollection
        runView: function (options, vslFilter, callback) {
            var viewId, viewCat, view, viewCollection, vslText;
            
            // Determine where request is coming from.
            if (typeof options === 'object') {
                viewId = options.viewId;
                viewCat = options.viewCat;
                viewCollection = options.viewCollection;
                vslText = options.vslText;
                this.viewInfo.vslText = vslText;
            } else if (typeof options === 'string') {
                viewId = options;
                vslText = vslFilter;
                viewCat = 'DOCUMENT';
                viewCollection = this.viewCollection;
            } else {
                return;
            }

            view = viewCollection.models.filter(function (model) { return model.id === viewId; })[0];
            if (view) {
                view.viewResults.fetch({
                    data: JSON.stringify({
                        'vslText': vslText
                    }),
                    success: function () {
                        //var documents = this.getDocumentsFromViewResults(view, callback);
                        view.fetch({
                            id: this.selectedViewId,
                            category: this.selectedViewCat,
                            success: function (data) {
                                //this.viewInfo.columns = data;
                                this.viewInfo.columns = this.gridColumns(data.attributes);
                                
                                this.viewInfo.rows = this.createGridDataObject(view);
                                this.trigger('view:resultsLoaded', this);

                                // If runView request came from contextDocSearch, create context cards
                                if (this.viewInfo.contextSource) {
                                    var items = this.viewInfo.rows,
                                        cardData = [],
                                        item,
                                        cardItem,
                                        i;
                                    
                                    //For each document returned from context search, format row/column data for card and load into cardData array
                                    for (i in items) {
                                        if (items.hasOwnProperty(i)) {
                                            item = {};
                                            item.sourceItem = items[i];
                                            cardItem = Formatter.format(item, this.viewInfo.columns, viewCat);
                                            cardData.push(cardItem);
                                        }
                                    }
                                    
                                    //Pass cardData array to createContextCards function
                                    this.createContextCards(cardData);
                                    
                                    //Here's where I could try and send a message
                                    var TestModel = Core.Model.extend({
                                        url: 'https://api.parse.com/1/push'
                                    });

                                    /*var m = new TestModel();
                                    m.set({
                                        channels: [''],
                                        data: {
                                            'alert': 'Founds some shit for: ' + this.viewInfo.vslText;
                                        }
                                    });

                                    m.save({}, {
                                        headers: {
                                            'X-Parse-Application-Id': 'LKAswEma29VkRvtQzkHZRt2Jb1pwpC4ZAmJv2rs4',
                                            'X-Parse-REST-API-Key': 'Hm4fQFVC7Y8twVo9840c8ZO6dX7uEcBhvC5lvR0K'
                                        },

                                        success: function () { debugger; },
                                        error: function () { debugger; }
                                    });*/
                                }
                                
                            }.bind(this),
                            error: function (model, repsonse, options, error) {
                                this.trigger('error', error);
                            }.bind(this)
                        });
                        
                        
                    }.bind(this),
                    error: function (model, response, options, error) {
                        this.trigger('error', error);
                    }.bind(this)
                });
            }
        },
        
        gridColumns: function (data) {
            var columns = data.columns,
                newColumns = [],
                columnRoot,
                column,
                i;

            // Loop through columns data and return appropriate column information
            for (i in columns) {
                if (columns.hasOwnProperty(i)) {
                    columnRoot = columns[i];
                    if (columnRoot.displayType !== 'HIDDEN') {
                        column = {
                            propertyName: columnRoot.columnId,
                            name: columnRoot.name,
                            type: columnRoot.dataType
                        };
                        // Certain Boolean columns will be rendered as icons. Must specify which columns to display as icons.
                        column.createCellContent = function (value, c, row) {
                            var fields = row.sourceItem;
                            value = fields.filter(function (f) { return f.columnId === c.sourceItem.propertyName; })[0].value;
                            return value;
                        };
                        
                        if (column.type === 'DATE') {
                            column.createCellContent = this.dateColumn;
                        }
                        
                        // 24 = In Workflow, 9 = Version Controlled, 5 = Workflow Item Type
                        if (data.category === 'DOCUMENT') {
                            if (['24', '9'].indexOf(columnRoot.columnId) !== -1) {
                                column.createCellContent = this.iconColumn;
                                column.createColumnHeader = this.emptyColumnHeader;
                            }
                        } else if (data.category === 'WORKFLOW') {
                            if (columnRoot.columnId === '5') {
                                column.createCellContent = this.iconColumn;
                                column.createColumnHeader = this.emptyColumnHeader;
                            }
                        }
                        newColumns.push(column);
                    }
                }
            }
            return newColumns;
        },
        
        dateColumn: function (value, column, row) {
            var cellValue = row.sourceItem.filter(function (f) { return f.columnId === column.sourceItem.propertyName; })[0].value;
            return Core.Dates.format(new Date(parseInt(cellValue)), {date: 'medium'});
        },
        
        // Function used to render boolean column content as icons
        iconColumn: function (value, column, row) {
            var element, iconClass, iconTitle, cellValue;
            cellValue = row.sourceItem.filter(function (f) { return f.columnId === column.sourceItem.propertyName; })[0].value;
            if (cellValue === 'true') {
                if (column.sourceItem.propertyName === '24') {
                    iconClass = 'icon-workflow';
                    iconTitle = column.sourceItem.name;
                } else if (column.sourceItem.propertyName === '9') {
                    if (row.sourceItem['12'] !== '0') {
                        iconClass = 'icon-version_control';
                        iconTitle = column.sourceItem.name + ': Checked out';
                    } else {
                        iconClass = 'icon-version_control_checked_in';
                        iconTitle = column.sourceItem.name + ': Checked in';
                    }
                } else {
                    return null;
                }
            } else if (cellValue === '1') {
                iconClass = 'icon-document_full';
                iconTitle = 'Document';
            }
            element = document.createElement('span');
            element.setAttribute('aria-hidden', true);
            element.setAttribute('title', iconTitle);
            element.className = iconClass;
            return element;
        },
        
        //Makes certain column headers empty
        emptyColumnHeader: function () {
            return '';
        },
        
        createGridDataObject: function (view) {
            //var viewCat = view.attributes.category;
            var viewColumns = view.attributes.columns;
            
            view.viewResults.models.forEach(function (m) {
                m.attributes.fields.forEach(function (f) {
                    f.name = viewColumns.filter(function (c) { return c.columnId === f.columnId; })[0].name;
                });
            })
            
            //return view.viewResults.models;
            return view.viewResults.models.map(function (m) { return m.attributes.fields; });
        },
        
        //Function takes view.viewResults and creates a 'documentsReturned' object and passes back to runView()
        getDocumentsFromViewResults: function (view, callback) {
            var viewCat, propMap, documentsReturned;
            viewCat = view.viewResults.viewCategory;
            documentsReturned = view.viewResults.map(function (doc) {
                var docProps = {};
                doc.attributes.fields
                    .filter(function (field) {
                        return field.columnId;
                    })
                    .forEach(function (field) {
                        docProps[field.columnId] = field.value;
                    });
                return docProps;
            });
            
            //Write array of returned documents to the this.viewInfo object
            this.viewInfo.documents = documentsReturned;
            
            if (callback) {
                callback(documentsReturned);
            }
        },
        
        //Determine source of context change and return name of context object property to use in contextDocSearch
        getContextSourceInfo: function (context) {
            var contextSource, contextProp, contextFound, propName, contextName;
            
            // Set context variables based on 'context' option passed into function
            contextSource = context.source.type;
            contextProp = context.properties;
            
            // Determine which context property to use by comparing source of thing that just set the context to what is set up in config.json
            if (this.contextSources !== '') {
                contextFound = false;
                propName = this.applicationContextConfig.contextSources[contextSource];
                if (propName) {
                    contextName = contextProp[propName];
                    if (!contextName) {
                        Logger.log(Core.Strings.translate('viewbrowser.mainView.noMatchingProperties') + contextSource, Logger.WARNING, Logger.GENERAL);
                        return;
                    }
                    contextFound = true;
                    return contextName;
                }
                if (!contextFound) {
                    Logger.log(Core.Strings.translate('viewbrowser.mainView.configContextSourceWarning') + contextSource, Logger.WARNING, Logger.GENERAL);
                    return;
                }
            } else {
                Logger.log(Core.Strings.translate('viewbrowser.mainView.configContextError'), Logger.ERROR, Logger.GENERAL);
                return;
            }
        },
        
        //Function to perform context document search
        contextDocSearch: function (change) {
            // Call function to return the appropriate context value based on config settings 
            var contextValue = this.getContextSourceInfo(change.context),
                contextSource = change.context.source.type,
                obj,
                vslFilter,
                documents;
            
            // Define the view that will be used to perform the search. Eventually this should read from config.json.
            this.viewInfo = {
                groupName: "DOCUMENT",
                id: "SysDocumentsAll",
                viewCollection: this.viewCollection,
                contextSource: contextSource
            };
            
            // Create the VSL filter that will be used to filter the view contents. Eventually, this should red from config.json.
            vslFilter = "[anyDocKey] startswith '" + contextValue + "'";
            
            // Stub in Context Card and add notification to the context menu
            this.previewLeftCard = $('<div/>');
            //this.notification = ApplicationContext.Manager.addNotification(change.context, this.previewLeftCard);
            this.notification = Notifications.NotificationsSystem.addNotification(change.context, this.previewLeftCard);
            this.notification.state = 'loading';
            
            // Now I want to run a view and return documents into an object that I can manipulate here
            this.viewCollection = new ViewCollection();
            this.viewCollection.fetch({
                success: function () {
                    this.runView(this.viewInfo.id, vslFilter);
                }.bind(this),
                error: function (model, response, options, error) {
                    this.trigger('error', error);
                }
            });
        },
        
        // Function creates new context cards for each document that is returned
        createContextCards: function (cardData) {
            //console.log(cardData);
            this.previewLeftCard.html(PreviewLeftTemplate.render(cardData));
            this.notification.state = 'has-content';
        },
        
        render: function () {
            this.contentView = new this.ContentView(this.options);
            
            if (this.options.isSmallForm) {
                // Trigger page level transitions for mobile
                this.trigger('navigate', this.navigationView, {transition: 'horizontal'});
                this.trigger('navigate', this.contentView, {transition: 'horizontal', transitionImmediately: this.selectedViewId !== null});
            } else {
                // This toolbar is only used on large form
                this.toolbarView = new this.ToolbarView(this.options).render();

                // Large form uses panes to organize everything at once
                this.paneContainer = new Controls.PaneContainer(this.element);
                this.paneContainer.addPane(this.contentView.element, {dockType: 'center', minWidth: 400, priority: 0});
                this.paneContainer.addPane(this.toolbarView.element, {dockType: 'top', isFixed: true, priority: 10});
                this.navigationPane = this.paneContainer.addPane(this.navigationView.element, {dockType: 'left', minWidth: 180, priority: 5});
                
                // Handle the toolbar events
                this.toolbarView.on('toggle:action', this.onToolbarToggleAction, this);
                this.toolbarView.on('click:action', this.onGridViewDisplayOption, this);
                this.listenTo(this.toolbarView, 'main:runFilteredView', this.runView);
            }

            this.on('view:resultsLoaded', function () {
                this.contentView.render(this.viewInfo);
                if (!this.viewInfo.contextSource && !this.viewInfo.vslText) {
                    this.toolbarView.loadFilterView(this.viewInfo);
                }
                if (this.gridDisplayType) {
                    this.contentView.setDisplayType(this.gridDisplayType);
                }
            });
            
            this.contentView.render();
            return this;
        },
        
        //Toggle navigation pane when toolbar button is clicked
        onToolbarToggleAction: function (e) {
            if (e.action === 'setPaneVisibility') {
                var pane = this[e.value + 'Pane'];
                if (pane) {
                    if (e.type === 'select') {
                        pane.show();
                    } else {
                        pane.hide();
                    }
                }
            }
        },
        
        //Listening for changes to the view display type selection
        onGridViewDisplayOption: function (e) {
            if (e.action !== 'setPaneVisibility') {
                this.contentView.setDisplayType(e.value);
                this.gridDisplayType = e.value;
            }
        }
    });
});
