const io = require('socket.io')()

const goal_options = ['apple','bowtie','circle','hexagon','sword','bike','watermelon','dog','foot','calculator','smiley face']

var ServerInterval = (function () {
    var serverInterval;
    return {
            set: function (obj) {
            serverInterval = obj;
            },
            get : function() {
            	console.log('clearing interval')
                return serverInterval;
            }
    };

})();

let unmatchedPlayer = null

io.on('connection', (client) => {
	
	client.on('initialize game', () => {
		console.log('initializing game')
		let num_players = Object.keys(io.clients().connected).length
		clearInterval(ServerInterval.get())
		client.emit('initialize game', {player: num_players % 2 + 1})
		if (unmatchedPlayer){
			goal = goal_options[Math.floor(Math.random() * goal_options.length)]
			io.emit('start game', {goal: goal})
			ServerInterval.set(setInterval(() => io.emit('increment timer'), 1000))
			unmatchedPlayer = null
		} else {
			unmatchedPlayer = client
		}
		client.on('drawing', (data) => io.emit('drawing', data)),
		client.on('endPath', (data) => io.emit('endPath', data)),
		client.on('setGuess', (data) => io.emit('setGuess', data)),
		client.on('gameOver', () => clearInterval(ServerInterval.get())),
		client.on('clearCanvas', (data) => io.emit('clearCanvas', data))
	})
})

// io.on('disconnect', () => {
// 	console.log('disconnected', interval)
// 	clearInterval(ServerInterval.get());
// })

const port = 8000
io.listen(port)
console.log('listening on port ', port)

