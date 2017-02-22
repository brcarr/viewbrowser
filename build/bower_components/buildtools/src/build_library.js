var fs = require('fs');     // For file system related operations
var util = require('util'); // util.puts writes synchronously
var less = require('less');

var packageName = process.argv[2];
var packagesFolder = (process.argv[3] || ''); // defaults to 'packages'
var packageExcludes = process.argv[4].split(',');
var workingDirectory = process.argv[5];
var buildVersion = process.argv[6];
var optimizeParamater = process.argv[7] == 'none' ? 'none' : null;
var buildName = process.argv[8];

var outputDir = workingDirectory + '/' + buildName;

/*
Due a bug in the way the jvm handles empty commandline args
we are forced to pass in none instead of empty string.
Bug description here: http://bugs.sun.com/view_bug.do?bug_id=6518827
*/
packagesFolder = (packagesFolder === 'none') ? '' : packagesFolder;
var packagePath = packagesFolder + packageName + '/';

/*
util.puts("build_module.js with the following parameters: \n" +
    "   packageName: " + packageName + "\n" +
    "   packagesFolder: " + packagesFolder + "\n" +
    "   workingDirectory: " + workingDirectory + "\n" +
    "   buildVersion: " + buildVersion + "\n" +
    "   optimizeParamater: " + optimizeParamater + "\n" +
    "   buildName: " + buildName + "\n"
);
*/

process.chdir(workingDirectory);

function recursiveFileList(dir, ext) {
    var files = fs.readdirSync(dir);
    var subDirs = files.filter(function (f) { return fs.statSync(dir + '/' + f).isDirectory(); })
                       .map(function (d) { return dir + '/' + d; });

    // match on extension
    files = files.filter(function (file) { return !ext || file.match(new RegExp('.' + ext + '$')); })
                 .map(function (file) { return (dir + '/' + file).replace(/^\.\/\/?/, ''); });

    // search subdirectories
    return [].concat.apply(files, subDirs.map(function (dir) { return recursiveFileList(dir, ext); }));
}

