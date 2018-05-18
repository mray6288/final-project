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
let rematches = {}
let goals = {}

io.on('connection', (client) => {
	console.log('rooms at connect', gameRooms)
	client.emit('game rooms', gameRooms)
	client.on('join game', (user) => {
		// let num_players = Object.keys(io.clients().connected).length
		// clearInterval(ServerInterval.get())
		let thisGame = `game-${gameId}`
		client.join(thisGame)	
		
		
		if (!gameRooms[thisGame]) {
			gameRooms[thisGame] = []
			console.log('initializing', user.username, 'in gameId', gameId)
			gameRooms[thisGame].push(user.username)
			console.log(gameRooms)
			client.emit('join game')

		} else if (gameRooms[thisGame].length === 1){
			gameRooms[thisGame].push(user.username)
			client.emit('join game')
			goal = goal_options[Math.floor(Math.random() * goal_options.length)]
			goals[gameId] = goal
			io.to(thisGame).emit('start game', {goal: goal, usernames: gameRooms[thisGame]})
			
			// let thisInterval = setInterval(() => io.to(thisGame).emit('increment timer'), 1000)
			console.log('joining', user.username, 'in gameId', gameId)
			gameId++
			// gameRooms[thisGame] = []
		}  else {
			client.emit('spectate game', {goal: goals[gameId], usernames: gameRooms[thisGame]})
			console.log('joining spectator', user.username, 'in gameId', gameId)
		}
		console.log(gameRooms)
		
		client.on('drawing', (data) => io.to(thisGame).emit('drawing', data)),
		client.on('endPath', (data) => io.to(thisGame).emit('endPath', data)),
		client.on('setGuess', (data) => io.to(thisGame).emit('setGuess', data)),
		// client.on('gameOver', () => clearInterval(thisInterval)),
		client.on('clearCanvas', (data) => io.to(thisGame).emit('clearCanvas', data))
		client.on('playAgain', () => {
			if (!rematches[gameId]){
				rematches[gameId] = 1
			} else {
				rematches[gameId] = 2
			}
			// console.log('playing again', user.username, rematches)
			if (rematches[gameId] === 2){
				// console.log('rematch')
				gameRooms[thisGame].push(user.username)
				goal = goal_options[Math.floor(Math.random() * goal_options.length)]
				io.to(thisGame).emit('start game', {goal: goal, usernames: gameRooms[thisGame]})
				rematches[gameId] = 0
				// gameRooms[thisGame] = []

			}
			console.log(gameRooms)
		})
		client.on('left game', () => {
			console.log(user.username, 'left game')
			client.leave(thisGame)

			if (gameRooms[thisGame]){
				// gameRooms[thisGame] = gameRooms[thisGame].filter(name => name !== user.username)
				
				// if (gameRooms[thisGame].length === 0){
				delete gameRooms[thisGame]
				// }
			}
			io.to(thisGame).emit('opponent left')
			console.log(gameRooms)
		})
		client.on('disconnect', () => {

		})
	})
})

// io.on('disconnect', () => {
// 	console.log('disconnected', interval)
// 	clearInterval(ServerInterval.get());
// })

const port = process.env.PORT || 8000
io.listen(port)
console.log('listening on port ', port)

