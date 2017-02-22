var define;
define(['core'], function (Core) {
    'use strict';
    
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