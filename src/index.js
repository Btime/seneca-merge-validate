'use strict'

const Joi = require('joi')
const { errorLanguage } = require('joi-language-package')
const BtimeSchemaValidatePackage = require('btime-schema-validate-package')
const _ = require('lodash')

const DEFAULT_PICK_FIELDS = [
  'requestOptions',
  'credentials'
]

const validateSchema = BtimeSchemaValidatePackage.getSchema({
  name: 'request-options', method: 'seneca-merge-validate'
})

const DEFAULT_SCHEMA = validateSchema.result
const DEFAULT_OPTIONS = { abortEarly: false }

module.exports.default = function SenecaMergeValidate (seneca) {
  const getParams = (args, fields) => {
    return _.pick(
      seneca ? seneca.util.clean(args) : args,
      _.union(
        DEFAULT_PICK_FIELDS,
        (_.isArray(fields) && fields || [])
      )
    )
  }

  const getSchema = (schema) => {
    const name = schema.name || ''
    const method = schema.method || ''

    const validateSchema = BtimeSchemaValidatePackage
      .getSchema({ name, method })

    const formattedSchema = _.isPlainObject(validateSchema) &&
      validateSchema.result &&
      validateSchema.result || {}

    return _.merge(
      {},
      DEFAULT_SCHEMA,
      (_.isPlainObject(formattedSchema) && formattedSchema || {})
    )
  }

  const getOptions = (options) => {
    if (!_.isPlainObject(options)) {
      return DEFAULT_OPTIONS
    }

    const { language } = options

    return (typeof language === 'string')
      ? { ...options, language: errorLanguage(language) }
      : options
  }

  const getPluginName = (args) => {
    return args && args.meta$ && args.meta$.plugin && args.meta$.plugin.name
  }

  const getErrorMessageByPluginName = (pluginName) => {
    const message = pluginName && `| ${pluginName}` || ''
    return `LOG::[VALIDATION ERROR ${message}]`
  }

  const validate = (data) => {
    try {
      if (data.args.toCheck) {
        return Promise.resolve(data.done(null, { checked: true }))
      }
      const schema = getSchema(data.schema)
      const params = getParams(data.args, data.pick)
      const pluginName = getPluginName(data.args || {})
      const isValid = Joi.validate(params, schema, getOptions(data.options))

      if (isValid.error) {
        if (seneca) {
          seneca.log.error(getErrorMessageByPluginName(pluginName), isValid.error)
        }
        return Promise.reject({ status: false, message: isValid.error })
      }
      return Promise.resolve(params)
    } catch (err) {
      return Promise.reject({ status: false, message: err.message })
    }
  }

  return { validate, Joi }
}
