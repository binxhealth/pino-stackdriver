const { join } = require('path')
const spawn = require('child_process').spawn

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
})
const lineTwo = JSON.stringify({
  hostname: 'host',
  level: 30,
  msg: 'A user forgot their password',
  pid: 1,
  req: { path: '/api/password-reset' },
  res: { statusCode: 201 },
  responseTime: 288,
  v: 1
})

test('pino-stackdriver adds severity to log entry', done => {
  const child = spawn('node', [pinoStackdriver])
  child.on('error', done.fail)
  child.stdout.on('data', data => {
    console.log('data', data.toString())
  })
  child.stdin.write(lineOne)
  child.stdin.write(lineTwo)
  child.kill()
  done()
})
