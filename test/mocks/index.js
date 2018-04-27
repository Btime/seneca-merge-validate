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
  schema: { name: 'user', method: 'getStatus' }
}
