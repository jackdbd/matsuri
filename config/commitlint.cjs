/**
 * Configuration for commitlint.
 *
 * commitlint checks if your commit messages meet the conventional commit format.
 *
 * Here is the template of a commit message:
 * type(scope?): subject
 *
 * scope is optional; multiple scopes are supported (current delimiter options: "/", "\" and ",")
 *
 * See here for examples of conventional commit messages that trigger a
 * patch/minor/major release with semantic-release:
 * https://www.conventionalcommits.org/en/v1.0.0/#summary
 *
 * <type>[optional scope]: <description>
 *
 * [optional body]
 *
 * [optional footer(s)]
 */

const config = {
  // https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
  extends: ['@commitlint/config-conventional'],

  // The first commit message of this git repo is "initial commit". Since it has
  // no subject, it would throw an error because there is a rule in the
  // @commitlint/config-conventional preset that disallows empty subjects. Since
  // I don't care about the commit message of the first commit, I ignore it.
  ignores: [
    (message) => {
      return message.includes('initial commit')
    }
  ],

  // reference for commitlint rules:
  // https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
  //
  // rules of the @commitlint/config-conventional preset:
  // https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
  //
  // The first element in the rule array is the LEVEL. It can be 0, 1 or 2.
  // Here is what a level means:
  // 0 => disables the rule. 1 => warning. 2 => error
  rules: {
    // I configured semantic-release git plugin to create a release commit
    // message containing release notes in the commit body. This might exceed
    // the limit set by the config-conventional preset. Since I don't think it's
    // a problem to have a long commit message body, I disable the rule.
    'body-max-line-length': [0],
    'header-max-length': [2, 'always', 72]
  }
}

// As a reminder, a convential commit message has the following structure:
//////////////////////////
// type(scope): subject //
//////////////////////////
// type must be one of:
// - build
// - chore
// - ci
// - docs
// - feat (triggers a MINOR release)
// - fix (triggers a PATCH release)
// - perf
// - refactor
// - revert
// - style
// - test

// console.log('=== commitlint ===', config)

module.exports = config
