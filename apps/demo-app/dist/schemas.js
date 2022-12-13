import Joi from 'joi';
export const environment = Joi.string()
    .valid('development', 'production', 'test')
    .required();
const telegram_chat_id = Joi.alternatives().try(Joi.number(), Joi.string().min(1));
const telegram_token = Joi.string().min(1);
export const telegram_credentials = Joi.object().keys({
    chat_id: telegram_chat_id.required(),
    token: telegram_token.required()
});
