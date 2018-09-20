module.exports = {
  args: {
    status: false,
    name: 'Btime',
    requestOptions: {
      fields: [ 'name', 'email' ]
    }
  },
  pick: [ 'name' ],
  schema: { name: 'user', method: 'getStatus' }
}
