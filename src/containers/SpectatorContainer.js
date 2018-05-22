import React from 'react'
import { ConnectedCanvas } from '../components/Canvas'
import paper from '../../node_modules/paper/dist/paper-core.js'
// import openSocket from 'socket.io-client'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { endGameState, spectateGame } from '../actions/actions'
import { ConnectedScoreboard } from '../components/Scoreboard'
import { ConnectedGameWebSocket } from '../components/GameWebSocket'


class SpectatorContainer extends React.Component {
	constructor(props){
		super()
		if (!props.user){
	        props.history.push('/lobby')
	      }
		this.state = {

		}
		this.scope1 = new paper.PaperScope()
		this.scope2 = new paper.PaperScope()
		// this.scope1._id = 1
		// this.scope2._id = 2
		this.scope1.name = props.player1
		this.scope2.name = props.player2

		// console.log('spectator constructor')
		// props.io.on('spectate', this.spectateGame.bind(this))
		// props.io.on('start game', this.spectateGame.bind(this))
		
	}

	componentDidMount(){
		// this.props.io.emit('spectate game')
	}


	componentWillUnmount(){
		this.props.history.push('/lobby')
		// this.props.io.off('spectate game')
		// this.props.io.off('start game')
	}
	


	spectateGame(data){
		this.props.spectateGame(data)

	}


	endGame = (winnerId) => { 
		//MAKE SPECTATOR STATE FALSE
		this.props.endGameState(winnerId)

	}


	render() {
		console.log('spectator container render', this.props)
		this.scope1.name = this.props.player1
		this.scope2.name = this.props.player2
		console.log(this.scope1, this.scope2)
		let canvases = null
        canvases = <div><ConnectedCanvas scope={this.scope1} endGame={this.endGame} />
			<ConnectedCanvas scope={this.scope2} endGame={this.endGame} />
			</div>

		let game = (
				<div className='game-container'> 
				<ConnectedGameWebSocket />
				<ConnectedScoreboard />
				<h1>Draw a {this.props.goal}</h1>
	        	<h1>Timer: {this.props.timer}</h1>

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
		 	gameOver: state.gameOver,
		 	opponent: state.opponent,
		 	playerId: state.playerId,
		 	user: state.user,
		 	player1: state.player1,
		 	player2: state.player2,
		 }
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		endGameState: endGameState,
		spectateGame: spectateGame
	}, dispatch)
}

export const ConnectedSpectatorContainer = connect(mapStateToProps, mapDispatchToProps)(SpectatorContainer)
