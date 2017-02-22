// © 2014 Lexmark International, Inc. and Perceptive Software, LLC.  All rights reserved.

define('packages_psw-brcarr-viewbrowser_src_content_filterTemplate_html',[],function() { return (function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n    <option value=\"";
  if (helper = helpers.field) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.field); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n    ";
  return buffer;
  }

  buffer += "<select id=\"field-select\">\r\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.fields), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</select>\r\n\r\n<select id=\"operator-select\">\r\n    <option value=\"=\">is equal to</option>\r\n    <option value=\"!=\">is not equal to</option>\r\n    <option value=\"<\">is less than</option>\r\n    <option value=\"<=\">is less than or equal to</option>\r\n    <option value=\">\">is greater than</option>\r\n    <option value=\">=\">is greater than or equal to</option>\r\n    <option value=\"startsWith\" selected>starts with</option>\r\n    <option value=\"doesNotStartWith\">does not start with</option>\r\n    <option value=\"contains\">contains</option>\r\n    <option value=\"doesNotContain\">does not contain</option>\r\n    <option value=\"endsWith\">ends with</option>\r\n    <option value=\"doesNotEndWith\">does not end with</option>\r\n</select>\r\n\r\n<input id=\"filter-input\" type=\"text\">\r\n\r\n<button type=\"button\" class=\"primary\">\r\n    <span class=\"icon icon-16 icon-app_plan\"></span>\r\n    Filter\r\n</button>";
  return buffer;
  }); });
