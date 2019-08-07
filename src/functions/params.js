'use strict'

const { isArray, pick, union } = require('lodash')
const { DEFAULT_PICK_FIELDS } = require('./fields')

module.exports.getParams = (args, seneca, fields) => pick(
  seneca ? seneca.util.clean(args) : args,
  union(
    DEFAULT_PICK_FIELDS,
    (isArray(fields) && fields || [])
  )
)
