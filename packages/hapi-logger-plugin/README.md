# @jackdbd/hapi-logger-plugin

[![npm version](https://badge.fury.io/js/@jackdbd%2Fhapi-logger-plugin.svg)](https://badge.fury.io/js/@jackdbd%2Fhapi-logger-plugin)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Fhapi-logger-plugin)

Hapi plugin that uses [tags-logger](https://www.npmjs.com/package/@jackdbd/tags-logger) for logging events emitted by [server.log()](https://hapi.dev/tutorials/logging/?lang=en_US#server.log) and [request.log()](https://hapi.dev/tutorials/logging/?lang=en_US#request.log).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details><summary>Table of Contents</summary>

- [Installation](#installation)
- [Usage](#usage)
  - [structured logging](#structured-logging)
  - [unstructured logging](#unstructured-logging)
  - [example: Cloud Run service](#example-cloud-run-service)
- [Configuration](#configuration)
  - [Environment variables](#environment-variables)
  - [Options](#options)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Installation

```sh
npm install @jackdbd/hapi-logger-plugin
```

## Usage

### structured logging

```ts
import logger from '@jackdbd/hapi-logger-plugin'

export const app = async (config) => {

  const server = Hapi.server({ port: 8080 })

  await server.register({ plugin: logger })

  return { server }
}
```

### unstructured logging

```ts
import logger from '@jackdbd/hapi-logger-plugin'

export const app = async (config) => {

  const server = Hapi.server({ port: 8080 })

  await server.register({
    plugin: logger,
    options: {
      namespace: 'my-app'
    }
  })

  return { server }
}
```

### example: Cloud Run service

You likely want to use unstructured logging when the code is running on Cloud Run, and unstructured logging when it's running locally (regardless whether it a containerized Node.js app or a containerized one).

Also, you might want to validate the log statements only in development.

Here is a configuration you might try:

```ts
import logger from '@jackdbd/hapi-logger-plugin'

export const app = async (config) => {

  const server = Hapi.server({ port: 8080 })

  await server.register({
    plugin: logger,
    options: {
      // when the code runs as a Cloud Run service, don't set `namespace`
      namespace: process.env.K_SERVICE ? undefined : 'my-app',
      // when in production, don't validate log statements
      should_validate_log_statements: process.env.NODE_ENV === 'production' ? false : true
    }
  })

  return { server }
}
```

## Configuration

### Environment variables

| Environment variable | Explanation |
| --- | --- |
| `DEBUG` | You must set this environment variable if you want to use unstructured logging and see some output. For example, if you set `namespace: 'my-app'`, Hapi [server.log()](https://hapi.dev/tutorials/logging/?lang=en_US#server.log) events will be logged to the `my-app/log-event` namespace, and Hapi [request.log()](https://hapi.dev/tutorials/logging/?lang=en_US#request.log) events will be logged to the `my-app/request-event` namespace. So, for example, `DEBUG=my-app/*` will log all events, while `DEBUG=my-app/request-event` or `DEBUG=my-app/*,-my-app/log-event` will log only the `request.log()` events. |

### Options

| Option | Default | Explanation |
| --- | --- | --- |
| `channels` | `['app']` | The event channels you want to log. |
| `namespace` | `undefined` | The namespace for unstructured logging. This option has no effect when using structured logging. |
| `should_use_emoji_for_severity` | `true` | Whether to use an emoji for the severity level, when using unstructured logging. This option has no effect when using structured logging. |
| `should_validate_log_statements` | `false` when `NODE_ENV` is `'production'`, `true` otherwise | Whether each log statement should be validated against a [Joi](https://github.com/sideway/joi) schema. |
