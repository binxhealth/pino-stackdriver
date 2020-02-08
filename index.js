const split = require('split2')
const pumpify = require('pumpify')

function pinoStackdriver (line) {
  try {
    // Parse the line into an object.
    line = JSON.parse(line)

    // Set the severity based on the level number.
    switch (line.level) {
      case 10: line.severity = 'DEBUG'; break
      case 20: line.severity = 'DEBUG'; break
      case 40: line.severity = 'WARNING'; break
      case 50: line.severity = 'ERROR'; break
      case 60: line.severity = 'CRITICAL'; break
      default: line.severity = 'INFO'
    }

    // Set time as a ISO string instead of Unix time.
    if (line.time) {
      line.time = new Date(line.time).toISOString()
    }

    // Convert the object back to a JSON string.
    line = JSON.stringify(line) + '\n'
  } catch (err) {
    // Don't need to handle the error, just return the original line.
  }

  return line
}

const transform = split(pinoStackdriver)

function createStream (dest = process.stdout) {
  return pumpify(transform, dest)
}

module.exports = { transform, createStream }
