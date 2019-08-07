'use strict'

const Joi = require('@hapi/joi')
const { defineErrorMessages } = require('error-messages')
const {
  getErrorMessageByPluginName,
  getOptions,
  getParams,
  getSchema
} = require('./functions')

module.exports = function SenecaMergeValidate (seneca) {
  const getPluginName = args =>
    args && args.meta$ && args.meta$.plugin && args.meta$.plugin.name

  const validate = async data => {
    try {
      if (data.args.toCheck) {
        return data.done(null, { checked: true })
      }

      const schema = getSchema(data.schema)
      const params = getParams(data.args, seneca, data.pick)
      const pluginName = getPluginName(data.args || {})
      const isValid = Joi.validate(params, schema, getOptions(data.options))

      if (isValid.error) {
        if (seneca) {
          seneca.log.error(getErrorMessageByPluginName(pluginName), isValid.error)
        }

        throw defineErrorMessages({
          code: '',
          entity: 'joi',
          joi: isValid.error.details,
          entityErr: data.entity
        })
      }
      return params
    } catch (errors) {
      const err = { status: false, errors: errors.message || errors }
      throw err
    }
  }

  return { validate, Joi }
}
