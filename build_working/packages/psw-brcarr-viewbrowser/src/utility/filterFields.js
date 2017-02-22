var define;
define(['core'], function (Core) {
    'use strict';
    
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