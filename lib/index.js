var debug = require('debug')('metalsmith-title');
var extname = require('path').extname;
var basename = require('path').basename;
var dirname = require('path').dirname;
var fs = require('fs');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

function findByHeader(content) {
    var header = 1;

    while (header < 7) {
        var heading = content.match(createHeaderRegex(header));

        if (heading) {
            return heading[1];
        }
        header++;
    }
    return null;
}

function createHeaderRegex(type) {
    return new RegExp('<h' + type + '[^>]*>([^<>]+)<\/h' + type + '>', 'i');
}
/**
 * A Metalsmith plugin that add title automatically
 *
 * @return {Function}
 */

function plugin(options) {
    options = options || {};

    return function (files, metalsmith, done) {
        setImmediate(done);
        Object.keys(files).forEach(function (file) {
            var data = files[file];
            if (data.title) return; // skip existing

            if (markdown(file)) {
                var heading = data.contents.toString().match(/^ *# *([^\n]+?) *#* *(?:\n+|$)/m);
                data.title = (heading) ? heading[1] : null;
            }

            if (html(file)) {
                data.title = findByHeader(data.contents.toString());
            }

            files[file] = data;
        });
    };
}

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function markdown(file) {
    return /\.md|\.markdown/.test(extname(file));
}

/**
 * Check if a `file` is html.
 *
 * @param {String} file
 * @return {Boolean}
 */

function html(file) {
    return /\.html?/.test(extname(file));
}
