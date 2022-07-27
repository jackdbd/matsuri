# @jackdbd/hapi-logger-plugin

[![npm version](https://badge.fury.io/js/@jackdbd%2Fhapi-logger-plugin.svg)](https://badge.fury.io/js/@jackdbd%2Fhapi-logger-plugin)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Fhapi-logger-plugin)

Hapi plugin that...

## Installation

```sh
npm install @jackdbd/hapi-logger-plugin
```

## Usage

TODO

```js
import logger from '@jackdbd/hapi-logger-plugin'

export const app = async (config) => {

  const server = Hapi.server({ port: 8080 })

  server.log(['lifecycle'], {
    message: `HTTP server created.`
  })

  await server.register({
    plugin: logger,
    options: {
      namespace: 'my-app',
    }
  })

  server.log(['lifecycle', 'plugin'], {
    message: `Logger plugin registered.`
  })

  return { server }
}
```

## Configuration

### Options

| Option | Default | Explanation |
| --- | --- | --- |
| `namespace` | `My App` | TODO. |
