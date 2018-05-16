import React from 'react'
import { ConnectedCanvas } from '../components/Canvas'
import paper from '../../node_modules/paper/dist/paper-core.js'
// import openSocket from 'socket.io-client'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { startGame, incrementTimer, endGameState, playAgain } from '../actions/gameActions'
import { ConnectedScoreboard } from '../components/Scoreboard'

class GameContainer extends React.Component {
	constructor(props){
		super()
		this.state = {

		}
		this.scope1 = new paper.PaperScope()
		this.scope2 = new paper.PaperScope()
		this.scope1._id = 1
		this.scope2._id = 2


		if (this.props.playerId < 3){
			props.io.on('spectate game', this.startGame.bind(this))

	}
	


	spectateGame(data){
		// console.log('data', data)
		this.props.spectateGame(data)
		// this.interval = setInterval(this.props.incrementTimer, 1000)

		// if (data.usernames[0] === this.props.username){
		// 	this.opponent = data.usernames[1]
		// } else {
		// 	this.opponent = data.usernames[0]
		// }

		// this.setState({
		// 	goal: data.goal,
		// 	gameStarted: true,
		// })
	}

	// setPlayer(data){
	// 	this.setState({
	// 		winnerId: data.player,
	// 		player: data.player
	// 	})
	// }

	// incrementTimer = () => {
	// 	this.setState({timer:this.state.timer + 1})
	// }

	// endTimer() {
	// 	clearInterval(this.interval)
	// }

	endGame = (winnerId) => { 
		// this.endTimer()
		// this.props.io.close()
		this.props.endGameState(winnerId)
		// this.setState({
		//   gameOver: true,
		// })
	}

	// playAgain = () => {
	// 	// this.scope1 = new paper.PaperScope()
	// 	// this.scope2 = new paper.PaperScope()
	// 	// this.scope1._id = 1
	// 	// this.scope2._id = 2
	// 	this.props.io.emit('playAgain')
	// 	this.props.playAgain()
		
		
	// }

	render() {
		// console.log('scope1', this.scope1)
		// console.log('scope2', this.scope2)
		// console.log('username', this.props)
		// console.log('playerId', this.props.username, this.playerId)
		
		// <Canvas username={this.props.username} opponent={this.props.opponent} gameOver={this.props.gameOver} playerId={this.playerId} io={this.props.io} scope={this.scope1} goal={this.props.goal} timer={this.props.timer} endGame={this.endGame}/>
        // <Canvas username={this.props.username} opponent={this.props.opponent} gameOver={this.props.gameOver} playerId={this.playerId} io={this.props.io} scope={this.scope2} goal={this.props.goal} timer={this.props.timer} endGame={this.endGame}/>
        let canvases = null
        canvases = <div><ConnectedCanvas scope={this.scope1} endGame={this.endGame} />
			<ConnectedCanvas scope={this.scope2} endGame={this.endGame} />
			</div>
        
        
			        

		let game = (
				<div className='game-container'> 
				<ConnectedScoreboard />
				<h1>Your Goal: {this.props.goal}</h1>
	        	<h1>{this.props.gameOver ? <button onClick={this.playAgain}>Play Again</button> : `Timer: ${this.props.timer}`}</h1>

	        	{canvases}
	        	</div>
			)
		return (
				<div>
				{game}
				</div>
			)
	}
}

function mapStateToProps(state){
	return {io: state.io,
		 	goal: state.goal,
		 	timer: state.timer,
		 	gameKey: state.gameKey, 
		 	gameOver: state.gameOver,
		 	opponent: state.opponent,
		 	playerId: state.playerId,
		 	username: state.username}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		startGame: startGame,
		incrementTimer: incrementTimer,
		endGameState: endGameState,
		playAgain: playAgain
	}, dispatch)
}

export const ConnectedGameContainer = connect(mapStateToProps, mapDispatchToProps)(GameContainer)
