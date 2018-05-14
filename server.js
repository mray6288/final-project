const io = require('socket.io')()

io.on('connection', (client) => {
  client.on('drawing', (data) => {
    // console.log('client is drawing')
    io.emit('drawing', data)
  }),
  client.on('endPath', (data) => io.emit('endPath', data)),
  client.on('initialize game', (data) => io.emit('initialize game', data)),
  client.on('start game', () => io.emit('start game'))
})

const port = 8000
io.listen(port)
console.log('listening on port ', port)

