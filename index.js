'use strict';

const fs = require('fs');
const chalk = require('chalk');
const emmet = require('emmet');
const parser = require('emmet/lib/parser/abbreviation');

const success = chalk.green;
const warn = chalk.yellow;
const error = chalk.red;

const sbx = module.exports = (template, opts, cb) => {
    if(typeof opts !== 'object') {
        cb = opts;
        opts = {};
    }

    if(!template) {
        throw new Error('JSON template file required');
    }

    if(typeof cb !== 'function') {
        throw new Error('Callback function required');
    }

    var json = getTemplate(template);

    console.log(json);
};

const getTemplate = (template) => {
    try {
        template = fs.readFileSync(template, 'utf8');
    } catch(e) {
        console.log(error(e));
        process.exit(0);
    }

    return JSON.parse(template);
}
