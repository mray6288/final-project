const io = require('socket.io')()

const goal_options = ['apple','bowtie','circle','hexagon','sword','watermelon','dog','foot',
	'butterfly','chair','clock','fish','door','panda','pizza','television','sun',
	'mushroom','eye','eyeglasses','hockey stick','dumbbell','shoe','stop sign',
	'snowman','snowflake','table','tooth','saxophone','star','boomerang','broom',
	'baseball','baseball bat','golf club']

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
		console.log('initializing', data.username, 'in gameId', gameId)
		if (usernames.length > 0){
			usernames.push(data.username)
			client.emit('initialize game', {player: 2})
			goal = goal_options[Math.floor(Math.random() * goal_options.length)]
			io.to(thisGame).emit('start game', {goal: goal, usernames: usernames})
			// let thisInterval = setInterval(() => io.to(thisGame).emit('increment timer'), 1000)
			openGame = false
			gameId++
			usernames = []
		} else {
			usernames.push(data.username)
			client.emit('initialize game', {player: 1})
			openGame = true

		}
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

