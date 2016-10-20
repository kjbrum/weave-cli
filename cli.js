#!/usr/bin/env node
'use strict';

const meow  = require('meow');
const chalk   = require('chalk');
const sbxProtoCLI = require('./');
const warn = chalk.yellow;

// Handle the arguments
const cli = meow(`
    Usage:
      $ sbx-proto <path/to/template> <options>

    Options:
      --pages       Parse the JSON template to pages
      --partials    Parse the JSON template to partials

    Example:
      $ sbx-proto test/tester-pages.json --pages
      $ sbx-proto test/tester-partials.json --partials
`);

// Check if a json file is supplied
if(!cli.input[0]) {
    console.error(warn('You must provide a JSON template file.'));
    process.exit(1);
}

// Check if a template file is supplied
if(!cli.flags.partials && !cli.flags.pages) {
    console.error(warn('You must supply the --pages or --partials flag.'));
    process.exit(1);
}

// Call the sbx module
sbxProtoCLI(cli.input[0], cli.flags, function(err, res) {
    if(err) throw err;

    process.exit(0);
});
