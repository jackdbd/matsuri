import type Hapi from '@hapi/hapi'
import { Octokit } from '@octokit/core'
import { TAG } from './constants.js'
import type { Options, GitHubIssue } from './interfaces.js'

interface Config extends Required<Options> {
  server: Hapi.Server
}

/**
 * @internal
 */
export const makeHandleRequest = (config: Config) => {
  const { owner, repo, request_event_matchers, token } = config
  const octokit = new Octokit({ auth: token })

  const handleRequest: Hapi.RequestEventHandler = async (
    request,
    event,
    tags
  ) => {
    const issues: GitHubIssue[] = []

    for (const [_idx, matcher] of Object.entries(request_event_matchers)) {
      if (matcher.predicate(request, event, tags)) {
        // console.log('=== REQUEST MATCH ===', 'event', event, 'tags', tags)

        issues.push({
          title: matcher.title(request, event, tags),
          body: matcher.body(request, event, tags),
          assignees: matcher.assignees,
          milestone: matcher.milestone,
          labels: matcher.labels
        })
      }
    }

    const promises = issues.map((issue: any) => {
      return octokit.request(`POST /repos/${owner}/${repo}/issues`, issue)
    })

    const results = await Promise.allSettled(promises)

    for (const res of results) {
      if (res.status === 'fulfilled') {
        const { data, status } = res.value

        if (status !== 201) {
          request.log(['warning', TAG], {
            message: `status code is not 201: ${JSON.stringify(
              res.value,
              null,
              2
            )}`
          })
        }

        const issue_url: string = data.html_url
        request.log(['info', TAG], {
          message: `issue created: ${issue_url}`
        })
      } else {
        const err = res.reason as Error
        request.log(['error'], {
          message: `could not create issue: ${err.message}`
        })
      }
    }
  }

  return handleRequest
}
