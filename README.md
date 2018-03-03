# seneca-merge-validate

![npm](https://img.shields.io/badge/npm-v5.6.1-blue.svg) ![yarn](https://img.shields.io/badge/yarn-v1.3.2-blue.svg) ![node](https://img.shields.io/badge/node-v8.9.0-brightgreen.svg) ![babel](https://img.shields.io/badge/babel-v6.26.0-red.svg)

## About

SenecaJS Merge Validate is a abstraction package made to validate/formate a message payload data, the same is also used in [seneca-sequelize package](https://github.com/Bsociety/seneca-sequelize)

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

  seneca.add({ role: 'plugin', cmd: 'create' }, cmd_create)

  function cmd_create (args, done) {
    senecaMergeValidate.validate({
      args,
      pick: PICK_FIELDS,
      schema: getValidateSchema(),
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