define('platform', [], function () { // currently, the build system flakes out if you don't provide a name
    

    function Platform() {}

    Platform.prototype.setPlatformDetector = function (detector) {
        this.detector = detector;
    };

    Platform.prototype.load = function(name, req, load, config) {
        if (config.isBuild) {
            var platforms = name.match(/\{(.*)\}/);
            if (platforms && platforms.length > 1) {
                platforms = platforms[1].split(/\W/);
                platforms.push(''); // in case there are no matches

                for (var i = 0; i < platforms.length; i++) {
                    platforms[i] = name.replace(/\{.*\}/, platforms[i])
                                       .replace(/([^:])\/\//, '$1/');

                    req([platforms[i]], load);
                }
            }
        }
        else {
            var type = this.detector.type();
            if (name.match('\\{.*?\\b' + type + '\\b.*?\\}') == null) {
                type = '';
            }

            name = name.replace(/\{.*?\}/g, type)     //    foo/{phone}/bar => foo//bar
                       .replace(/([^:])\/\//, '$1/'); //    foo//bar        => foo/bar

            req([name], function (resource) {
                load(resource);
            });
        }
    };

    Platform.prototype.normalize = function (name, normalize) {
        // strip any additional plugins from the name to ensure it doesn't interfere with path normalization
        var prefix = '';
        var lastPlugin = name.lastIndexOf('!');
        if (lastPlugin > 0) {
            prefix = name.substring(0, lastPlugin + 1);
            name = name.substring(lastPlugin + 1);
        }

        return prefix + normalize(name);
    };

    return new Platform();
});
