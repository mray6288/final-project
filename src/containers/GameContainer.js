import React from 'react'
import { ConnectedCanvas } from '../components/Canvas'
import paper from '../../node_modules/paper/dist/paper-core.js'
// import openSocket from 'socket.io-client'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { resetGameProps, startGame, endGameState, playAgain } from '../actions/actions'
import { ConnectedScoreboard } from '../components/Scoreboard'
import { ConnectedGameWebSocket } from '../components/GameWebSocket'


class GameContainer extends React.Component {
	constructor(props){
		super()
		if (!props.user){
	        props.history.push('/lobby')
	      }
		this.state = {
			willRematch: false
		}

		
		// this.props.scope1 = new paper.PaperScope()
		// this.props.scope2 = new paper.PaperScope()
		// this.props.scope1._id = 1
		// this.props.scope2._id = 2
		
		// if(props.io){
		// 	props.io.on('start game', this.startGame.bind(this))
		// 	props.io.on('opponent left', this.opponentLeft)
		// }

	}
	
	componentDidMount(){
		if (!this.props.user){
	        this.props.history.push('/lobby')
	      }
		console.log('game container did mount', this.props)
		this.channel = this.props.io.subscriptions.subscriptions[0]
	}


	componentWillUnmount(){
		// console.log('game container will unmount', this.props)
		// this.channel.leaveChannel({gameId: this.props.gameId})
		// this.props.history.push('/lobby')
	// 	if (this.interval){
	// 		clearInterval(this.interval)
	// 	}
	// 	this.props.resetGameProps()
	// 	this.props.io && this.props.io.emit('left game', this.props.user)
	// 	this.props.io.off('start game')
	// 	this.props.io.off('opponent left')
	}

	// startGame(data){
	// 	this.props.startGame(data)
	// 	console.log('starting timer')
	// 	this.interval = setInterval(this.props.incrementTimer, 1000)

	// }



	// endGame = (winnerId) => {

	// 	clearInterval(this.interval)
	// 	this.interval = null
	// 	this.props.endGameState(winnerId)

	// }

	// opponentLeft = () => {
	// 	alert('opponent left game - redirecting back to lobby')
	// 	setTimeout(() => this.props.history.push('/lobby'), 4000)
	// }

	componentWillUpdate(){
		if(this.props.timer === 0 && this.state.willRematch){
			this.setState({
				willRematch: false
			})
		}
	}

	playAgain = (e) => {
		this.channel.perform('play_again', {game_id:this.props.gameId})
		this.setState({
			willRematch: true
		})
		// this.props.io.emit('playAgain')
		// this.props.playAgain()
		
		
	}

	render() {
		console.log('game container render', this.props)
		
		let canvases = null
        if (this.props.user.username === this.props.player1){
        	canvases = <div><ConnectedCanvas scope={this.props.scope1} endGame={this.endGame} />
				<ConnectedCanvas scope={this.props.scope2} endGame={this.endGame} />
				</div>
        } else {

        	canvases = <div><ConnectedCanvas scope={this.props.scope2} endGame={this.endGame} />
				<ConnectedCanvas scope={this.props.scope1} endGame={this.endGame} />
				</div>
        }
			        

		let game = (
				<div className='game-container'> 
				<ConnectedScoreboard />
				<h1>Draw a {this.props.goal}</h1>
	        	{this.props.gameOver ? (this.state.willRematch || this.props.spectator ? 'Waiting for next game' : <button onClick={this.playAgain}>Play Again</button>) : <h1>Timer: {this.props.timer}</h1>}

	        	{canvases}
	        	</div>
			)
		return (
				<div>
				<ConnectedGameWebSocket />
				{this.props.player2 ? game : 'Waiting for player 2'}
				</div>
			)
	}
}

function mapStateToProps(state){
	return {io: state.io,
		 	goal: state.goal,
		 	timer: state.timer,
		 	gameOver: state.gameOver,
		 	opponent: state.opponent,
		 	playerId: state.playerId,
		 	user: state.user,
		 	player1: state.player1,
		 	player2: state.player2,
		 	scope1: state.scope1,
		 	scope2: state.scope2,
		 	gameId: state.gameId,
		 	spectator: state.spectator

		 }
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		startGame: startGame,
		endGameState: endGameState,
		playAgain: playAgain,
		resetGameProps: resetGameProps
	}, dispatch)
}

export const ConnectedGameContainer = connect(mapStateToProps, mapDispatchToProps)(GameContainer)
