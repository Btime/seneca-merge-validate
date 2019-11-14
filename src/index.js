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

        const err = defineErrorMessages({
          serviceValidator: 'joi',
          serviceName: data.args && data.args.entity,
          joiErrors: isValid.error.details,
          lang: 'en'
        })

        throw err
      }
      return params
    } catch (errors) {
      const err = Array.isArray(errors)
        ? { status: false, errors }
        : errors
      throw err
    }
  }

  return { validate, Joi }
}
