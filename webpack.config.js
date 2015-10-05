'use strict';

var getConfig = require('hjs-webpack'),
    htmlCreator = require('./tests/lib/html-creator.js');

module.exports = getConfig({
    in: './tests/app/tests.js',
    out: './tests',
    html: function (context) {
        return {
          'index.html': htmlCreator(context)
        };
    },
    isDev: true,
    clearBeforeBuild: '!(app|assets|lib)'
});