#!/usr/bin/env node
'use strict';

var nodemon = require('nodemon');

nodemon({
    exec: 'yarn posse-build && npx http-server -c-1',
    watch: [`site`],
    cwd: process.env.INIT_CWD,
    verbose: true,
    legacyWatch: true,
});
