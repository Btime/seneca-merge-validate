const Joi = require('joi')

module.exports = {
  args: {
    status: false,
    name: 'BTime',
    options: {
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
