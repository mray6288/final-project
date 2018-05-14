const io = require('socket.io')()

const goal_options = ['apple','bowtie','circle','hexagon','sword','watermelon','dog','foot']

var ServerInterval = (function () {
    var serverInterval;
    return {
            set: function (obj) {
            serverInterval = obj;
            },
            get : function() {
                return serverInterval;
            }
    };

})();

let openGame = false
let gameId = 1

io.on('connection', (client) => {
	
	client.on('initialize game', () => {
		let num_players = Object.keys(io.clients().connected).length
		// clearInterval(ServerInterval.get())
		let thisGame = `game-${gameId}`
		client.join(thisGame)	
		
		if (openGame){
			client.emit('initialize game', {player: 2})
			goal = goal_options[Math.floor(Math.random() * goal_options.length)]
			io.to(thisGame).emit('start game', {goal: goal})
			// let thisInterval = setInterval(() => io.to(thisGame).emit('increment timer'), 1000)
			openGame = false
			gameId++
		} else {
			client.emit('initialize game', {player: 1})
			openGame = true

		}
		client.on('drawing', (data) => io.to(thisGame).emit('drawing', data)),
		client.on('endPath', (data) => io.to(thisGame).emit('endPath', data)),
		client.on('setGuess', (data) => io.to(thisGame).emit('setGuess', data)),
		// client.on('gameOver', () => clearInterval(thisInterval)),
		client.on('clearCanvas', (data) => io.to(thisGame).emit('clearCanvas', data))
	})
})

// io.on('disconnect', () => {
// 	console.log('disconnected', interval)
// 	clearInterval(ServerInterval.get());
// })

const port = 8000
io.listen(port)
console.log('listening on port ', port)

