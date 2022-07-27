import Joi from 'joi'

export const namespace = Joi.string().min(1)

export const tag_schema = Joi.string().min(1)

export const tags_schema = Joi.array().items(tag_schema).unique()
