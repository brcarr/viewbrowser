var define;
define(['core'], function (Core) {
    'use strict';
    
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