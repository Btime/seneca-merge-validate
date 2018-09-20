# seneca-merge-validate

![npm](https://img.shields.io/badge/npm-v5.6.1-blue.svg) ![node](https://img.shields.io/badge/node-v8.9.0-brightgreen.svg)

## About

SenecaJS Merge Validate is an abstraction package made to validate/formate a message payload data.
This package uses [`Btime-schema-validate-package`](https://github.com/Btime/btime-schema-validate-package) to perform validations based on the schemas defined there.

## Setup

### Installing

```bash
$ npm i
```

## Usage

```bash
$ npm i Btime/seneca-merge-validate -S
```

## Example

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
