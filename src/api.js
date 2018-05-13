import openSocket from 'socket.io-client'
const  io = openSocket('http://localhost:8000')

function subscribeToDrawing(cb, toDisplay) {
  io.on('timer', point => cb(null, point))
  io.emit('subscribeToDrawing', 1000, toDisplay)
}
export {io, subscribeToDrawing}