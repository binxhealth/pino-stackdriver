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

Or pass the stream to [pino][pinoUrl]
```javascript
import { stream } from '@binxhealth/pino-stackdriver';

const logger = pino(
  {
    level: 'debug',
  },
  stream
);

logger.info('This works the same as usual...');
logger.error('...and will log to stdout with the correct Stackdriver format');
```


[pinoUrl]: http://getpino.io/#/
[ciImage]: https://github.com/binxhealth/pino-stackdriver/workflows/CI/badge.svg
[ciUrl]: https://github.com/binxhealth/pino-stackdriver/actions
