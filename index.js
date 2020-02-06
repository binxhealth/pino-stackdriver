const split = require('split2')
const parseJson = require('fast-json-parse')
const pumpify = require('pumpify')

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

const transform = split(pinoStackdriver)

function createStream (dest = process.stdout) {
  return pumpify(transform, dest)
}

module.exports = { transform, createStream }
