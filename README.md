# @binxhealth/pino-stackdriver
> A utility that makes express-[pino][pinoUrl] logs StackDriver-compatible

[![CI][ciImage]][ciUrl]

## Installation

```console
yarn add @binxhealth/pino-stackdriver --dev
```

## Usage

```console
node server.js | npx pino-stackdriver
```

Or with a global install:

```console
node server.js | pino-stackdriver
```

Or create a new stream and pass it to [pino][pinoUrl]
```js
import pino from 'pino';
import { createStream } from '@binxhealth/pino-stackdriver';

const logger = pino(
  {
    level: 'debug',
  },
  createStream()
);

logger.info('This works the same as usual...');
logger.error('...and will log to stdout with the correct Stackdriver format');
```

## API

* [createStream() => Pumpify](#export)

## `createStream([destination]) => Pumpify`

The exported `createStream` function takes one optional argument, [`destination`](#destination) and
returns a [pumpify instance][pumpify].

<a id="destination"></a>
### `destination` (WritableStream | SonicBoom)

Default: `process.stdout`

The `destination` parameter, at a minimum must be an object with a `write` method.
An ordinary Node.js `stream` can be passed as the destination (such as the result
of `fs.createWriteStream`).

For peak log writing performance it is strongly
recommended to use `pino.destination` or `pino.extreme` to create the destination file stream.

```js
import pino from 'pino';
import { createStream } from '@binxhealth/pino-stackdriver';

// process.stdout by default
const stdoutLogger = pino({}, createStream());

// write the stream to a file
const fileLogger = pino({}, createStream(pino.destination('/log/path')));
```

[pinoUrl]: http://getpino.io/#/
[pumpify]: https://www.npmjs.com/package/pumpify
[ciImage]: https://github.com/binxhealth/pino-stackdriver/workflows/CI/badge.svg
[ciUrl]: https://github.com/binxhealth/pino-stackdriver/actions
