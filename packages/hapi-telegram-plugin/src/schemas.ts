import Joi from 'joi'
import type { RequestEventMatcher, Options } from './interfaces.js'

export const telegram_chat_id = Joi.alternatives().try(
  Joi.number(), // it's negative for a group chat, positive for a username chat
  Joi.string().min(1).description('Your Telegram chat ID')
)

export const telegram_bot_token = Joi.string()
  .min(1)
  .description('Your Telegram bot token')

export const predicate_function = Joi.function()
  .arity(3)
  .description(
    'function that returns whether this request event matches or not'
  )

export const text_function = Joi.function()
  .arity(3)
  .description(
    'function that returns the text message to send to the Telegram chat'
  )

export const request_event_matcher = Joi.object<RequestEventMatcher>().keys({
  name: Joi.string().min(1).required(),
  chat_id: telegram_chat_id.required(),
  token: telegram_bot_token.required(),
  predicate: predicate_function.required(),
  text: text_function.required()
})

export const options = Joi.object<Options>().keys({
  request_event_matchers: Joi.array()
    .items(request_event_matcher)
    .min(1)
    .required()
})
