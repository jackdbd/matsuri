import Joi from 'joi'
import type { RequestEventMatcher, Options } from './interfaces.js'

export const github_token = Joi.string().min(1).description('Your GitHub token')

export const milestone = Joi.number()
  .min(1)
  .description(
    'The number of the milestone to associate to the issue created by this plugin'
  )

export const label = Joi.string()
  .min(1)
  .description('A label you want to assign to an issue created by this plugin')

export const labels = Joi.array().items(label)

export const assignee = Joi.string()
  .min(1)
  .description('A GitHub account you want to assign an issue to')

export const assignees = Joi.array().items(assignee)

export const predicate_function = Joi.function()
  .arity(3)
  .description(
    'function that returns whether this request event matches or not'
  )

export const title_function = Joi.function()
  .arity(3)
  .description(
    'function that returns the title to use when creating the GitHub issue'
  )

export const body_function = Joi.function()
  .arity(3)
  .description(
    'function that returns the body to use when creating the GitHub issue'
  )

export const request_event_matcher = Joi.object<RequestEventMatcher>().keys({
  title: title_function.optional(),
  body: body_function.optional(),
  assignees: assignees.optional(),
  milestone: milestone.optional(),
  labels: labels.optional(),
  predicate: predicate_function.required()
})

export const options = Joi.object<Options>().keys({
  request_event_matchers: Joi.array().items(request_event_matcher).optional(),
  token: github_token.optional()
})
