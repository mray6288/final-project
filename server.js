const io = require('socket.io')()

const goal_options = ['apple','bowtie','circle','hexagon','sword','watermelon','dog','foot',
	'butterfly','chair','clock','fish','door','pizza','television','sun',
	'mushroom','eye','hockey stick','dumbbell','shoe','stop sign',
	'snowman','snowflake','table','tooth','saxophone','star','boomerang','broom',
	'baseball','baseball bat','golf club']
// const goal_options = ['circle']

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

let gameId = 1
let usernames = []

io.on('connection', (client) => {
	
	client.on('initialize game', (clientData) => {
		// let num_players = Object.keys(io.clients().connected).length
		// clearInterval(ServerInterval.get())
		let thisGame = `game-${gameId}`
		client.join(thisGame)	
		let playerId = 0
		console.log('initializing', clientData.username, 'in gameId', gameId, 'as player', playerId)
		if (usernames.length > 0){
			usernames.push(clientData.username)
			playerId = 2
			client.emit('initialize game', {playerId: playerId})
			goal = goal_options[Math.floor(Math.random() * goal_options.length)]
			io.to(thisGame).emit('start game', {goal: goal, usernames: usernames})
			// let thisInterval = setInterval(() => io.to(thisGame).emit('increment timer'), 1000)
			gameId++
			usernames = []
		} else {
			playerId = 1
			usernames.push(clientData.username)
			client.emit('initialize game', {playerId: playerId})

		}
		
		client.on('drawing', (data) => io.to(thisGame).emit('drawing', data)),
		client.on('endPath', (data) => io.to(thisGame).emit('endPath', data)),
		client.on('setGuess', (data) => io.to(thisGame).emit('setGuess', data)),
		// client.on('gameOver', () => clearInterval(thisInterval)),
		client.on('clearCanvas', (data) => io.to(thisGame).emit('clearCanvas', data))
		client.on('playAgain', () => {
			console.log('playing again', clientData.username)
			if (usernames.length > 0){
				usernames.push(clientData.username)
				goal = goal_options[Math.floor(Math.random() * goal_options.length)]
				io.to(thisGame).emit('start game', {goal: goal, usernames: usernames})
				usernames = []
				// io.to(thisGame).emit('clearCanvas', {id: 1})
				// io.to(thisGame).emit('clearCanvas', {id: 2})
			} else {
				usernames.push(clientData.username)
			}
		})
		client.on('disconnect', () => usernames = usernames.filter(name => name !== clientData.username))
	})
})

// io.on('disconnect', () => {
// 	console.log('disconnected', interval)
// 	clearInterval(ServerInterval.get());
// })

const port = 8000
io.listen(port)
console.log('listening on port ', port)

