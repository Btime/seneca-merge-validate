'use strict'

const { isPlainObject } = require('lodash')
const { errorLanguage } = require('joi-language-package')
const { DEFAULT_OPTIONS } = require('./fields')

module.exports.getOptions = options => {
  if (!isPlainObject(options)) {
    return DEFAULT_OPTIONS
  }

  const { language } = options

  return (typeof language === 'string')
    ? { ...options, language: errorLanguage(language) }
    : options
}
