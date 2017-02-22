define('template', ['jquery', 'packages/core/src/lib/handlebars', 'require'], function ($, Handlebars, req) {
    "use strict";

    var runningTemplatePath = null;
    Handlebars.registerHelper('rel', function(path) {
        return require.toUrl(runningTemplatePath + path);
    });

    var logger = console;
    if (require.specified('logger')) {
        req(['logger'], function(Logger) {
            logger = Logger;
        });
    }

    function getKey(name) {
        return name.replace(/[\.\/]/g, '_');
    }

    function Template() { }

    // renderToView allows the use of the top-level element of a template to be used directly as the dom element in a view
    Template.prototype.renderToView = function (view, data) { //data is optional
        var htmlString = this.render(data);
        var el = $(htmlString);
        if(view.id) {
            if(!el.attr('id')) {
                el.attr('id', view.id);
            }
        }

        var prevElement = $(view.$element || view.$el);
        view.setElement(el);
        prevElement.replaceWith(el);
    };

    Template.prototype.load = function(name, req, load, config) {

        function attachPath(template) {
            var render = template.render;
            var templatePath = name.replace(/[^\/]+$/, '');
            template.render = function(model) {
                model = model || {};
                runningTemplatePath = templatePath;
                var output = render.call(template, model);
                runningTemplatePath = null;
                return output;
            };
        }

        var handlebarsTemplate = new Template();
        if (!config.isBuild) {
            var key = getKey(name);

            handlebarsTemplate.location = name;
            if (req.specified(key)) {
                req([key], function (renderFunc) {
                    handlebarsTemplate.render = function (model) { return Handlebars.template(renderFunc)(model); };
                    attachPath(handlebarsTemplate);
                    load(handlebarsTemplate);
                });
            }
            else {
                $.ajax(req.toUrl(name), { dataType: 'text' })
                .done(function (data) {
                    handlebarsTemplate.render = Handlebars.compile(data);
                    attachPath(handlebarsTemplate);
                    load(handlebarsTemplate);
                });
            }
        }
        else {
            load();
        }
    };

    Template.prototype.normalize = function (name, normalize) {
            if (name.match(/\.html?$/) == null)
                name += '.html';

            if (name.match(/\[(.*)\]/)) {
                // We should consider removing this functionality now that we no longer are enforcing a strict directory structure
                logger.log('Usage of brackets to template! plugin is deprecated and not likely to work.  Please use relative paths instead.  name: ' + name, logger.WARNING);
                name = name.replace(/\[(.*)\]\/?(.*)/, 'packages/$1/content/$2');
            }

            // strip any additional plugins from the name to ensure it doesn't interfere with path normalization
            var prefix = '';
            var lastPlugin = name.lastIndexOf('!');
            if (lastPlugin > 0) {
                prefix = name.substring(0, lastPlugin + 1);
                name = name.substring(lastPlugin + 1);
            }

            return prefix + normalize(name);
    };

    Template.prototype.write = function (pluginName, moduleName, write) {
        var fs = require.nodeRequire('fs');

        var HandlebarsShim = (
            '(function() {' +
            'var module = undefined;' +
            fs.readFileSync('../build/handlebars.js').toString() +
            'return Handlebars;})();'
        );

        var Handlebars = eval(HandlebarsShim); // jshint ignore:line

        var renderFunc = fs.readFileSync(moduleName).toString().replace(/^\uFEFF/, ''); // remove BOM;
        renderFunc = Handlebars.precompile(renderFunc).toString();
        write.asModule(getKey(moduleName), 'define(function() { return (' + renderFunc + '); });');
    };

    return new Template();
});
