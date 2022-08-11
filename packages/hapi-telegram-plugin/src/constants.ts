/**
 * Character limit for a Telegram message.
 *
 * @see [sendMessage - Telegram Bot API](https://core.telegram.org/bots/api#sendmessage)
 * @see [Telegram Limits](https://limits.tginfo.me/en)
 * @see [Increase character limit for messages](https://bugs.telegram.org/c/1423)
 *
 * @public
 */
export const CHARACTER_LIMIT_TELEGRAM_MESSAGE = 4096

/**
 * Emojis.
 *
 * @see [Emojipedia](https://emojipedia.org/)
 *
 * @public
 */
export enum Emoji {
  CrossMark = '❌',
  Teapot = '🫖',
  Warning = '⚠️'
}

export const TAG = 'hapi-telegram-plugin'
