import Joi from 'joi'

export const app_human_readable_name = Joi.string().min(1)

export const app_technical_name = Joi.string().min(1)

export const app_version = Joi.string().min(1)

// https://core.telegram.org/bots/api#sendmessage
export const telegram_chat_id = Joi.alternatives().try(
  Joi.number(), // it's negative for a group chat, positive for a username chat
  Joi.string().min(1)
)

export const telegram_token = Joi.string().min(1)

export const register_options = Joi.object().keys({
  app_human_readable_name: app_human_readable_name,
  app_technical_name: app_technical_name,
  app_version: app_version,
  chat_id: telegram_chat_id.required(),
  token: telegram_token.required()
})
