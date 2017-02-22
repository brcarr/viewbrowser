"use strict";

requirejs.config({
    shim: {
        'underscore': {
            exports: '_'
        }
    },

    paths: {
        'jquery': 'lib/jquery-2.1.0',
        underscore: 'lib/lodash.underscore'
    }
});
