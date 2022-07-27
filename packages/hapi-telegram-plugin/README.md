# @jackdbd/hapi-telegram-plugin

[![npm version](https://badge.fury.io/js/@jackdbd%2Fhapi-telegram-plugin.svg)](https://badge.fury.io/js/@jackdbd%2Fhapi-telegram-plugin)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Fhapi-telegram-plugin)

Hapi plugin that reports error messages to a Telegram chat of your choice.

## Installation

```sh
npm install @jackdbd/hapi-telegram-plugin
```

## Preliminary Operations

### Create a Telegram bot with BotFather

A Telegram bot is an API that implements webhooks. When you create a Telegram bot with [BotFather](https://telegram.me/BotFather), Telegram creates an API on its servers. You can then make HTTP requests to this API.

This Hapi plugin makes a POST request to the [/sendMessage](https://core.telegram.org/bots/api#sendmessage) endpoint whenever there is an error in your request handlers.

Create a Telegram bot with the following steps:

1. Open a Telegram chat with BotFather and enter the `/newbot` command
1. Choose a `name` and a `username` for your bot. The `name` can be anything and you can change it any time. The `username` is unique, you cannot change it, and must end with `_bot`. Write down the bot `token` that BotFather returns you.
1. Il token del bot lo puoi vedere in BotFather, selezionando il bot e poi API tokens.

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

Let's say that you want to receive notifications for errors in the request handlers of the `latest` version of your app `Awesome App` (technical name `awesome-app-sha-1234356`) in a Telegram chat. You would configure the plugin like this:

```js
import telegram from '@jackdbd/hapi-telegram-plugin'

export const app = async (config) => {

  const server = Hapi.server({ port: 8080 })

  server.log(['lifecycle'], {
    message: `HTTP server created.`
  })

  await server.register({
    plugin: telegram,
    options: {
      app_human_readable_name: 'Awesome App',
      app_technical_name: 'awesome-app-sha-1234356',
      app_version: 'latest',
      chat_id: 'YOUR-TELEGRAM-CHAT-ID',
      token: 'YOUR-TELEGRAM-BOT-TOKEN'
    }
  })

  server.log(['lifecycle', 'plugin'], {
    message: `Telegram plugin registered.`
  })

  return { server }
}
```

## Configuration

### Required parameters

| Parameter | Explanation |
| --- | --- |
| `chat_id` | The Telegram chat ID where this plugin should send messages to. It's the chat you have with your Telegram bot. |
| `token` | The Telegram bot token. |

### Options

| Option | Default | Explanation |
| --- | --- | --- |
| `app_human_readable_name` | `My App` | A human friendly name for your Hapi app. |
| `app_technical_name` | `my-cloud-run-service-id` | A machine friendly name for your Hapi app. |
| `app_version` | `latest` | The version of your Hapi app. |
