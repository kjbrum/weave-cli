'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const parser = require('emmet/lib/parser/abbreviation');
const chalk = require('chalk');

const success = chalk.green;
const warn = chalk.yellow;
const error = chalk.red;
const partialsDir = 'partials/';

// ~~~~~~~~~~ Perform black magic ~~~~~~~~~~ //
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

    // Check if we should be parsing a partials or pages template
    if (opts.partials) {
        loopObj(json, (key, val) => {
            // Expand the string to actual code
            var html = parser.expand(val, {
                profile: 'html'
            });

            // Create the partial
            createPartial(key, html);
        });
    } else {
        // TODO
        console.log('Make pages...');
    }


};

// Loop through an object
const loopObj = (obj, cb) => {
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
    } catch (err) {
        console.error(error(e));
        process.exit(0);
    }

    return JSON.parse(template);
}

// Create a new partial
var createPartial = (path, html) => {
    var ogPath = path;
    var lastIndex = ogPath.lastIndexOf('/');
    var path = ogPath.substring(0, lastIndex + 1);
    var filename = ogPath.substring(lastIndex + 1, ogPath.length) + '.mustache';

    // Create the necessary directories and the partial
    mkdirp(partialsDir + path, function(err) {
        if (err) {
            console.error(error(err));
            process.exit(0);
        } else {
            fs.writeFile(partialsDir + path + filename, html, (err) => {
                if (err) {
                    console.error(error(err));
                    process.exit(0);
                } else {
                    console.log(success(filename + ' created at ' + partialsDir + path));
                }
            });
        }
    });
}
