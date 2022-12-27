<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/hapi-telegram-plugin](./hapi-telegram-plugin.md)

## hapi-telegram-plugin package

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [CloudRunServiceErrorTextConfig](./hapi-telegram-plugin.cloudrunserviceerrortextconfig.md) |  |
|  [Options](./hapi-telegram-plugin.options.md) |  |
|  [RequestEventMatcher](./hapi-telegram-plugin.requesteventmatcher.md) | <p>Rule that controls which request matches, and to which Telegram chat the text should be sent.</p><p>The rule <code>predicate</code> determines whether a request matches or not.</p><p>The rule <code>text</code> converts the combination request and event into a text to send to Telegram. This text should respect the formatting options and length allowed by the sendMessage endpoint of the Telegram API.</p> |
|  [Tags](./hapi-telegram-plugin.tags.md) |  |

## Variables

|  Variable | Description |
|  --- | --- |
|  [\_default](./hapi-telegram-plugin._default.md) |  |
|  [clientError](./hapi-telegram-plugin.clienterror.md) |  |
|  [makeGcpCloudRunServiceErrorText](./hapi-telegram-plugin.makegcpcloudrunserviceerrortext.md) |  |
|  [serverError](./hapi-telegram-plugin.servererror.md) |  |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [TelegramChatId](./hapi-telegram-plugin.telegramchatid.md) |  |
|  [TelegramToken](./hapi-telegram-plugin.telegramtoken.md) |  |
