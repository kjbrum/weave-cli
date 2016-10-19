'use strict';

const fs = require('fs');
const chalk = require('chalk');
const emmet = require('emmet');
const parser = require('emmet/lib/parser/abbreviation');

const success = chalk.green;
const warn = chalk.yellow;
const error = chalk.red;

// Do the good stuff
const sbx = module.exports = (template, opts, cb) => {
    if (typeof opts !== 'object') {
        cb = opts;
        opts = {};
    }

    if (!template) {
        throw new Error('JSON template file required');
    }

    if (typeof cb !== 'function') {
        throw new Error('Callback function required');
    }

    var json = getTemplate(template);
    console.log(json);

    if (opts.partials) {
        console.log('Make partials...');
        loopObj(json, function(key, val) {
            console.log(key + ' ==> ' + val);
            var html = parser.expand(val, {profile: 'html'});
            html.replace('${0}', '#');

            createPartial(key, html);
        });
    } else {
        // TODO
        console.log('Make pages...');
    }


};

// Loop through an object
const loopObj = function(obj, cb) {
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        // Run the callback function
        cb(key, obj[key]);
    }
}

// Get the contents of the template file
const getTemplate = (template) => {
    try {
        template = fs.readFileSync(template, 'utf8');
    } catch (e) {
        console.log(error(e));
        process.exit(0);
    }

    return JSON.parse(template);
}

// Create a new partial
var createPartial = (path, html) => {
    console.log(path, html);
}
