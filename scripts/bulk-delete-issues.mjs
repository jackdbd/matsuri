#!/usr/bin/env zx
import { chalk, $ } from 'zx'
import 'zx/globals'

// Note: deleting an issue is NOT the same thing as closing an issue
// https://docs.github.com/en/issues/tracking-your-work-with-issues/deleting-an-issue

// https://github.com/google/zx#configuration
$.verbose = false

// Usage (from the monorepo root):
// ./scripts/bulk-delete-issues.mjs

const { stdout: json } =
  await $`gh issue list --label="matsuri-test" --json=number`
const issue_numbers = JSON.parse(json).map((issue) => issue.number)

const promises = issue_numbers.map((n) => {
  return $`gh issue delete ${n}`
})

const results = await Promise.allSettled(promises)
const successes = results.filter((r) => r.status === 'fulfilled')
const failures = results.filter((r) => r.status !== 'fulfilled')

console.log(chalk.green(`deleted ${successes.length} issues`))

if (failures.length > 0) {
  console.log(chalk.red(`could not delete ${failures.length} issues`))
}