var define;
define('packages/psw-brcarr-viewbrowser/src/js/models/viewResultModel',['core'], function (Core) {
    

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
var define;
define('packages/psw-brcarr-viewbrowser/src/js/models/viewResultCollection',['core', './viewResultModel'], function (Core, ViewResultsModel) {
    

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
var define;
define('packages/psw-brcarr-viewbrowser/src/js/models/viewModel',['core', './viewResultCollection'], function (Core, ViewResultCollection) {
    

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
var define;
define('packages/psw-brcarr-viewbrowser/src/js/models/viewCollection',['core', './viewModel'], function (Core, ViewModel) {
    

    return Core.IntegrationServerCollection.extend({
        url: function () {
            return '/view/';
        },

        model: ViewModel
    });
});
var define;
define('packages/psw-brcarr-viewbrowser/src/utility/propertyMap',['core'], function (Core) {
    
    
    var docPropMap, folderPropMap, taskPropMap, workflowPropMap, data;
    
    // Property map for document views
    docPropMap = {
        58: 'name',
        0: 'drawer',
        1: 'field1',
        2: 'field2',
        3: 'field3',
        4: 'field4',
        5: 'field5',
        6: 'docType',
        7: 'pages',
        8: 'docId',
        14: 'creationDate',
        13: 'creationUser',
        42: 'fileType'
    };
    
    // Property map for folder views
    folderPropMap = {};
    
    // Property map for task views
    taskPropMap = {
        1: 'status',
        2: 'taskType',
        3: 'completionMethod',
        4: 'taskID',
        5: 'instructions',
        6: 'comments',
        34: 'templateName'
    };
    
    // Property map for workflow views
    workflowPropMap = [];
    
    data = [];
    
    return {
        getData: function (viewType) {
            if (viewType === "DOCUMENT") {
                data = docPropMap;
            } else if (viewType === "FOLDER") {
                data = folderPropMap;
            } else if (viewType === "TASK") {
                data = taskPropMap;
            } else if (viewType === "WORKFLOW") {
                data = workflowPropMap;
            } else {
                return;
            }

            return data;
        }
    };
});
/*jslint nomen: true */
var define, console;
define('packages/psw-brcarr-viewbrowser/src/js/views/navigationView',[
    'underscore',
    'core',
    'controls',
    '../models/viewCollection',
    '../../utility/propertyMap'
], function (_, Core, Controls, ViewCollection, PropertyMap) {
    

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
var define;
define('packages/psw-brcarr-viewbrowser/src/utility/filterFields',['core'], function (Core) {
    
    
    var translate = Core.Strings.translate('viewbrowser.filterFields'),
        docTranslate = translate.document,
        folderTranslate = translate.folder,
        taskTranslate = translate.task,
        docFilterFields,
        folderFilterFields,
        taskFilterFields,
        data;
    
    //List of data fields for document filtering
    docFilterFields = {
        fields: [
            {field: '[anyDocKey]', label: docTranslate.anyDocKey, type: 'text'},
            {field: '[docID]', label: docTranslate.docID, type: 'text'},
            {field: '[docType]', label: docTranslate.docType, type: 'text'},
            {field: '[drawer]', label: docTranslate.drawer, type: 'text'},
            {field: '[field1]', label: docTranslate.field1, type: 'text'},
            {field: '[field2]', label: docTranslate.field2, type: 'text'},
            {field: '[field3]', label: docTranslate.field3, type: 'text'},
            {field: '[field4]', label: docTranslate.field4, type: 'text'},
            {field: '[field5]', label: docTranslate.field5, type: 'text'}
        ]
    };
    
    // List of data fields for folder filtering
    folderFilterFields = {
        fields: [
            {field: '[folderID]', label: folderTranslate.folderID, type: 'text'},
            {field: '[folderName]', label: folderTranslate.folderName, type: 'text'},
            {field: '[folderStatus]', label: folderTranslate.folderStatus, type: 'status'},
            {field: '[folderType]', label: folderTranslate.folderType, type: 'text'}
        ]
    };
    
    // List of data fields for task filtering
    taskFilterFields = {
        fields: [
            {field: '[status]', label: taskTranslate.status, type: 'status'},
            {field: '[taskType]', label: taskTranslate.taskType, type: 'status'},
            {field: '[completionMethod]', label: taskTranslate.completionMethod, type: 'status'},
            {field: '[instructions]', label: taskTranslate.instructions, type: 'text'},
            {field: '[comments]', label: taskTranslate.comments, type: 'text'},
            {field: '[templateName]', label: taskTranslate.templateName, type: 'text'},
            {field: '[assignedTo]', label: taskTranslate.assignedTo, type: 'user'},
            {field: '[assignmentDate]', label: taskTranslate.assignmentDate, type: 'datetime'},
            {field: '[completedBy]', label: taskTranslate.completedBy, type: 'user'},
            {field: '[completedDate]', label: taskTranslate.completedDate, type: 'datetime'},
            {field: '[daysUntilDue]', label: taskTranslate.daysUntilDue, type: 'number'},
            {field: '[dueDate]', label: taskTranslate.dueDate, type: 'datetime'}
        ]
    };
    
    data = [];
    
    return {
        getData: function (viewType) {
            if (viewType === "DOCUMENT" || viewType === "WORKFLOW") {
                data = docFilterFields;
            } else if (viewType === "FOLDER") {
                data = folderFilterFields;
            } else if (viewType === "TASK") {
                data = taskFilterFields;
            } else {
                return;
            }

            return data;
        }
    };
        
});
var define;
define('packages/psw-brcarr-viewbrowser/src/utility/viewColumns',['core'], function (Core) {
    
    
    var translate = Core.Strings.translate('viewbrowser.filterFields'),
        docTranslate = translate.document,
        folderTranslate = translate.folder,
        taskTranslate = translate.task,
        docViewColumns,
        folderViewColumns,
        taskViewColumns,
        workflowViewColumns,
        data;
    
    //List of columns for document views
    docViewColumns = [
        {name: docTranslate.name, propertyName: 'name'},
        {name: docTranslate.drawer, propertyName: 'drawer'},
        {name: docTranslate.field1, propertyName: 'field1'},
        {name: docTranslate.field2, propertyName: 'field2'},
        {name: docTranslate.field3, propertyName: 'field3'},
        {name: docTranslate.field4, propertyName: 'field4'},
        {name: docTranslate.field5, propertyName: 'field5'},
        {name: docTranslate.docType, propertyName: 'docType'},
        {name: docTranslate.pages, propertyName: 'pages'},
        {name: docTranslate.fileType, propertyName: 'fileType'},
        {name: docTranslate.creationDate, propertyName: 'creationDate'},
        {name: docTranslate.creationUser, propertyName: 'creationUser'}
    ];
    
    //List of columns for folder views
    folderViewColumns = [
        {name: folderTranslate.folderName, propertyName: 'folderName'},
        {name: folderTranslate.folderType, propertyName: 'folderType'},
        {name: folderTranslate.folderStatus, propertyName: 'folderStatus'}
    ];
    
    // List of columns for task views
    taskViewColumns = [
        {name: taskTranslate.status, propertyName: 'status'},
        {name: taskTranslate.taskType, propertyName: 'taskType'},
        {name: taskTranslate.completionMethod, propertyName: 'completionMethod'},
        {name: taskTranslate.taskID, propertyName: 'taskID'},
        {name: taskTranslate.instructions, propertyName: 'instructions'},
        {name: taskTranslate.comments, propertyName: 'comments'},
        {name: taskTranslate.templateName, propertyName: 'templateName'}
    ];
    
    // List of columns for workflow views
    workflowViewColumns = [ ];
    
    data = [];
    
    return {
        getData: function (viewType) {
            if (viewType === "DOCUMENT") {
                data = docViewColumns;
            } else if (viewType === "FOLDER") {
                data = folderViewColumns;
            } else if (viewType === "TASK") {
                data = taskViewColumns;
            } else if (viewType === "WORKFLOW") {
                data = workflowViewColumns;
            } else {
                return;
            }

            return data;
        }
    };
        
});
define('packages_psw-brcarr-viewbrowser_src_content_cardView_html',[],function() { return (function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "        \r\n        <div class=\"control-group\">\r\n            <label>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n            <p>";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n        </div>\r\n        ";
  return buffer;
  }

  buffer += "<div class=\"layout-row card preview-left\">\r\n    <div class=\"preview thumb thumbnail column col-5\">\r\n        <img src=\"";
  if (helper = helpers.thumb) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.thumb); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n    </div>\r\n   \r\n    <div class=\"content column col-7\">\r\n        <h2>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\r\n        <div class=\"control-group\">\r\n            <label class=\"property-label\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[7])),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>\r\n            <p>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[7])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n        </div>\r\n        <div class=\"control-group\">\r\n            <label class=\"property-label\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[9])),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>\r\n            <p>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[9])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n        </div>\r\n        <!--";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.cardFields), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "-->\r\n    </div>\r\n</div>";
  return buffer;
  }); });
define('packages_psw-brcarr-viewbrowser_src_content_listView_html',[],function() { return (function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"layout-row\">\r\n    <div class=\"thumbnail col-3\">\r\n        <img src=\"";
  if (helper = helpers.thumb) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.thumb); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n    </div>\r\n    <div class=\"content col-9\">\r\n        <h2>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\r\n        <div class=\"control-group\">\r\n            <label class=\"property-label\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[11])),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>\r\n            <p>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[11])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n        </div>\r\n        <div class=\"control-group\">\r\n            <label class=\"property-label\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[12])),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>\r\n            <p>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[12])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n        </div>\r\n        <div class=\"control-group\">\r\n            <label class=\"property-label\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[13])),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>\r\n            <p>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[13])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n        </div>\r\n        <div class=\"control-group\">\r\n            <label class=\"property-label\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[14])),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>\r\n            <p>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[14])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n        </div>\r\n    </div>\r\n</div>";
  return buffer;
  }); });
/*jslint nomen: true */
var define;
define('packages/psw-brcarr-viewbrowser/src/js/views/formatter',['underscore', 'core'], function (_, Core) {
    

    return {
        format: function (rows, columns, viewCat) {
            //console.log(viewCat);
            var docId, docName, cardData, j, cardField;
            if (viewCat === 'DOCUMENT') {
                docId = rows.sourceItem.filter(function (f) { return f.columnId === '8'; })[0].value;
                docName = rows.sourceItem.filter(function (f) { return f.columnId === '58'; })[0].value;
            } else if (viewCat === 'TASK') {
                docId = rows.sourceItem.filter(function (f) { return f.columnId === '22'; })[0].value;
                docName = rows.sourceItem.filter(function (f) { return f.columnId === '48'; })[0].value;
            } else if (viewCat === 'WORKFLOW') {
                docId = rows.sourceItem.filter(function (f) { return f.columnId === '18'; })[0].value;
                docName = rows.sourceItem.filter(function (f) { return f.columnId === '14'; })[0].value;
            }
            cardData = {
                type: viewCat,
                id: docId,
                thumb: '/integrationserver/document/' + docId + '/thumbnail?client-type=webclient',
                name: docName
            };
            cardData.cardFields = [];
            for (j in columns) {
                if (columns.hasOwnProperty(j)) {
                    cardField = {
                        id: columns[j].propertyName,
                        name: columns[j].name,
                        type: columns[j].type
                    };
                    cardField.value = rows.sourceItem.filter(function (f) { return f.columnId === cardField.id; })[0].value;
                    if (cardField.type === 'DATE') {
                        cardField.value = Core.Dates.format(new Date(parseInt(cardField.value)), {date: 'medium'});
                    }
                    cardData.cardFields.push(cardField);
                }
            }
            return cardData;
        }
    };
});
/*jslint nomen: true */
var define, console;
define('packages/psw-brcarr-viewbrowser/src/js/views/contentGridView',[
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
define('packages_psw-brcarr-viewbrowser_src_content_toolbarTemplate_html',[],function() { return (function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"toolbar-control\">\r\n    <div class=\"section-left\">\r\n        <button data-toggle-button type=\"button\" data-action=\"setPaneVisibility\" data-value=\"navigation\" class=\"selected\" title=\"Show/Hide Navigation Pane\">\r\n            <span class=\"icon-16 icon-contextual_menu\"></span>\r\n        </button>\r\n        <div class=\"divider\" role=\"separator\"></div>\r\n    </div>\r\n    <div class=\"section-center\">\r\n        <div class=\"filter-group\"></div>\r\n    </div>\r\n    <div class=\"section-right\">\r\n        <div class='control-panel'>\r\n            <div class='button-group'>\r\n                <button data-value=\"grid\" data-action=\"setGridView\" class=\"selected\" title=\"Grid View\"><span class=\"icon icon-16 icon-spreadsheet\" aria-hidden=\"true\"></span></button>\r\n                <button data-value=\"list\" data-action=\"setListView\" title=\"List View\"><span class=\"icon icon-16 icon-list\" aria-hidden=\"true\"></span></button>\r\n                <button data-value=\"card\" data-action=\"setCardView\" title=\"Card View\"><span class=\"icon icon-16 icon-gallery\" aria-hidden=\"true\"></span></button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
  }); });
var define;
define('packages/psw-brcarr-viewbrowser/src/js/views/filterView',[
    'core',
    'controls',
    'template!../../content/filterTemplate.html',
    '../../utility/filterFields'
], function (Core, Controls, FilterTemplate, FilterFields) {
    
    
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
/*jslint nomen: true */
var define, console;
define('packages/psw-brcarr-viewbrowser/src/js/views/toolbarView',[
    'underscore',
    'jquery',
    'core',
    'controls',
    'template!../../content/toolbarTemplate.html',
    './filterView'
], function (_, $, Core, Controls, ToolbarTemplate, FilterView) {
    

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
define('packages_psw-brcarr-viewbrowser_src_content_countCard_html',[],function() { return (function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"card count ";
  if (helper = helpers.color) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.color); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n    <div class=\"preview thumb icon ";
  if (helper = helpers.icon) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.icon); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></div>\r\n    <div class=\"number\">";
  if (helper = helpers.count) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.count); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n    <div class=\"count-label\">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n</div>";
  return buffer;
  }); });
define('packages_psw-brcarr-viewbrowser_src_content_previewLeftCard_html',[],function() { return (function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<div class=\"card preview-left\" id=\"";
  if (helper = helpers.docId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.docId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n    <div class=\"layout-row\">\r\n        <div class=\"col-4 preview thumb\">\r\n            <a href=\"#document/view/SysDocumentsAll/docId/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\" title=\"Click to view document\" data-tooltip-direction=\"left\">\r\n                <img src=\"";
  if (helper = helpers.thumb) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.thumb); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\r\n            </a>\r\n        </div>\r\n        <div class=\"summary col-8\">\r\n            <div class=\"layout-row\">\r\n                <h1>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\r\n                <div>\r\n                    <span class=\"meta-label\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[7])),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n                    <span>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[7])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n                </div>\r\n                <div>\r\n                    <span class=\"meta-label\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[9])),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n                    <span>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cardFields)),stack1 == null || stack1 === false ? stack1 : stack1[9])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }); });
/*jslint nomen: true */
var define, console;
define('packages/psw-brcarr-viewbrowser/src/js/views/mainView',[
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

/*jslint nomen: true */
var define, console;
define('packages/psw-brcarr-viewbrowser/src/js/viewBrowserModule',[
    'underscore',
    'core',
    './views/mainView',
    'psw-framework-application-context'
], function (_, Core, MainView, ApplicationContext) {
    
    
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
var define;
define('packages/psw-brcarr-viewbrowser/src/exports',['./js/viewBrowserModule'], function (ViewBrowserModule) {
    
    
    var exports = {
        ViewBrowserModule: ViewBrowserModule
    };
    return exports;
});