function buildJavascript(packageDependencies) {
    var rjs = require('requirejs/bin/r');

    var rjsConfig = {
        baseUrl: '.',
        appDir: '.',
        dir: outputDir,
        paths: {
            'underscore': 'lib/lodash.underscore',
            'jquery': 'empty:',
            'logger': 'empty:',
            'lib/jquery-2.1.0': 'empty:',
            'lib/require': 'empty:',
            'packages/core/src/lib/handlebars': '../build/handlebars'
        },

        shim: {
            'underscore': {
                exports: '_'
            },

            'packages/core/src/lib/backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },

            'packages/core/src/lib/handlebars': {
                exports: 'Handlebars'
            },

            'packages/core/src/lib/less': {
                exports: 'less'
            }
        },

        removeCombined: true,
		
        uglify: {
            ascii_only: false
        }
    };

    if (optimizeParamater) {
        rjsConfig.optimize = optimizeParamater;
    }

    var allJsFiles = recursiveFileList('.', 'js');

    var reversePathMap = {};
    Object.keys(rjsConfig.paths).forEach(function (key) { reversePathMap[rjsConfig.paths[key]] = key; });

    function listJs() {

        var dirs = [].map.call(arguments, function (dir) { return dir + '/'; }); // convert to array

        return allJsFiles.filter(function (file) { return dirs.some(function (dir) { return file.indexOf(dir) === 0; }); }) // within specified folders
                         .map(function (file) { return file.replace(/\.js$/, ''); })                                       // remove the extension
                         .map(function (file) { return reversePathMap[file] || file; });                                   // avoid path collisions from rjsConfig.paths
    }

    // Get a list of our require plugins
    var pluginList = fs.readdirSync('packages/core/src')
                       .filter(function (file) { return /^require-.*\.js$/.test(file); })
                       .map(function (file) { return file.match(/^require-(.*)\.js$/)[1]; });

    // Map the require plugin aliases to the actual files
    pluginList.forEach(function (plugin) { rjsConfig.paths[plugin] = 'packages/core/src/require-' + plugin; });

    rjsConfig.paths.lib = 'empty:';
    rjsConfig.paths.underscore = 'empty:'; // this is needed because underscore is explicitly named in rjsConfig.paths

    packageExcludes.forEach(function (folderName) {
        if (folderName.trim()) rjsConfig.paths[folderName] = 'empty:';
    });

    packageDependencies.forEach(function (value) {
        rjsConfig.paths[value] = "empty:";
    });

    var outputPath = packagesFolder + packageName + '/' + packageName;
    rjsConfig.modules = [
        { create: true, name: outputPath, include: listJs(packagesFolder + packageName), exclude: pluginList.concat(packageExcludes, packageDependencies, 'logger') } // directly from package.json
    ];

    rjsConfig.modules[0].include = rjsConfig.modules[0].include.filter(function(name) {
        return rjsConfig.modules[0].exclude.indexOf(name) === -1;
    });

    rjs.optimize(rjsConfig, function () {
        if (fs.existsSync(rjsConfig.dir + '/build.txt')) fs.unlinkSync(rjsConfig.dir + '/build.txt');

        // delete html template files
        recursiveFileList(buildName.replace(/\/$/, ''), 'html')
            .filter(function (file) { return file.match(/.*\//) != buildName + '/'; }) // exclude those in root path
            .forEach(function (file) { fs.unlinkSync(file); });                        // delete

        function removeEmptyFolders(dir) {
            var files = fs.readdirSync(dir);

            files.filter(function (f) { return fs.statSync(dir + '/' + f).isDirectory(); })
                 .forEach(function (d) { removeEmptyFolders(dir + '/' + d); });

            files = fs.readdirSync(dir);

            if (files.length === 0) {
                fs.rmdirSync(dir);
            }
        }

        removeEmptyFolders(buildName);
    });

    logModuleData(rjsConfig);
}

function buildCss(manifest) {
    var config = manifest.data.config;
    if (!(config && config.stylesheet && config.stylesheet.match(/\.less$/))) return;

    var rootPath = manifest.path.replace(/[^\/]*$/, '');
    var inputPath = rootPath + config.stylesheet;
    config.stylesheet = config.stylesheet.replace('.less', '.css');

    try {
        var parser = new less.Parser({
            paths: [rootPath],
            relativeUrls: true,
            filename: inputPath
        });

        parser.parse(fs.readFileSync(inputPath).toString(), function (e, data) {
            if (e) throw e;
            fs.writeFileSync(rootPath + config.stylesheet, data.toCSS(), 'utf-8');
            recursiveFileList(rootPath, 'less').forEach(function (f) { fs.unlink(f); });
        });
    }
    catch (e) {
        throw JSON.stringify(e, null, 4);
    }
}

function readPackageFile() {
    var path = packagesFolder + packageName + '/' + 'package.json';
    return {
        data: JSON.parse(fs.readFileSync(path).toString('utf-8').replace(/^\uFEFF/, '')), // regex removes BOM
        path: path
    };
}

function writePackageFile(manifest) {
    if (fs.existsSync(manifest.path)) {
        fs.writeFileSync(manifest.path, JSON.stringify(manifest.data, null, 4));
    } else {
        util.puts('could not find file ' + manifest.path);
    }
}

function logModuleData(rjsConfig) {
    if (rjsConfig.optimize == 'none') {
        rjsConfig.modules.map(function (module) { return module.name; }).forEach(function (fileName) {
            util.puts(
                fileName + '\n' + fileName.replace(/./g, '-') + '\n' +
                fs.readFileSync(rjsConfig.dir + '/' + fileName + '.js')
                    .toString()
                    .split('\n')
                    .filter(function (line) { return line.match(/^define\s*\(['"](\w+)/); })
                    .map(function (line) { return line.match(/^define\s*\(['"]([^'"]+)/)[1]; })
                    .sort()
                    .join('\n') +
                    '\n\n'
            );
        });
    }
}

var manifest = readPackageFile();
var packageDependencies = Object.keys(manifest.data.dependencies || {});
buildJavascript(packageDependencies);
manifest.path = buildName + '/' + manifest.path; // update to copy from r.js
buildCss(manifest);
manifest.data.build = buildVersion;
writePackageFile(manifest);

util.puts('Build finished.');

// This is to give the console output time to finish printing
setTimeout(function () { }, 100);



