#!/usr/bin/env node

const split = require('split2')
const parseJson = require('fast-json-parse')

function pinoStackdriver (line) {
  const { value } = parseJson(line)
  if (value) {
    switch (value.level) {
      case 10: value.severity = 'DEBUG'; break
      case 20: value.severity = 'DEBUG'; break
      case 40: value.severity = 'WARNING'; break
      case 50: value.severity = 'ERROR'; break
      case 60: value.severity = 'CRITICAL'; break
      default: value.severity = 'INFO'
    }
    if (value.time) {
      value.time = new Date(value.time).toISOString()
    }
    line = JSON.stringify(value)
  }
  return line + '\n'
}

process.stdin.pipe(split(pinoStackdriver)).pipe(process.stdout)
