/*jslint nomen: true */
var define;
define(['underscore', 'core'], function (_, Core) {
    'use strict';

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