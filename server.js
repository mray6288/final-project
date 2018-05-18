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
	client.on('open games', () => {
		// console.log('open games', gameRooms)
		client.emit('open games', gameRooms)})

	client.on('join game', (data) => {
		// let num_players = Object.keys(io.clients().connected).length
		// clearInterval(ServerInterval.get())

		let thisGame = data.gameId || gameId++
		let isSpectator = false
		console.log('data', data, 'gameId', gameId)
		client.join(thisGame)	
		
		
		if (!gameRooms[thisGame]) {
			gameRooms[thisGame] = []
			console.log('initializing', data.username, 'in gameId', gameId)
			gameRooms[thisGame].push(data.username)
			console.log('2',gameRooms)
			client.emit('join game')

		} else if (gameRooms[thisGame].length === 1){
			gameRooms[thisGame].push(data.username)
			client.emit('join game')
			goal = goal_options[Math.floor(Math.random() * goal_options.length)]
			goals[gameId] = goal
			io.to(thisGame).emit('start game', {goal: goal, usernames: gameRooms[thisGame]})
			
			// let thisInterval = setInterval(() => io.to(thisGame).emit('increment timer'), 1000)
			console.log('joining', data.username, 'in gameId', gameId)
			// gameId++
			// gameRooms[thisGame] = []
		}  else {
			isSpectator = true
			console.log('joining spectator', data.username, 'in gameId', gameId)
			client.on('spectate game', () => {
					console.log('2.5 spectate', gameRooms)
					io.to(thisGame).emit('spectate', {goal: goals[gameId], usernames: gameRooms[thisGame]})
				
				})
		}
		console.log('3',gameRooms)
		client.on('drawing', (data) => io.to(thisGame).emit('drawing', data)),
		client.on('endPath', (data) => io.to(thisGame).emit('endPath', data)),
		client.on('setGuess', (data) => io.to(thisGame).emit('setGuess', data)),
		// client.on('gameOver', () => clearInterval(thisInterval)),
		client.on('clearCanvas', (data) => io.to(thisGame).emit('clearCanvas', data))
		if (!isSpectator){
			client.on('playAgain', () => {
				if (!rematches[thisGame]){
					rematches[thisGame] = 1
				} else {
					rematches[thisGame] = 2
				}
				console.log('playing again', data.username, rematches)
				if (rematches[thisGame] === 2){
					// console.log('rematch')
					// gameRooms[thisGame].push(data.username)
					goal = goal_options[Math.floor(Math.random() * goal_options.length)]
					io.to(thisGame).emit('start game', {goal: goal, usernames: gameRooms[thisGame]})
					rematches[thisGame] = 0
					// gameRooms[thisGame] = []

				}
				console.log('4',gameRooms)
			})
			client.on('left game', () => {
				console.log(data.username, 'left game')
				client.leave(thisGame)

				if (gameRooms[thisGame]){
					// gameRooms[thisGame] = gameRooms[thisGame].filter(name => name !== data.username)
					
					// if (gameRooms[thisGame].length === 0){
					delete gameRooms[thisGame]
					delete rematches[thisGame]
					// }
				}
				io.to(thisGame).emit('opponent left')
				console.log('5',gameRooms)
			})
			client.on('disconnect', () => {
				console.log(data.username, 'disconnected')
				client.leave(thisGame)

				if (gameRooms[thisGame]){
					// gameRooms[thisGame] = gameRooms[thisGame].filter(name => name !== data.username)
					
					// if (gameRooms[thisGame].length === 0){
					delete gameRooms[thisGame]
					delete rematches[thisGame]
					// }
				}
				io.to(thisGame).emit('opponent left')
				console.log('6',gameRooms)
				
			})
		}
	})
})

// io.on('disconnect', () => {
// 	console.log('disconnected', interval)
// 	clearInterval(ServerInterval.get());
// })

const port = process.env.PORT || 8000
io.listen(port)
console.log('listening on port ', port)

