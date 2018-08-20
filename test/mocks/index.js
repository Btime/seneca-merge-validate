module.exports = {
  args: {
    status: false,
    name: 'Btime',
    user: {
      id: 1,
      name: 'Btime Team',
      provideId: 1
    },
    requestOptions: {
      fields: ['name', 'email']
    }
  },
  pick: ['name'],
  schema: { name: 'user', method: 'getStatus' }
}
