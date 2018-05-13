const io = require('socket.io')()

io.on('connection', (client) => {
  client.on('subscribeToDrawing', (interval, toDisplay) => {
    console.log('client is subscribing to drawing with interval ', interval)
    setInterval(() => {
      client.emit('timer', toDisplay)
    }, interval)
  })
})

const port = 8000
io.listen(port)
console.log('listening on port ', port)