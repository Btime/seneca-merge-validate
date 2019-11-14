module.exports = {
  args: {
    id: 1,
    requestOptions: {
      fields: [ 'name', 'email' ]
    }
  },
  pick: [ 'id' ],
  schema: { name: 'user', method: 'select' }
}

module.exports.unsupportedLanguage = {
  args: {},
  pick: [ ],
  schema: { name: 'customer', method: 'create' },
  options: { language: 'unknown' }
}

module.exports.rawLanguageOption = {
  args: { name: 'Foo Bar', address: {} },
  pick: [ 'name', 'address' ],
  schema: { name: 'customer', method: 'create' },
  options: {
    abortEarly: false,
    language: {
      any: { required: 'is a required data' }
    }
  }
}

module.exports.errorsInSupportedLanguage = {
  args: {
    entity: 'customer'
  },
  pick: [ 'name', 'address' ],
  schema: { name: 'customer', method: 'create' },
  options: {
    abortEarly: false,
    language: 'pt'
  }
}
