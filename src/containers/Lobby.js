import React from 'react'
import { ConnectedCanvas } from '../components/Canvas'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'


class GameContainer extends React.Component {
	constructor(props){
		super()
		this.state = {
			// goal: '',
		 //    timer: 0,
		    // gameOver: false,
		    // gameStarted: false,
		    // player: 0,
		    // winnerId: 0,
		}

		// console.log('new io socket')
		// this.props.io = openSocket('https://3f26a47c.ngrok.io')//http://localhost:8000')
		props.io.on('initialize game', (data) => this.playerId = data.playerId)
		props.io.emit('initialize game', {username: props.username})
		// props.io.on('increment timer', this.incrementTimer.bind(this))


		props.io.on('start game', this.startGame.bind(this))
		// console.log('num of players', this.props.io.sockets.clients().length)

	}



	render(){
		
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
		 	username: state.username
		 }
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		
	}, dispatch)
}

export const ConnectedLobby = connect(mapStateToProps, mapDispatchToProps)(Lobby)
