'use strict';

module.exports = function(context) {
return '<!doctype html>'+
        '<html>'+
        '<head>'+
            '<meta charset="utf-8">'+
            '<title>{title}</title>'+
            '<link rel="stylesheet" href="../node_modules/mocha/mocha.css" />'+
        '</head>'+
        '<body>'+
            '<div id="mocha"></div>'+
            '<script src="../node_modules/mocha/mocha.js"></script>'+
            '<script src="../node_modules/mocha/chai.js"></script>'+
            '<script src="../node_modules/mocha/chai-as-promised.js"></script>'+
            '<script>'+
                'mocha.setup("bdd")'+
            '</script>'+
            '<script src="'+context.main+'?js=ok"></script>'+
            '<script>'+
                'mocha.checkLeaks();'+
                'mocha.run();'+
            '</script>'+
        '</body>'+
        '</html>';
};
