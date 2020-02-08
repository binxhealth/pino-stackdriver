#!/usr/bin/env node

const { transform } = require('./index')

process.stdin.pipe(transform).pipe(process.stdout)
