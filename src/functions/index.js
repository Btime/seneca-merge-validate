'use strict'

const { getErrorMessageByPluginName } = require('./error')
const { getOptions } = require('./options')
const { getParams } = require('./params')
const { getSchema } = require('./schema')

module.exports = {
  getErrorMessageByPluginName,
  getOptions,
  getParams,
  getSchema
}
