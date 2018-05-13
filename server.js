const io = require('socket.io')()

io.on('connection', (client) => {
  client.on('drawing', (data) => {
    // console.log('client is drawing')
    io.emit('drawing', data)
  }),
  client.on('endPath', () => io.emit('endPath')),
  client.on('initialize', () => console.log('client initialized'))
})

const port = 8000
io.listen(port)
console.log('listening on port ', port)

