'use strict'

const { isPlainObject, merge } = require('lodash')
const BtimeSchemaValidatePackage = require('btime-schema-validate-package')

const DEFAULT_SCHEMA = BtimeSchemaValidatePackage.getSchema({
  name: 'request-options', method: 'seneca-merge-validate'
}).result

module.exports.getSchema = schema => {
  const name = schema.name || ''
  const method = schema.method || ''

  const validateSchema = BtimeSchemaValidatePackage
    .getSchema({ name, method })

  const formattedSchema = isPlainObject(validateSchema) &&
    validateSchema.result &&
    validateSchema.result || {}

  return merge(
    {},
    DEFAULT_SCHEMA,
    (isPlainObject(formattedSchema) && formattedSchema || {})
  )
}
