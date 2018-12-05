#!/usr/bin/env node

const split = require('split2')
const parseJson = require('fast-json-parse')
const fastJson = require('fast-json-stringify')

const stringifyJson = fastJson({
  type: 'object',
  properties: {
    time: { type: 'integer' },
    hostname: { type: 'string' },
    level: { type: 'integer' },
    msg: { type: 'string' },
    pid: { type: 'integer' },
    req: { type: 'object', additionalProperties: true },
    res: { type: 'object', additionalProperties: true },
    responseTime: { type: 'integer' },
    v: { type: 'integer' },
    severity: { type: 'string' }
  }
})

function pinoStackdriver (line) {
  const { value } = parseJson(line)
  if (value) {
    switch (value.level) {
      case 10: value.severity = 'DEBUG'; break
      case 20: value.severity = 'DEBUG'; break
      case 30: value.severity = 'INFO'; break
      case 40: value.severity = 'WARNING'; break
      case 50: value.severity = 'ERROR'; break
      case 60: value.severity = 'CRITICAL'; break
    }
    line = stringifyJson(value)
  }
  return line + '\n'
}

process.stdin.pipe(split(pinoStackdriver)).pipe(process.stdout)
