var define, describe, beforeEach, expect, it;
define(['core', '../../src/js/viewBrowserModule'], function (Core, ViewBrowserModule) {
    'use strict';

    describe('ViewBrowserModule', function () {
        var module = null;

        beforeEach(function () {
            module = new ViewBrowserModule();
        });

        it('defines a path', function () {
            expect(module.path).toBe('viewbrowser');
        });

        describe('routes', function () {
            //todo: test your route handlers
        });

        describe('icon', function () {
            it('defines className', function () {
                expect(module.icon.className).not.toBeNull();
            });

            it('sets the text', function () {
                expect(module.icon.text).toBe(Core.Strings.translate('viewbrowser.title'));
            });
        });
    });
});