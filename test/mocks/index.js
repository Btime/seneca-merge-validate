module.exports = {
  args: {
    status: false,
    name: 'Btime',
    requestOptions: {
      fields: [ 'name', 'email' ]
    }
  },
  pick: [ 'name' ],
  schema: { name: 'user', method: 'select' }
}

module.exports.unsupportedLanguage = {
  args: {},
  pick: [ ],
  schema: { name: 'customer', method: 'create' },
  options: { language: 'unknown' }
}

module.exports.rawLanguageOption = {
  args: { name: 'Foo Bar' },
  pick: [ 'name' ],
  schema: { name: 'customer', method: 'create' },
  options: {
    abortEarly: false,
    language: {
      any: { required: 'is a required data' }
    }
  }
}

module.exports.errorsInSupportedLanguage = {
  args: { },
  pick: [ 'name' ],
  schema: { name: 'customer', method: 'create' },
  options: {
    abortEarly: false,
    language: 'pt-br'
  }
}
