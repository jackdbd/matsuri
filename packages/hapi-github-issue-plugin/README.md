# @jackdbd/hapi-github-issue-plugin

[![npm version](https://badge.fury.io/js/@jackdbd%2Fhapi-github-issue-plugin.svg)](https://badge.fury.io/js/@jackdbd%2Fhapi-github-issue-plugin)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Fhapi-github-issue-plugin)

Hapi plugin that automatically creates a GitHub issue when a request matches one of the rules you defined.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details><summary><b>Table of Contents<b></summary>

- [Installation](#installation)
- [Preliminary Operations](#preliminary-operations)
  - [GitHub personal access token](#github-personal-access-token)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Options](#options)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Installation

```sh
npm install @jackdbd/hapi-github-issue-plugin
```

## Preliminary Operations

### GitHub personal access token

This Hapi plugin makes a POST request to `{{GitHub-API}}/repos/:owner/:repo/issues` whenever an HTTP request matches one of the predicates used to configure the plugin itself. To allow this plugin to create an issue in your GitHub repository, you need to configure it with a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the required [OAuth scopes](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps). You can reuse an existing personal access token, or create a new one.

![OAuth scopes for the hapi-github-issue-plugin](https://raw.githubusercontent.com/jackdbd/matsuri/main/assets/images/hapi-github-issue-plugin-internal-server-error.png)

## Usage

If you register this plugin without passing any options...

```ts
import githubIssue from '@jackdbd/hapi-github-issue-plugin'

export const app = async (config) => {

  const server = Hapi.server({ port: 8080 })

  await server.register({ plugin: githubIssue })

  return { server }
}
```

...it will catch any internal server error and create a GitHub issue like this one:

![Telegram message about an internal server error in your Hapi app](https://raw.githubusercontent.com/jackdbd/matsuri/main/assets/images/hapi-github-issue-plugin-oauth-scopes.png)

You can create a GitHub issue for any kind of request handled by yout Hapi application, as long as you define a request matcher for it. For example, here I configure the plugin to create an issue every time the Hapi app responds with [HTTP 500 internal server error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500), or when it responds with [HTTP 418 I'm a Teapot](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418).

```ts
// import the plugin itself
import githubIssue from '@jackdbd/hapi-github-issue-plugin'

// define the functions that create the issue title/body somewhere
// in your app, or import them from a library.
import {
  defaultTitleFunction,
  defaultBodyFunction
} from '@jackdbd/hapi-github-issue-plugin/texts'

// define your request predicates somewhere in your app,
// or import them from a library.
import {
  isServerRequestError,
  isUnauthorizedRequestError
} from '@jackdbd/hapi-request-event-predicates'

export const app = async (config) => {

  const server = Hapi.server({ port: 8080 })

  await server.register({
    plugin: githubIssue,
    options: {
      request_event_matchers: [
        // create an issues every time the Hapi app responds with
        // HTTP 500 Internal Server Error, and assign it to bob.
        {
          predicate: isServerRequestError,
          title: defaultTitleFunction,
          body: defaultBodyFunction,
          assignees: ['bob'],
          labels: ['bug', 'matsuri-test']
        },
        // create an issues every time the Hapi app responds with
        // HTTP 418 I'm a teapot, and assign it to john.
        {
          predicate: isTeapotRequestError,
          title: defaultTitleFunction,
          body: defaultBodyFunction,
          assignees: ['john'],
          labels: ['teapot', 'matsuri-test']
        }
      ]
    }
  })

  return { server }
}
```


## Configuration

### Options

| Option | Default | Explanation |
| --- | --- | --- |
| `request_event_matchers` | see `defaultRequestEventMatchers()` in [register.ts](./src/register.ts) | Each rule controls which request matches, and which `title`, `body`, `assignees`, `milestone`, `labels` to use when creating the GitHub issue. |
