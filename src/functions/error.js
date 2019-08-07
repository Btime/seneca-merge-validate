'use strict'

module.exports.getErrorMessageByPluginName = pluginName => {
  const message = pluginName && `| ${pluginName}` || ''
  return `LOG::[VALIDATION ERROR ${message}]`
}
