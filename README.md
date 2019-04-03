# seneca-merge-validate

![npm](https://img.shields.io/badge/npm-v5.6.1-blue.svg) ![node](https://img.shields.io/badge/node-v8.9.0-brightgreen.svg)

## About

SenecaJS Merge Validate is an abstraction package made to validate/formate a message payload data.
This package uses [`Btime-schema-validate-package`](https://github.com/Btime/btime-schema-validate-package) to perform validations based on the schemas defined there.

## Table of Contents

1. [Setup](#setup)
    1. [Installing](#installing)
1. [Usage](#usage)
    1. [Example](#example)
    1. [Language Support](#language-support)
1. [Pushing Versions - Tagging](#pushing-versions---tagging)
1. [Tests](#tests)

## Setup

### Installing

```bash
$ npm i
```

## Usage

```bash
$ npm i Btime/seneca-merge-validate -S
```

### Example

```js
function Plugin () {
  const seneca = this
  const Joi = require('joi')
  const SenecaMergeValidate = require('seneca-merge-validate')
  const senecaMergeValidate = SenecaMergeValidate(seneca)
  const PICK_FIELDS = [
    'field'
  ]

  seneca.add({ role: 'plugin', cmd: 'create', credentials: '*'}, cmd_create)

  function cmd_create (args, done) {
    senecaMergeValidate.validate({
      args,
      pick: PICK_FIELDS,
      schema: { name: args.role, method: args.cmd },
      options: { abortEarly: false }
    })
    .then(params => create(params))
    .then(result => done(null, result))
    .catch(err => done(null, err))
  }

  function getValidateSchema () {
    return {
      field: Joi.any()
        .required()
    }
  }

  function createService (params) {
    return new Promise((resolve, reject) => {
      return reject({ status: false, message: 'Error' })
      return resolve({ status: true, result: {} })
    })
  }
}
```

### Language Support
Error messages default to the English language, but might be different by
setting the language option:
```js
senecaMergeValidate.validate({
  args,
  pick: PICK_FIELDS,
  schema: { name: args.role, method: args.cmd },
  options: {
    abortEarly: false,
    language: 'pt-br'
  }
})
```
The [JOI Language Pack](https://github.com/Btime/joi-language-package) is used in order to allow for such translations.

You can also [provide custom messages](https://github.com/hapijs/joi/blob/master/API.md#validatevalue-schema-options-callback) yourself by defining the **language object**:

```js
const language = {
  any: {
    required: 'is not optional'
  }
}
senecaMergeValidate.validate({
  args,
  pick: PICK_FIELDS,
  schema: { name: args.role, method: args.cmd },
  options: {
    abortEarly: false,
    language
  }
})
```

## Pushing versions - Tagging

All pushes must come with a new tag. The tag usage must consider semantic versions

- `[major version: incompatible changes].[minor version: compatible with major].[patch version: bug fixes]`

### Example of Usage

```bash
git tag 1.0.0 && git push origin master --tags
```

## Tests

```bash
$ npm test
```
