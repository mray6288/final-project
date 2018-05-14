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
		    player: 0
		}

		this.scope1 = new paper.PaperScope()
		this.scope2 = new paper.PaperScope()
		this.io = openSocket('http://3f26a47c.ngrok.io')//http://localhost:8000')
		this.io.on('initialize game', this.setPlayer.bind(this))
		this.io.emit('initialize game')

		

		this.io.on('start game', this.startGame.bind(this))
		// console.log('num of players', this.io.sockets.clients().length)

	}
	

	// componentDidMount(){
	// 	this.interval = setInterval(this.incrementTimer, 1000)

		
	// }

	startGame(data){
		this.interval = setInterval(this.incrementTimer, 1000)
		this.setState({
			goal: data.goal,
			gameStarted: true
		})
	}

	setPlayer(data){
		console.log('assigned player', data.player)
		this.setState({
			
			player: data.player
		})
	}

	incrementTimer = () => {
		this.setState({timer:this.state.timer + 1})
	}

	endFetch() {
		console.log('clearing interval')
		clearInterval(this.interval)
	}

	gameOver = () => { 
		this.endFetch()
		this.setState({
		  gameOver: true
		})
	}

	render() {
		let game = (
				<div className='game-container'> 
				<h1>Your Goal: {this.state.goal}</h1>
	        	<h1>Timer: {this.state.timer}</h1>
				<Canvas playerId={this.state.player} io={this.io} scope={this.scope1} goal={this.state.goal} timer={this.state.timer} gameOver={this.gameOver}/>
        		<Canvas playerId={this.state.player} io={this.io} scope={this.scope2} goal={this.state.goal} timer={this.state.timer} gameOver={this.gameOver}/>
				</div>
			)
		return (
				<div>
				{this.state.gameStarted ? game : 'Waiting for player 2'}
				</div>
			)
	}
}

