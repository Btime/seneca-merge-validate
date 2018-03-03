# seneca-merge-validate
SenecaJS Merge Validate


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
    return 
  }

  function createService (params) {
    return new Promise((resolve, reject) => {
      return reject({ status: false, message: 'Error' })
      return resolve({ status: true, result: {} })
    })
  }
}
```