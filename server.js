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
// let usernames = []
let gameRooms = {}

io.on('connection', (client) => {
	console.log('rooms at connect', gameRooms)
	client.emit('game rooms', gameRooms)
	client.on('join game', (clientData) => {
		// let num_players = Object.keys(io.clients().connected).length
		// clearInterval(ServerInterval.get())
		let thisGame = `game-${gameId}`
		client.join(thisGame)	
		
		console.log(gameRooms)
		if (!gameRooms[thisGame]) {
			gameRooms[thisGame] = []
			console.log('initializing', clientData.username, 'in gameId', gameId)
			gameRooms[thisGame].push(clientData.username)
			console.log(gameRooms)
			client.emit('join game')

		} else if (gameRooms[thisGame].length >= 1){
			gameRooms[thisGame].push(clientData.username)
			client.emit('join game')
			goal = goal_options[Math.floor(Math.random() * goal_options.length)]
			io.to(thisGame).emit('start game', {goal: goal, usernames: gameRooms[thisGame]})
			
			// let thisInterval = setInterval(() => io.to(thisGame).emit('increment timer'), 1000)
			console.log('joining', clientData.username, 'in gameId', gameId)
			gameId++
			// gameRooms[thisGame] = []
		}  
		else {
			client.emit('spectate game')
			console.log('joining spectator', clientData.username, 'in gameId', gameId)
		}
		
		client.on('drawing', (data) => io.to(thisGame).emit('drawing', data)),
		client.on('endPath', (data) => io.to(thisGame).emit('endPath', data)),
		client.on('setGuess', (data) => io.to(thisGame).emit('setGuess', data)),
		// client.on('gameOver', () => clearInterval(thisInterval)),
		client.on('clearCanvas', (data) => io.to(thisGame).emit('clearCanvas', data))
		client.on('playAgain', () => {
			console.log('playing again', clientData.username)
			if (gameRooms[thisGame].length > 0){
				gameRooms[thisGame].push(clientData.username)
				goal = goal_options[Math.floor(Math.random() * goal_options.length)]
				io.to(thisGame).emit('start game', {goal: goal, usernames: gameRooms[thisGame]})
				// gameRooms[thisGame] = []
				// io.to(thisGame).emit('clearCanvas', {id: 1})
				// io.to(thisGame).emit('clearCanvas', {id: 2})
			} else {
				gameRooms[thisGame] = [clientData.username]
			}
		})
		client.on('disconnect', () => {
			// console.log('this game', thisGame)
			// console.log('game rooms', gameRooms)
			// console.log('username', clientData.username)
			gameRooms[thisGame] = gameRooms[thisGame].filter(name => name !== clientData.username)
			
			if (gameRooms[thisGame].length === 0){
				delete gameRooms[thisGame]
			}
			// console.log('updated game rooms', gameRooms)
		})
	})
})

// io.on('disconnect', () => {
// 	console.log('disconnected', interval)
// 	clearInterval(ServerInterval.get());
// })

const port = 8000
io.listen(port)
console.log('listening on port ', port)

