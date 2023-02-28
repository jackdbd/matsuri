# @jackdbd/hapi-telegram-plugin

[![npm version](https://badge.fury.io/js/@jackdbd%2Fhapi-telegram-plugin.svg)](https://badge.fury.io/js/@jackdbd%2Fhapi-telegram-plugin)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Fhapi-telegram-plugin)

Hapi plugin that sends a message to a Telegram chat when a request matches one of the rules you defined.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details><summary>Table of Contents</summary>

- [Installation](#installation)
- [Preliminary Operations](#preliminary-operations)
  - [Create a Telegram bot with BotFather](#create-a-telegram-bot-with-botfather)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Options](#options)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Installation

```sh
npm install @jackdbd/hapi-telegram-plugin
```

## Preliminary Operations

### Create a Telegram bot with BotFather

A Telegram bot is an API that implements webhooks. When you create a Telegram bot with [BotFather](https://telegram.me/BotFather), Telegram creates an API on its servers. You can then make HTTP requests to this API.

This Hapi plugin makes a POST request to the [/sendMessage](https://core.telegram.org/bots/api#sendmessage) endpoint whenever there is an error in your request handlers.

Create a Telegram bot with the following steps:

1. Open a Telegram chat with BotFather and enter the `/newbot` command.
1. Choose a `name` and a `username` for your bot. The `name` can be anything and you can change it any time. The `username` is unique, you cannot change it, and must end with `_bot`. Write down the bot `token` that BotFather returns you.

> :information_source: You can see your Telegram bot `token` at any time:
>
> 1. open a chat with BotFather
> 1. enter the `/mybots` command
> 1. select the bot you are interested in
> 1. click `API token`

See also the ufficial Telegram documentation:

- [Bots: An introduction for developers](https://core.telegram.org/bots).
- [sendMessage](https://core.telegram.org/bots/api#sendmessage) API endpoint.
- [message formatting options](https://core.telegram.org/bots/api#formatting-options). A Telegram message can be 1-4096 characters long, after entities parsing.

## Usage

You define request rules like this one:

```ts
{
  name: 'notify me of any server error (e.g. internal server error)',
  chat_id: 'YOUR-TELEGRAM-CHAT-ID',
  token: 'YOUR-TELEGRAM-BOT-TOKEN',
  predicate: isServerRequestError,
  text: serverError
}
```

...and this plugin sends a Telegram message like this one:

![Telegram message about an internal server error in your Hapi app](https://github.com/jackdbd/matsuri/blob/e295034b8eaf3a9dc83cd9ef6641fa84eb23bcea/assets/images/hapi-telegram-plugin-internal-server-error.png?raw=true)

Let's say that you want to receive notifications for server errors (i.e. HTTP 5xx), and notifications for unauthorized errors (i.e. HTTP 401). You would configure the plugin like this:

```js
import telegram from '@jackdbd/hapi-telegram-plugin'
import type {
  Options as TelegramPluginOptions
} from '@jackdbd/hapi-telegram-plugin'

// define your request predicates somewhere in your app,
// or import them from a library.
import {
  isServerRequestError,
  isUnauthorizedRequestError
} from '@jackdbd/hapi-request-event-predicates'

// define the functions that create the text string to
// send to Telegram, or import them from a library.
import {
  serverError,
  unauthorized
} from '@jackdbd/hapi-telegram-plugin/texts'


export const app = async (config) => {

  const server = Hapi.server({ port: 8080 })

  server.log(['lifecycle'], {
    message: `HTTP server created.`
  })

  const options: TelegramPluginOptions = {
    // when a request to your Hapi app matches a rule, this plugin
    // sends a message to the Telegram chat specified in that
    // particular rule.
    request_event_matchers: [
      {
        name: 'notify of server errors',
        chat_id: 'YOUR-TELEGRAM-CHAT-ID',
        token: 'YOUR-TELEGRAM-BOT-TOKEN',
        predicate: isServerRequestError,
        text: serverError
      },
      {
        name: 'warn about HTTP 401 (Unauthorized) request errors',
        chat_id: 'YOUR-TELEGRAM-CHAT-ID',
        token: 'YOUR-TELEGRAM-BOT-TOKEN',
        predicate: isUnauthorizedRequestError,
        text: unauthorized
      }
    ]
  }

  await server.register({ plugin: telegram, options })

  server.log(['lifecycle', 'plugin'], {
    message: `Telegram plugin registered.`
  })

  return { server }
}
```

## Configuration

### Options

| Option | Default | Explanation |
| --- | --- | --- |
| `request_event_matchers` | see `defaultRequestEventMatchers()` in [register.ts](./src/register.ts) | Each rule controls which request matches, and to which Telegram chat the text should be sent. |
