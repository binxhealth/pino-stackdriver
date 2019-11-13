#!/usr/bin/env node

const transform = require('./index').transform

process.stdin.pipe(transform).pipe(process.stdout)
