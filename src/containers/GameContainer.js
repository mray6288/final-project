import React from 'react'
import Canvas from '../components/Canvas'
import paper from '../../node_modules/paper/dist/paper-core.js'
import openSocket from 'socket.io-client'


// const goal_options = ['apple','bowtie','circle','hexagon','sword','bike','watermelon','pizza','dog','foot','calculator','smiley face']


export default class GameContainer extends React.Component {
	constructor(props){
		super()
		this.state = {
			goal: '',
		    timer: 0,
		    gameOver: false,
		    gameStarted: false,
		    player: 0,
		    winnerId: 0,
		}

		this.scope1 = new paper.PaperScope()
		this.scope2 = new paper.PaperScope()
		this.scope1._id = 1
		this.scope2._id = 2
		// console.log('new io socket')
		this.io = openSocket('https://3f26a47c.ngrok.io')//http://localhost:8000')
		this.io.on('initialize game', this.setPlayer.bind(this))
		this.io.emit('initialize game', {username: props.username})
		this.io.on('increment timer', this.incrementTimer.bind(this))

		

		this.io.on('start game', this.startGame.bind(this))
		// console.log('num of players', this.io.sockets.clients().length)

	}
	

	// componentDidMount(){
	// 	this.interval = setInterval(this.incrementTimer, 1000)

		
	// }

	startGame(data){
		// console.log('data', data)
		this.interval = setInterval(this.incrementTimer, 1000)
		if (data.usernames[0] === this.props.username){
			this.opponent = data.usernames[1]
		} else {
			this.opponent = data.usernames[0]
		}
		this.setState({
			goal: data.goal,
			gameStarted: true,
		})
	}

	setPlayer(data){
		this.setState({
			winnerId: data.player,
			player: data.player
		})
	}

	incrementTimer = () => {
		this.setState({timer:this.state.timer + 1})
	}

	endFetch() {
		clearInterval(this.interval)
	}

	endGame = () => { 
		this.endFetch()
		this.io.close()
		this.setState({
		  gameOver: true,
		})
	}

	render() {
		console.log('scope1', this.scope1)
		console.log('scope2', this.scope2)
		// console.log('username', this.props)
		// console.log('container state', this.state, this.opponent)
		let game = (
				<div className='game-container'> 
				<h1>Your Goal: {this.state.goal}</h1>
	        	<h1>{this.state.gameOver ? <button onClick={this.props.newGame}>New Game</button> : `Timer: ${this.state.timer}`}</h1>

				<Canvas username={this.props.username} opponent={this.opponent} gameOver={this.state.gameOver} playerId={this.state.player} io={this.io} scope={this.scope1} goal={this.state.goal} timer={this.state.timer} endGame={this.endGame}/>
        		<Canvas username={this.props.username} opponent={this.opponent} gameOver={this.state.gameOver} playerId={this.state.player} io={this.io} scope={this.scope2} goal={this.state.goal} timer={this.state.timer} endGame={this.endGame}/>
				</div>
			)
		return (
				<div>
				{this.state.gameStarted ? game : 'Waiting for player 2'}
				</div>
			)
	}
}

