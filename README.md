# matsuri ⛩️

![CI workflow](https://github.com/jackdbd/matsuri/actions/workflows/ci.yaml/badge.svg)
![Release to npmjs.com workflow](https://github.com/jackdbd/matsuri/actions/workflows/release-to-npmjs.yaml/badge.svg)
[![codecov](https://codecov.io/gh/jackdbd/matsuri/branch/main/graph/badge.svg?token=P5uJ3doRer)](https://codecov.io/gh/jackdbd/matsuri)
[![CodeFactor](https://www.codefactor.io/repository/github/jackdbd/matsuri/badge)](https://www.codefactor.io/repository/github/jackdbd/matsuri)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

<div style="display:flex; align-items:center; justify-content:center"><img src="./assets/images/matsuri-logo.png" alt="the matsuri logo" width=300 height=300 style=""></div>

## Installation

Clone the repo:

```shell
git clone git@github.com:jackdbd/matsuri.git

cd matsuri
```

Install all dependencies from npm.js and setup git hooks with [husky](https://typicode.github.io/husky/):

```sh
npm install
```

## Build

This monorepo uses [Typescript project references](https://www.typescriptlang.org/docs/handbook/project-references.html) to build all of its libraries, and [Turborepo](https://turbo.build/repo) for all other tasks.

Build all libraries and applications:

```sh
npm run build
```

Build the docs of all packages, and also an index page:

```sh
npm run docs
```

Generate a file size report for each library:

```sh
npm run size
```

## Docs

See [docs](./docs/README.md).

## Scripts

See [scripts](./scripts/README.md).