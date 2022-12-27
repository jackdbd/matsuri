import type Hapi from '@hapi/hapi'
import type { Tags } from '@jackdbd/hapi-request-event-predicates'

/**
 * @public
 */
export type GiHubToken = string

export interface GitHubIssue {
  title: string
  body: string
  assignees?: string[]
  milestone?: number
  labels?: string[]
}

/**
 * Rule that controls which request matches, and which GitHub issue should be
 * created.
 *
 * The rule `predicate` determines whether a request matches or not.
 *
 * @public
 */
export interface RequestEventMatcher {
  title: (request: Hapi.Request, event: Hapi.RequestEvent, tags: Tags) => string

  body: (request: Hapi.Request, event: Hapi.RequestEvent, tags: Tags) => string

  assignees?: string[]

  milestone?: number

  labels?: string[]

  predicate: (
    request: Hapi.Request,
    event: Hapi.RequestEvent,
    tags: Tags
  ) => boolean
}

/**
 * @public
 */
export interface Options {
  owner?: string // TODO: is there a github environment variable for the repository owner?
  repo?: string // TODO: is there a github environment variable for the repository?
  request_event_matchers?: RequestEventMatcher[]
  token?: GiHubToken
}
