import * as Joi from 'joi'
import * as BtimeSchemaValidatePackage from 'btime-schema-validate-package'
import {
  pick,
  union,
  isArray,
  merge,
  isPlainObject
} from 'lodash'

const DEFAULT_PICK_FIELDS = [
  'user',
  'requestOptions',
  'credentials'
]

const validateSchema = BtimeSchemaValidatePackage.getSchema({
  name: 'request-options', method: 'seneca-merge-validate'
})

const DEFAULT_SCHEMA = validateSchema.result

export default function SenecaMergeValidate (seneca) {
  const getParams = (args, fields) => {
    return pick(
      seneca.util.clean(args),
      union(
        DEFAULT_PICK_FIELDS,
        (isArray(fields) && fields || [])
      )
    )
  }

  const getSchema = (schema) => {
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

  const getOptions = (options) => {
    return isPlainObject(options) && options || { abortEarly: false }
  }

  const getPluginName = (args) => {
    return args && args.meta$ && args.meta$.plugin && args.meta$.plugin.name
  }

  const getErrorMessageByPluginName = (pluginName) => {
    const message = pluginName && `| ${pluginName}` || ''
    return `LOG::[VALIDATION ERROR ${message}]`
  }

  const validate = (data) => {
    const schema = getSchema(data.schema)
    const params = getParams(data.args, data.pick)
    const pluginName = getPluginName(data.args || {})
    const isValid = Joi.validate(params, schema, getOptions(data.options))

    if (isValid.error) {
      seneca.log.error(getErrorMessageByPluginName(pluginName), isValid.error)
      return Promise.reject({ status: false, message: isValid.error })
    }
    return Promise.resolve(params)
  }

  return { validate, Joi }
}
