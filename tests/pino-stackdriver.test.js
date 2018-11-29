const { join } = require('path')
const { Readable } = require('stream')

const execa = require('execa')

const pinoStackdriver = join(__dirname, '../')
const lineOne = JSON.stringify({
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
  hostname: 'host',
  level: 30,
  msg: 'A user forgot their password',
  pid: 1,
  req: { path: '/api/password-reset' },
  res: { statusCode: 201 },
  responseTime: 288,
  v: 1
}) + '\n'

test('pino-stackdriver adds severity to log entry', done => {
  const stdin = new Readable({ read () {} })
  const cp = execa('node', [pinoStackdriver])
  let counter = 0
  cp.stdout.on('data', data => {
    expect(JSON.parse(data)).toMatchSnapshot()
    if (counter) {
      done()
    } else {
      counter++
    }
  })
  stdin.pipe(cp.stdin)
  stdin.push(lineOne)
  stdin.push(lineTwo)
  stdin.push(null) // Push null to close the stream.
})
