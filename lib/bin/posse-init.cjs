#!/usr/bin/env node
'use strict';

var fse = require('fs-extra');
var path = require('node:path');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var fse__namespace = /*#__PURE__*/_interopNamespaceDefault(fse);

if (!process.env.INIT_CWD) {
    throw new Error("For some reason, INIT_CWD wasn't set.");
}
const posseNodeModulePath = path.join(process.env.INIT_CWD, 'node_modules', 'posse');
console.log('Copying fragments...');
fse__namespace.copySync(path.join(posseNodeModulePath, 'scaffolding', 'fragments'), path.join(process.env.INIT_CWD, 'fragments'), {
    overwrite: true,
});
console.log('Copying example site...');
fse__namespace.copySync(path.join(posseNodeModulePath, 'scaffolding', 'site'), path.join(process.env.INIT_CWD, 'site'), { overwrite: true });
