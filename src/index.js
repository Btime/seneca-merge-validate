import * as Joi from 'joi'
import {
  pick,
  union,
  isArray,
  merge,
  isPlainObject
} from 'lodash'
const DEFAULT_PICK_FIELDS = [
  'requestOptions'
]
const DEFAULT_SCHEMA = {
  requestOptions: Joi.object().keys({
    fields: Joi.array()
      .min(1)
      .optional()
      .description('the fields option to merge with select clause'),

    filters: Joi.object()
      .min(1)
      .optional()
      .description('the filters option to merge with where clause'),

    paginate: Joi.object().keys({
      page: Joi.number()
        .integer()
        .optional()
        .description('the page option to merge with query params'),

      limit: Joi.number()
        .integer()
        .optional()
        .description('the limit option to merge with query params')
    })
  })
  .optional()
  .description('the options to merge with query params')
}

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
    return merge(
      {},
      DEFAULT_SCHEMA,
      (isPlainObject(schema) && schema || {})
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
