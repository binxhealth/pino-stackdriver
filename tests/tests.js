const { join } = require('path')
const os = require('os')
const { Readable, Writable } = require('stream')
const { test } = require('@ianwalter/bff')
const execa = require('execa')
const pino = require('pino')
const { createStream } = require('../index')

const pinoStackdriver = join(__dirname, '../cli')
const lineOne = JSON.stringify({
  time: 1544043395681,
  hostname: 'host',
  level: 50,
  msg: 'TestError: blah blah blah',
  pid: 1,
  req: { path: '/test' },
  res: { statusCode: 500 },
  responseTime: 116,
  v: 1
}) + '\n'
const lineTwo = JSON.stringify({
  time: 1544043391245,
  hostname: 'host',
  level: 30,
  msg: 'A user forgot their password',
  pid: 1,
  req: { path: '/api/password-reset' },
  res: { statusCode: 201 },
  responseTime: 288,
  v: 1
}) + '\n'
const lineThree = "{ Error => `Lalala-la lalal-la Elmo's world!` }"

test('pino-stackdriver adds severity to log entry via stdin', ({ expect }) => {
  return new Promise(resolve => {
    const stdin = new Readable({ read () {} })
    const cp = execa('node', [pinoStackdriver], { reject: false })

    let lines = []
    cp.stdout.on('data', data => {
      const rawLines = data.toString().split('\n')
      lines = lines.concat(rawLines.filter(line => line))
    })
    cp.stdout.on('close', () => {
      expect(lines).toMatchSnapshot()
      resolve()
    })

    // Write logs to stream.
    stdin.pipe(cp.stdin)
    stdin.push(lineOne)
    stdin.push(lineTwo)
    stdin.push(lineThree)

    // Push null to close the streams.
    stdin.push(null)
    cp.stdin.push(null)
  })
})

test('pino-stackdriver adds severity to log entry via createStream',
  ({ expect }) => {
    return new Promise(resolve => {
      const pid = process.pid
      const hostname = os.hostname()
      const originalDateNow = Date.now
      Date.now = () => 1544043395681

      let lines = []
      const stdout = new Writable({
        write (data, enc, next) {
          const line = data.toString()
            .split('\n')
            .filter(line => line)
            .map(JSON.parse)
          lines = lines.concat(line)
          next()
        }
      })

      stdout.on('close', () => {
        Date.now = originalDateNow
        expect(lines).toEqual(
          [
            {
              level: 30,
              time: '2018-12-05T20:56:35.681Z',
              pid,
              hostname,
              msg: 'some message',
              v: 1,
              severity: 'INFO'
            },
            {
              level: 20,
              time: '2018-12-05T20:56:35.681Z',
              pid,
              hostname,
              msg: 'another message',
              v: 1,
              severity: 'DEBUG'
            },
            {
              level: 50,
              time: '2018-12-05T20:56:35.681Z',
              pid,
              hostname,
              msg: 'an error',
              v: 1,
              severity: 'ERROR'
            }
          ]
        )
        resolve()
      })

      // Create logger and write logs
      const logger = pino({ level: 'debug' }, createStream(stdout))
      logger.info('some message')
      logger.debug('another message')
      logger.error('an error')

      // Push null to close the stdout stream.
      stdout.destroy()
    })
  })
