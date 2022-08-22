#!/usr/bin/env zx

import 'zx/globals'
import { throwIfInvokedFromMonorepoRoot } from './utils.mjs'

/**
 * Copy custom type declarations from the monorepo root to a package root.
 *
 * Usage (from a package root):
 * ../../scripts/copy-custom-types.mjs --modules foo,bar,baz
 */

throwIfInvokedFromMonorepoRoot(process.env.PWD)

const package_root = process.env.PWD
const monorepo_root = path.join(package_root, '..', '..')

await $`mkdir -p ${package_root}/custom-types`

// argv comes from zx/globals
const modules = argv.modules.split(',')

modules.forEach(async (m) => {
  const src = `${monorepo_root}/custom-types/${m}`
  const dest = `${package_root}/custom-types/${m}`

  await $`cp -r ${src} ${dest}`
})
