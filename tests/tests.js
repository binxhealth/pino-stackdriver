const { join } = require('path')
const { Readable } = require('stream')
const { test } = require('@ianwalter/bff')
const execa = require('execa')

const pinoStackdriver = join(__dirname, '../')
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

test('pino-stackdriver adds severity to log entry', ({ expect }) => {
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
