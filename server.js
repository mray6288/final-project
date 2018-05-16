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
let usernames = []

io.on('connection', (client) => {
	
	client.on('initialize game', (data) => {
		let num_players = Object.keys(io.clients().connected).length
		// clearInterval(ServerInterval.get())
		let thisGame = `game-${gameId}`
		client.join(thisGame)	
		let playerId = 0
		if (usernames.length > 0){
			usernames.push(data.username)
			playerId = 2
			client.emit('initialize game', {playerId: playerId})
			goal = goal_options[Math.floor(Math.random() * goal_options.length)]
			io.to(thisGame).emit('start game', {goal: goal, usernames: usernames})
			// let thisInterval = setInterval(() => io.to(thisGame).emit('increment timer'), 1000)
			openGame = false
			gameId++
			usernames = []
		} else {
			playerId = 1
			usernames.push(data.username)
			client.emit('initialize game', {playerId: playerId})
			openGame = true

		}
		console.log('initializing', data.username, 'in gameId', gameId, 'as player', playerId)
		client.on('drawing', (data) => io.to(thisGame).emit('drawing', data)),
		client.on('endPath', (data) => io.to(thisGame).emit('endPath', data)),
		client.on('setGuess', (data) => io.to(thisGame).emit('setGuess', data)),
		// client.on('gameOver', () => clearInterval(thisInterval)),
		client.on('clearCanvas', (data) => io.to(thisGame).emit('clearCanvas', data))
		client.on('disconnect', () => usernames = usernames.filter(name => name !== data.username))
	})
})

// io.on('disconnect', () => {
// 	console.log('disconnected', interval)
// 	clearInterval(ServerInterval.get());
// })

const port = 8000
io.listen(port)
console.log('listening on port ', port)

