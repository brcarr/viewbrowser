// © 2014 Lexmark International, Inc. and Perceptive Software, LLC.  All rights reserved.
define("packages_psw-brcarr-viewbrowser_src_content_filterTemplate_html",[],function(){return function(e,t,n,r,i){function l(e,t){var r="",i,s;return r+='\r\n    <option value="',(s=n.field)?i=s.call(e,{hash:{},data:t}):(s=e&&e.field,i=typeof s===u?s.call(e,{hash:{},data:t}):s),r+=a(i)+'">',(s=n.label)?i=s.call(e,{hash:{},data:t}):(s=e&&e.label,i=typeof s===u?s.call(e,{hash:{},data:t}):s),r+=a(i)+"</option>\r\n    ",r}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),i=i||{};var s="",o,u="function",a=this.escapeExpression,f=this;s+='<select id="field-select">\r\n    ',o=n.each.call(t,t&&t.fields,{hash:{},inverse:f.noop,fn:f.program(1,l,i),data:i});if(o||o===0)s+=o;return s+='\r\n</select>\r\n\r\n<select id="operator-select">\r\n    <option value="=">is equal to</option>\r\n    <option value="!=">is not equal to</option>\r\n    <option value="<">is less than</option>\r\n    <option value="<=">is less than or equal to</option>\r\n    <option value=">">is greater than</option>\r\n    <option value=">=">is greater than or equal to</option>\r\n    <option value="startsWith" selected>starts with</option>\r\n    <option value="doesNotStartWith">does not start with</option>\r\n    <option value="contains">contains</option>\r\n    <option value="doesNotContain">does not contain</option>\r\n    <option value="endsWith">ends with</option>\r\n    <option value="doesNotEndWith">does not end with</option>\r\n</select>\r\n\r\n<input id="filter-input" type="text">\r\n\r\n<button type="button" class="primary">\r\n    <span class="icon icon-16 icon-app_plan"></span>\r\n    Filter\r\n</button>',s}});var define;define("packages/psw-brcarr-viewbrowser/src/js/models/viewResultModel",["core"],function(e){var t=e.IntegrationServerModel.extend({initialize:function(e){this.viewId=e},fetch:function(t){t=t||{},t.type="POST",t.data=JSON.stringify({vslText:""}),e.IntegrationServerModel.prototype.fetch.call(this,t)}});return t});var define;define("packages/psw-brcarr-viewbrowser/src/js/models/viewResultCollection",["core","./viewResultModel"],function(e,t){return e.IntegrationServerCollection.extend({initialize:function(e,t){this.viewId=e,this.viewCategory=t},url:function(){return"/view/"+this.viewId+"/result?category="+this.viewCategory},model:t,fetch:function(t){t.type="POST",e.IntegrationServerCollection.prototype.fetch.call(this,t)},parse:function(e){return e.resultRows}})});var define;define("packages/psw-brcarr-viewbrowser/src/js/models/viewModel",["core","./viewResultCollection"],function(e,t){var n=e.IntegrationServerModel.extend({initialize:function(){this.viewResults=new t(this.get("id"),this.get("category"))},url:function(){return"/view/"+this.get("id")+"/?category="+this.get("category")}});return n});var define;define("packages/psw-brcarr-viewbrowser/src/js/models/viewCollection",["core","./viewModel"],function(e,t){return e.IntegrationServerCollection.extend({url:function(){return"/view/"},model:t})});var define;define("packages/psw-brcarr-viewbrowser/src/utility/propertyMap",["core"],function(e){var t,n,r,i,s;return t={58:"name",0:"drawer",1:"field1",2:"field2",3:"field3",4:"field4",5:"field5",6:"docType",7:"pages",8:"docId",14:"creationDate",13:"creationUser",42:"fileType"},n={},r={1:"status",2:"taskType",3:"completionMethod",4:"taskID",5:"instructions",6:"comments",34:"templateName"},i=[],s=[],{getData:function(e){if(e==="DOCUMENT")s=t;else if(e==="FOLDER")s=n;else if(e==="TASK")s=r;else{if(e!=="WORKFLOW")return;s=i}return s}}});var define,console;define("packages/psw-brcarr-viewbrowser/src/js/views/navigationView",["underscore","core","controls","../models/viewCollection","../../utility/propertyMap"],function(e,t,n,r,i){return t.View.extend({className:"nav-pane",selectedViewId:null,initialize:function(e){this.viewCollection=e.collection,this.listenTo(this.viewCollection,"sync",this.render)},render:function(){return this.element&&this.viewCollection.length&&(this.items=this.createNavItems(this.viewCollection),this.navigation=new n.Navigation(document.createElement("div"),this.items,{groupBy:"groupName"}),this.navigation.on("open:item",this.onItemOpened,this),this.$element.append(this.navigation.getElement())),this},createNavItems:function(e){var t=[],n,r,i,s;for(n in e.models)if(e.models.hasOwnProperty(n)){r=e.models[n].attributes;switch(r.category){case"DOCUMENT":s="icon-views";break;case"WORKFLOW":s="icon-workflow";break;case"FOLDER":s="icon-folder";break;case"TASK":s="icon-tasks"}i={id:r.id,name:r.name,description:r.description,groupName:r.category,iconClass:s},t.push(i)}return t}.bind(this),onItemOpened:function(e,n){t.Location.navigate(this.options.path+"/view/"+n.sourceItem.id,{replace:!this.options.isSmallForm}),this.selectedViewId=n.sourceItem.id,this.selectView(n.sourceItem)},selectView:function(e){e.id!==this.selectedViewId&&(this.selectedViewId=e.id),this.trigger("change:selectedView",e)}})});var define;define("packages/psw-brcarr-viewbrowser/src/utility/filterFields",["core"],function(e){var t=e.Strings.translate("viewbrowser.filterFields"),n=t.document,r=t.folder,i=t.task,s,o,u,a;return s={fields:[{field:"[anyDocKey]",label:n.anyDocKey,type:"text"},{field:"[docID]",label:n.docID,type:"text"},{field:"[docType]",label:n.docType,type:"text"},{field:"[drawer]",label:n.drawer,type:"text"},{field:"[field1]",label:n.field1,type:"text"},{field:"[field2]",label:n.field2,type:"text"},{field:"[field3]",label:n.field3,type:"text"},{field:"[field4]",label:n.field4,type:"text"},{field:"[field5]",label:n.field5,type:"text"}]},o={fields:[{field:"[folderID]",label:r.folderID,type:"text"},{field:"[folderName]",label:r.folderName,type:"text"},{field:"[folderStatus]",label:r.folderStatus,type:"status"},{field:"[folderType]",label:r.folderType,type:"text"}]},u={fields:[{field:"[status]",label:i.status,type:"status"},{field:"[taskType]",label:i.taskType,type:"status"},{field:"[completionMethod]",label:i.completionMethod,type:"status"},{field:"[instructions]",label:i.instructions,type:"text"},{field:"[comments]",label:i.comments,type:"text"},{field:"[templateName]",label:i.templateName,type:"text"},{field:"[assignedTo]",label:i.assignedTo,type:"user"},{field:"[assignmentDate]",label:i.assignmentDate,type:"datetime"},{field:"[completedBy]",label:i.completedBy,type:"user"},{field:"[completedDate]",label:i.completedDate,type:"datetime"},{field:"[daysUntilDue]",label:i.daysUntilDue,type:"number"},{field:"[dueDate]",label:i.dueDate,type:"datetime"}]},a=[],{getData:function(e){if(e==="DOCUMENT"||e==="WORKFLOW")a=s;else if(e==="FOLDER")a=o;else{if(e!=="TASK")return;a=u}return a}}});var define;define("packages/psw-brcarr-viewbrowser/src/utility/viewColumns",["core"],function(e){var t=e.Strings.translate("viewbrowser.filterFields"),n=t.document,r=t.folder,i=t.task,s,o,u,a,f;return s=[{name:n.name,propertyName:"name"},{name:n.drawer,propertyName:"drawer"},{name:n.field1,propertyName:"field1"},{name:n.field2,propertyName:"field2"},{name:n.field3,propertyName:"field3"},{name:n.field4,propertyName:"field4"},{name:n.field5,propertyName:"field5"},{name:n.docType,propertyName:"docType"},{name:n.pages,propertyName:"pages"},{name:n.fileType,propertyName:"fileType"},{name:n.creationDate,propertyName:"creationDate"},{name:n.creationUser,propertyName:"creationUser"}],o=[{name:r.folderName,propertyName:"folderName"},{name:r.folderType,propertyName:"folderType"},{name:r.folderStatus,propertyName:"folderStatus"}],u=[{name:i.status,propertyName:"status"},{name:i.taskType,propertyName:"taskType"},{name:i.completionMethod,propertyName:"completionMethod"},{name:i.taskID,propertyName:"taskID"},{name:i.instructions,propertyName:"instructions"},{name:i.comments,propertyName:"comments"},{name:i.templateName,propertyName:"templateName"}],a=[],f=[],{getData:function(e){if(e==="DOCUMENT")f=s;else if(e==="FOLDER")f=o;else if(e==="TASK")f=u;else{if(e!=="WORKFLOW")return;f=a}return f}}}),define("packages_psw-brcarr-viewbrowser_src_content_cardView_html",[],function(){return function(e,t,n,r,i){function c(e,t){var r="",i,s;return r+='        \r\n        <div class="control-group">\r\n            <label>',(s=n.name)?i=s.call(e,{hash:{},data:t}):(s=e&&e.name,i=typeof s===a?s.call(e,{hash:{},data:t}):s),r+=f(i)+"</label>\r\n            <p>",(s=n.value)?i=s.call(e,{hash:{},data:t}):(s=e&&e.value,i=typeof s===a?s.call(e,{hash:{},data:t}):s),r+=f(i)+"</p>\r\n        </div>\r\n        ",r}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),i=i||{};var s="",o,u,a="function",f=this.escapeExpression,l=this;s+='<div class="layout-row card preview-left">\r\n    <div class="preview thumb thumbnail column col-5">\r\n        <img src="',(u=n.thumb)?o=u.call(t,{hash:{},data:i}):(u=t&&t.thumb,o=typeof u===a?u.call(t,{hash:{},data:i}):u),s+=f(o)+'">\r\n    </div>\r\n   \r\n    <div class="content column col-7">\r\n        <h2>',(u=n.name)?o=u.call(t,{hash:{},data:i}):(u=t&&t.name,o=typeof u===a?u.call(t,{hash:{},data:i}):u),s+=f(o)+'</h2>\r\n        <div class="control-group">\r\n            <label class="property-label">'+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[7]),o==null||o===!1?o:o.name),typeof o===a?o.apply(t):o))+"</label>\r\n            <p>"+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[7]),o==null||o===!1?o:o.value),typeof o===a?o.apply(t):o))+'</p>\r\n        </div>\r\n        <div class="control-group">\r\n            <label class="property-label">'+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[9]),o==null||o===!1?o:o.name),typeof o===a?o.apply(t):o))+"</label>\r\n            <p>"+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[9]),o==null||o===!1?o:o.value),typeof o===a?o.apply(t):o))+"</p>\r\n        </div>\r\n        <!--",o=n.each.call(t,t&&t.cardFields,{hash:{},inverse:l.noop,fn:l.program(1,c,i),data:i});if(o||o===0)s+=o;return s+="-->\r\n    </div>\r\n</div>",s}}),define("packages_psw-brcarr-viewbrowser_src_content_listView_html",[],function(){return function(e,t,n,r,i){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),i=i||{};var s="",o,u,a="function",f=this.escapeExpression;return s+='<div class="layout-row">\r\n    <div class="thumbnail col-3">\r\n        <img src="',(u=n.thumb)?o=u.call(t,{hash:{},data:i}):(u=t&&t.thumb,o=typeof u===a?u.call(t,{hash:{},data:i}):u),s+=f(o)+'">\r\n    </div>\r\n    <div class="content col-9">\r\n        <h2>',(u=n.name)?o=u.call(t,{hash:{},data:i}):(u=t&&t.name,o=typeof u===a?u.call(t,{hash:{},data:i}):u),s+=f(o)+'</h2>\r\n        <div class="control-group">\r\n            <label class="property-label">'+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[11]),o==null||o===!1?o:o.name),typeof o===a?o.apply(t):o))+"</label>\r\n            <p>"+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[11]),o==null||o===!1?o:o.value),typeof o===a?o.apply(t):o))+'</p>\r\n        </div>\r\n        <div class="control-group">\r\n            <label class="property-label">'+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[12]),o==null||o===!1?o:o.name),typeof o===a?o.apply(t):o))+"</label>\r\n            <p>"+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[12]),o==null||o===!1?o:o.value),typeof o===a?o.apply(t):o))+'</p>\r\n        </div>\r\n        <div class="control-group">\r\n            <label class="property-label">'+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[13]),o==null||o===!1?o:o.name),typeof o===a?o.apply(t):o))+"</label>\r\n            <p>"+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[13]),o==null||o===!1?o:o.value),typeof o===a?o.apply(t):o))+'</p>\r\n        </div>\r\n        <div class="control-group">\r\n            <label class="property-label">'+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[14]),o==null||o===!1?o:o.name),typeof o===a?o.apply(t):o))+"</label>\r\n            <p>"+f((o=(o=(o=t&&t.cardFields,o==null||o===!1?o:o[14]),o==null||o===!1?o:o.value),typeof o===a?o.apply(t):o))+"</p>\r\n        </div>\r\n    </div>\r\n</div>",s}});var define;define("packages/psw-brcarr-viewbrowser/src/js/views/formatter",["underscore","core"],function(e,t){return{format:function(e,n,r){var i,s,o,u,a;r==="DOCUMENT"?(i=e.sourceItem.filter(function(e){return e.columnId==="8"})[0].value,s=e.sourceItem.filter(function(e){return e.columnId==="58"})[0].value):r==="TASK"?(i=e.sourceItem.filter(function(e){return e.columnId==="22"})[0].value,s=e.sourceItem.filter(function(e){return e.columnId==="48"})[0].value):r==="WORKFLOW"&&(i=e.sourceItem.filter(function(e){return e.columnId==="18"})[0].value,s=e.sourceItem.filter(function(e){return e.columnId==="14"})[0].value),o={type:r,id:i,thumb:"/integrationserver/document/"+i+"/thumbnail?client-type=webclient",name:s},o.cardFields=[];for(u in n)n.hasOwnProperty(u)&&(a={id:n[u].propertyName,name:n[u].name,type:n[u].type},a.value=e.sourceItem.filter(function(e){return e.columnId===a.id})[0].value,a.type==="DATE"&&(a.value=t.Dates.format(new Date(parseInt(a.value)),{date:"medium"})),o.cardFields.push(a));return o}}});var define,console;define("packages/psw-brcarr-viewbrowser/src/js/views/contentGridView",["underscore","jquery","core","controls","template!../../content/filterTemplate.html","./navigationView","../../utility/filterFields","../../utility/viewColumns","template!../../content/cardView.html","template!../../content/listView.html","./formatter"],function(e,t,n,r,i,s,o,u,a,f,l){function c(e){return n.Dates.format(e,{date:"long"})}return n.View.extend({className:"content-view",noViewSelected:function(){var e=new r.Alert({message:n.Strings.translate("viewbrowser.alerts.noViewSelected"),type:"info",showCloseButton:!1});e.getElement().prependTo(this.element),e.show()},setDisplayType:function(e){this.grid.setOptions({displayType:this.getDisplayType(e)})},renderContentGrid:function(e){var n,i,s,o,u,c,h,p,d;n=e.selectedViewCat,i=e.selectedViewId,s=e.viewCollection.models.filter(function(e){return e.id===i})[0],u=e.columns,c=e.rows,o=document.createElement("div"),this.element.appendChild(o),this.grid=new r.Grid(o,u,c,{useMultiSelection:!1,displayType:this.getDisplayType(h),createCardItem:function(e){var r=l.format(e,u,n);return t(a.render(r))},createListItem:function(e){var r=l.format(e,u,n);return t(f.render(r))}}),this.grid.onLoaded(function(){for(d=0;d<u.length;d+=1)this.grid.resizeColumnToFit(d)}.bind(this))},render:function(e){this.$element.empty();var t=e?this.renderContentGrid(e):this.noViewSelected()},getDisplayType:function(e){if(e!=="grid")return e}})}),define("packages_psw-brcarr-viewbrowser_src_content_toolbarTemplate_html",[],function(){return function(e,t,n,r,i){return this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),i=i||{},'<div class="toolbar-control">\r\n    <div class="section-left">\r\n        <button data-toggle-button type="button" data-action="setPaneVisibility" data-value="navigation" class="selected" title="Show/Hide Navigation Pane">\r\n            <span class="icon-16 icon-contextual_menu"></span>\r\n        </button>\r\n        <div class="divider" role="separator"></div>\r\n    </div>\r\n    <div class="section-center">\r\n        <div class="filter-group"></div>\r\n    </div>\r\n    <div class="section-right">\r\n        <div class=\'control-panel\'>\r\n            <div class=\'button-group\'>\r\n                <button data-value="grid" data-action="setGridView" class="selected" title="Grid View"><span class="icon icon-16 icon-spreadsheet" aria-hidden="true"></span></button>\r\n                <button data-value="list" data-action="setListView" title="List View"><span class="icon icon-16 icon-list" aria-hidden="true"></span></button>\r\n                <button data-value="card" data-action="setCardView" title="Card View"><span class="icon icon-16 icon-gallery" aria-hidden="true"></span></button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>'}});var define;define("packages/psw-brcarr-viewbrowser/src/js/views/filterView",["core","controls","template!../../content/filterTemplate.html","../../utility/filterFields"],function(e,t,n,r){return e.View.extend({className:"filter-group",domEvents:{"click .primary":"filterView"},render:function(e){this.viewId=e.selectedViewId,this.viewCat=e.selectedViewCat,this.viewCollection=e.viewCollection,this.fields=r.getData(this.viewCat),this.$element.html(n.render(this.fields))},filterView:function(){this.filterField=document.getElementById("field-select").value,this.filterOperator=document.getElementById("operator-select").value,this.filterValue=document.getElementById("filter-input").value,this.vslFilter=this.filterField+" "+this.filterOperator+" '"+this.filterValue+"'",this.viewInfo={viewId:this.viewId,viewCat:this.viewCat,vslText:this.vslFilter,viewCollection:this.viewCollection},this.trigger("toolbar:runFilteredView",this.viewInfo)}})});var define,console;define("packages/psw-brcarr-viewbrowser/src/js/views/toolbarView",["underscore","jquery","core","controls","template!../../content/toolbarTemplate.html","./filterView"],function(e,t,n,r,i,s){return n.View.extend({className:"toolbar-view",domEvents:{"click [data-action]":"onAction","deselect button[data-action]":"onAction","select button[data-action]":"onAction"},initialize:function(e){this.FilterView=e.FilterView||s},render:function(e){return this.$element.empty(),this.element.innerHTML=i.render(e),this.toolbar=new r.Toolbar(this.element.querySelector(".toolbar-control")),this},onAction:function(e){var t=e.type==="click"?"click:action":"toggle:action";this.trigger(t,{action:e.currentTarget.getAttribute("data-action"),value:e.currentTarget.getAttribute("data-value"),type:e.type},e.currentTarget),e.currentTarget.getAttribute("data-value")!=="navigation"&&(this.$element.find(".selected").removeClass("selected"),e.currentTarget.classList.add("selected"),this.displayType=e.currentTarget.getAttribute("data-view"))},loadFilterView:function(e){this.filterView=new s,this.listenTo(this.filterView,"toolbar:runFilteredView",this.runFilteredView);var t=e.selectedViewCat;this.filterView.render(e),this.$(".filter-group").replaceWith(this.filterView.element)},runFilteredView:function(e){this.viewInfo=e,this.trigger("main:runFilteredView",this.viewInfo)}})}),define("packages_psw-brcarr-viewbrowser_src_content_countCard_html",[],function(){return function(e,t,n,r,i){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),i=i||{};var s="",o,u,a="function",f=this.escapeExpression;return s+='<div class="card count ',(u=n.color)?o=u.call(t,{hash:{},data:i}):(u=t&&t.color,o=typeof u===a?u.call(t,{hash:{},data:i}):u),s+=f(o)+'">\r\n    <div class="preview thumb icon ',(u=n.icon)?o=u.call(t,{hash:{},data:i}):(u=t&&t.icon,o=typeof u===a?u.call(t,{hash:{},data:i}):u),s+=f(o)+'"></div>\r\n    <div class="number">',(u=n.count)?o=u.call(t,{hash:{},data:i}):(u=t&&t.count,o=typeof u===a?u.call(t,{hash:{},data:i}):u),s+=f(o)+'</div>\r\n    <div class="count-label">',(u=n.label)?o=u.call(t,{hash:{},data:i}):(u=t&&t.label,o=typeof u===a?u.call(t,{hash:{},data:i}):u),s+=f(o)+"</div>\r\n</div>",s}}),define("packages_psw-brcarr-viewbrowser_src_content_previewLeftCard_html",[],function(){return function(e,t,n,r,i){function f(e,t){var r="",i,s;return r+='\r\n<div class="card preview-left" id="',(s=n.docId)?i=s.call(e,{hash:{},data:t}):(s=e&&e.docId,i=typeof s===o?s.call(e,{hash:{},data:t}):s),r+=u(i)+'">\r\n    <div class="layout-row">\r\n        <div class="col-4 preview thumb">\r\n            <a href="#document/view/SysDocumentsAll/docId/',(s=n.id)?i=s.call(e,{hash:{},data:t}):(s=e&&e.id,i=typeof s===o?s.call(e,{hash:{},data:t}):s),r+=u(i)+'" target="_blank" title="Click to view document" data-tooltip-direction="left">\r\n                <img src="',(s=n.thumb)?i=s.call(e,{hash:{},data:t}):(s=e&&e.thumb,i=typeof s===o?s.call(e,{hash:{},data:t}):s),r+=u(i)+'"/>\r\n            </a>\r\n        </div>\r\n        <div class="summary col-8">\r\n            <div class="layout-row">\r\n                <h1>',(s=n.name)?i=s.call(e,{hash:{},data:t}):(s=e&&e.name,i=typeof s===o?s.call(e,{hash:{},data:t}):s),r+=u(i)+'</h1>\r\n                <div>\r\n                    <span class="meta-label">'+u((i=(i=(i=e&&e.cardFields,i==null||i===!1?i:i[7]),i==null||i===!1?i:i.name),typeof i===o?i.apply(e):i))+"</span>\r\n                    <span>"+u((i=(i=(i=e&&e.cardFields,i==null||i===!1?i:i[7]),i==null||i===!1?i:i.value),typeof i===o?i.apply(e):i))+'</span>\r\n                </div>\r\n                <div>\r\n                    <span class="meta-label">'+u((i=(i=(i=e&&e.cardFields,i==null||i===!1?i:i[9]),i==null||i===!1?i:i.name),typeof i===o?i.apply(e):i))+"</span>\r\n                    <span>"+u((i=(i=(i=e&&e.cardFields,i==null||i===!1?i:i[9]),i==null||i===!1?i:i.value),typeof i===o?i.apply(e):i))+"</span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n",r}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),i=i||{};var s,o="function",u=this.escapeExpression,a=this;return s=n.each.call(t,t,{hash:{},inverse:a.noop,fn:a.program(1,f,i),data:i}),s||s===0?s:""}});var define,console;define("packages/psw-brcarr-viewbrowser/src/js/views/mainView",["jquery","underscore","core","controls","./contentGridView","./navigationView","./toolbarView","../models/viewCollection","logger","application-context","psw-framework-notifications","../../utility/propertyMap","template!../../content/countCard.html","template!../../content/previewLeftCard.html","./formatter"],function(e,t,n,r,i,s,o,u,a,f,l,c,h,p,d){return n.View.extend({selectedViewId:null,documents:null,className:"main-view",initialize:function(t){var a=n.App.config.applicationContextSettings||{};this.applicationContextConfig=a.viewBrowser||{},this.contextSources=this.applicationContextConfig.contextSources||"",this.path=t.path,this.viewCollection=new u,this.ContentView=i,this.NavigationView=s,this.ToolbarView=o,this.navigationView=new s({path:this.path,collection:this.viewCollection}),this.listenTo(this.navigationView,"change:selectedView",this.navigateToView,this),this.on("error",this.onControllerError),this.$alertElement=e("<div/>").addClass("alert-container"),this.alertContainer=new r.AlertContainer(this.$alertElement),this.loadViews()},onControllerError:function(e){var t={message:e.message+" "+e.serverMessage,type:"error"};this.alertContainer.showAlert(t)},loadViews:function(){this.viewCollection.fetch({error:function(e,t,n,r){this.trigger("error",r)}.bind(this)})},navigateToView:function(e,r){if(!e)return;this.selectedViewId=e.id,this.selectedViewCat=e.groupName,r&&(this.vslFilter=r);if(!this.viewCollection.length){this.viewCollection.once("sync",t.bind(function(){this.navigateToView(e,this.vslFilter)},this));return}this.runView(this.selectedViewId,this.vslFilter),this.viewInfo={selectedViewId:this.selectedViewId,selectedViewCat:this.selectedViewCat,viewCollection:this.viewCollection},n.Location.navigate(this.path+"/view/"+this.selectedViewId)},runView:function(e,t,r){var i,s,o,u,a;if(typeof e=="object")i=e.viewId,s=e.viewCat,u=e.viewCollection,a=e.vslText,this.viewInfo.vslText=a;else{if(typeof e!="string")return;i=e,a=t,s="DOCUMENT",u=this.viewCollection}o=u.models.filter(function(e){return e.id===i})[0],o&&o.viewResults.fetch({data:JSON.stringify({vslText:a}),success:function(){o.fetch({id:this.selectedViewId,category:this.selectedViewCat,success:function(e){this.viewInfo.columns=this.gridColumns(e.attributes),this.viewInfo.rows=this.createGridDataObject(o),this.trigger("view:resultsLoaded",this);if(this.viewInfo.contextSource){var t=this.viewInfo.rows,r=[],i,u,a;for(a in t)t.hasOwnProperty(a)&&(i={},i.sourceItem=t[a],u=d.format(i,this.viewInfo.columns,s),r.push(u));this.createContextCards(r);var f=n.Model.extend({url:"https://api.parse.com/1/push"})}}.bind(this),error:function(e,t,n,r){this.trigger("error",r)}.bind(this)})}.bind(this),error:function(e,t,n,r){this.trigger("error",r)}.bind(this)})},gridColumns:function(e){var t=e.columns,n=[],r,i,s;for(s in t)t.hasOwnProperty(s)&&(r=t[s],r.displayType!=="HIDDEN"&&(i={propertyName:r.columnId,name:r.name,type:r.dataType},i.createCellContent=function(e,t,n){var r=n.sourceItem;return e=r.filter(function(e){return e.columnId===t.sourceItem.propertyName})[0].value,e},i.type==="DATE"&&(i.createCellContent=this.dateColumn),e.category==="DOCUMENT"?["24","9"].indexOf(r.columnId)!==-1&&(i.createCellContent=this.iconColumn,i.createColumnHeader=this.emptyColumnHeader):e.category==="WORKFLOW"&&r.columnId==="5"&&(i.createCellContent=this.iconColumn,i.createColumnHeader=this.emptyColumnHeader),n.push(i)));return n},dateColumn:function(e,t,r){var i=r.sourceItem.filter(function(e){return e.columnId===t.sourceItem.propertyName})[0].value;return n.Dates.format(new Date(parseInt(i)),{date:"medium"})},iconColumn:function(e,t,n){var r,i,s,o;o=n.sourceItem.filter(function(e){return e.columnId===t.sourceItem.propertyName})[0].value;if(o==="true")if(t.sourceItem.propertyName==="24")i="icon-workflow",s=t.sourceItem.name;else{if(t.sourceItem.propertyName!=="9")return null;n.sourceItem[12]!=="0"?(i="icon-version_control",s=t.sourceItem.name+": Checked out"):(i="icon-version_control_checked_in",s=t.sourceItem.name+": Checked in")}else o==="1"&&(i="icon-document_full",s="Document");return r=document.createElement("span"),r.setAttribute("aria-hidden",!0),r.setAttribute("title",s),r.className=i,r},emptyColumnHeader:function(){return""},createGridDataObject:function(e){var t=e.attributes.columns;return e.viewResults.models.forEach(function(e){e.attributes.fields.forEach(function(e){e.name=t.filter(function(t){return t.columnId===e.columnId})[0].name})}),e.viewResults.models.map(function(e){return e.attributes.fields})},getDocumentsFromViewResults:function(e,t){var n,r,i;n=e.viewResults.viewCategory,i=e.viewResults.map(function(e){var t={};return e.attributes.fields.filter(function(e){return e.columnId}).forEach(function(e){t[e.columnId]=e.value}),t}),this.viewInfo.documents=i,t&&t(i)},getContextSourceInfo:function(e){var t,r,i,s,o;t=e.source.type,r=e.properties;if(this.contextSources===""){a.log(n.Strings.translate("viewbrowser.mainView.configContextError"),a.ERROR,a.GENERAL);return}i=!1,s=this.applicationContextConfig.contextSources[t];if(s){o=r[s];if(!o){a.log(n.Strings.translate("viewbrowser.mainView.noMatchingProperties")+t,a.WARNING,a.GENERAL);return}return i=!0,o}if(!i){a.log(n.Strings.translate("viewbrowser.mainView.configContextSourceWarning")+t,a.WARNING,a.GENERAL);return}},contextDocSearch:function(t){var n=this.getContextSourceInfo(t.context),r=t.context.source.type,i,s,o;this.viewInfo={groupName:"DOCUMENT",id:"SysDocumentsAll",viewCollection:this.viewCollection,contextSource:r},s="[anyDocKey] startswith '"+n+"'",this.previewLeftCard=e("<div/>"),this.notification=l.NotificationsSystem.addNotification(t.context,this.previewLeftCard),this.notification.state="loading",this.viewCollection=new u,this.viewCollection.fetch({success:function(){this.runView(this.viewInfo.id,s)}.bind(this),error:function(e,t,n,r){this.trigger("error",r)}})},createContextCards:function(e){this.previewLeftCard.html(p.render(e)),this.notification.state="has-content"},render:function(){return this.contentView=new this.ContentView(this.options),this.options.isSmallForm?(this.trigger("navigate",this.navigationView,{transition:"horizontal"}),this.trigger("navigate",this.contentView,{transition:"horizontal",transitionImmediately:this.selectedViewId!==null})):(this.toolbarView=(new this.ToolbarView(this.options)).render(),this.paneContainer=new r.PaneContainer(this.element),this.paneContainer.addPane(this.contentView.element,{dockType:"center",minWidth:400,priority:0}),this.paneContainer.addPane(this.toolbarView.element,{dockType:"top",isFixed:!0,priority:10}),this.navigationPane=this.paneContainer.addPane(this.navigationView.element,{dockType:"left",minWidth:180,priority:5}),this.toolbarView.on("toggle:action",this.onToolbarToggleAction,this),this.toolbarView.on("click:action",this.onGridViewDisplayOption,this),this.listenTo(this.toolbarView,"main:runFilteredView",this.runView)),this.on("view:resultsLoaded",function(){this.contentView.render(this.viewInfo),!this.viewInfo.contextSource&&!this.viewInfo.vslText&&this.toolbarView.loadFilterView(this.viewInfo),this.gridDisplayType&&this.contentView.setDisplayType(this.gridDisplayType)}),this.contentView.render(),this},onToolbarToggleAction:function(e){if(e.action==="setPaneVisibility"){var t=this[e.value+"Pane"];t&&(e.type==="select"?t.show():t.hide())}},onGridViewDisplayOption:function(e){e.action!=="setPaneVisibility"&&(this.contentView.setDisplayType(e.value),this.gridDisplayType=e.value)}})});var define,console;define("packages/psw-brcarr-viewbrowser/src/js/viewBrowserModule",["underscore","core","./views/mainView","application-context"],function(e,t,n,r){return t.Module.extend({mainView:null,path:"viewbrowser",urlParts:null,icon:{className:"icon-app_plan",text:t.Strings.translate("viewbrowser.title")},routes:{"":function(){t.Location.navigate(this.path+"/view",{replace:!0})},view:"runView","view/:id":"runView"},connected:function(){this.mainView=this.mainView||new n({path:this.path,urlParts:this.urlParts}),this.$element.html(this.mainView.render().$element),this.listenTo(r.Manager,"change:context",function(e){this.mainView.contextDocSearch(e)})},runView:function(e){var t={id:e,groupName:"DOCUMENT"};this.mainView.navigateToView(t)}})});var define;define("packages/psw-brcarr-viewbrowser/src/exports",["./js/viewBrowserModule"],function(e){var t={ViewBrowserModule:e};return t})