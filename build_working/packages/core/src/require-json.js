define ('json', ['jquery'], function($) {
    "use strict";

    var Json = {
        load: function(name, parentRequire, onload, config) {
            if (config.isBuild) {
                Json.config = config;
                onload({});
                return;
            }

            name = name.replace('static:', '') + '.json';

            // Handle static includes
            if (parentRequire.specified(name)) {
                parentRequire([name], onload);
            }
            else {
                Json.getJSON(parentRequire.toUrl(name))
                .done(function (data) {
                    onload(data);
                })
                .fail(function (xhr, error) {
                    onload.error({name:name, error:error});
                });
            }
        },

        normalize: function (name, normalize) {
            var prefix = name.match(/^static:/) || [''];
            return prefix + normalize(name.replace(/^static:/, ''));
        },

        write: function (pluginName, moduleName, write) {
            if (moduleName.indexOf('static:') === 0) {
                moduleName = moduleName.replace(/^static:/, '') + '.json';
                var fs = Json.nodeRequire('fs');
                var data = fs.readFileSync(Json.config.dir + moduleName).toString('utf-8');
                data = data.replace(/^\uFEFF/, ''); // remove BOM
                write("define('" + moduleName + "', [], " + data + ");");
                fs.unlink(Json.config.dir + moduleName);
            }
        },

        nodeRequire: require.nodeRequire,
        getJSON: function () { return $.getJSON.apply(Json, arguments); }
    };

    return Json;
});
