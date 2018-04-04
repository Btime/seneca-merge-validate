const Joi = require('joi')

module.exports = {
  args: {
    status: false,
    name: 'BTime',
    user: {
      id: 1,
      name: 'Felipe Barros',
      provideId: 1
    },
    requestOptions: {
      fields: ['name', 'email']
    }
  },
  pick: ['name'],
  schema: {
    name: Joi.string()
      .required(),

    status: Joi.boolean()
      .optional()
  }
}
