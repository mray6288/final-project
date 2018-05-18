import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { enterGame, updateRooms, spectateGame, connectSocket } from '../actions/actions'


class Lobby extends React.Component {
	constructor(props){
		super()
		if (!props.user){
	        props.history.push('/login')
	      }
		// console.log('lobby constructor', props)
		// this.state = {
			// goal: '',
		 //    timer: 0,
		    // gameOver: false,
		    // gameStarted: false,
		    // player: 0,
		    // winnerId: 0,
		// }

		// console.log('new io socket')
		// this.props.io = openSocket('https://3f26a47c.ngrok.io')//http://localhost:8000')
		// props.io.on('initialize game', (data) => this.playerId = data.playerId)
		// props.io.emit('initialize game', {username: props.user.username})
		// props.io.on('increment timer', this.incrementTimer.bind(this))
		// if (!props.io)
		// 	props.connectSocket()
		


		// props.io.on('start game', this.startGame.bind(this))
		// console.log('num of players', this.props.io.sockets.clients().length)
		// setTimeout(this.enterGame, 5000)
	}

	// componentDidMount(){
		// console.log(this.props)
		// this.props.io.on('game rooms', data => this.props.updateRooms(data))
	// }



	enterGame = () => {
		this.props.enterGame(this.props.user.username)
		console.log(this.props)
		this.props.history.push("/game")
		this.props.io.emit('join game', {username: this.props.user.username})

	}

	spectateGame = () => {
		return null
		// console.log('data', data)
		this.props.io.on('spectate game', data => this.props.spectateGame(data))
		this.props.io.emit('join game', {username: this.props.user.username})
	}


	render(){
		console.log('lobby render', this.props)
		if (this.props.io){
			this.props.io.on('game rooms', data => this.props.updateRooms(data))
		}
		let openRooms = []
		let spectatorRooms = []
		for(let room in this.props.openRooms){
			let players = this.props.openRooms[room]
			if (players.length === 1){
				openRooms.push(<button onClick={this.enterGame}>vs {players[0]}</button>)
			} else {
				spectatorRooms.push(<button onClick={this.spectateGame}>{players[0]} vs {players[1]}</button>)
			}
		}
		return <div className='lobby'>
				<h2>Open Games</h2>
				{openRooms}
				<button onClick={this.enterGame}>NEW GAME</button>
				
				
				</div>
	}

}

function mapStateToProps(state){
	return {io: state.io,
			user: state.user,
			openRooms: state.openRooms,

		 	goal: state.goal,
		 	timer: state.timer,
		 	gameKey: state.gameKey, 
		 	gameOver: state.gameOver,
		 	opponent: state.opponent,
		 	playerId: state.playerId,
		 	
		 }
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		enterGame: enterGame,
		updateRooms: updateRooms,
		spectateGame: spectateGame,
		connectSocket: connectSocket
	}, dispatch)
}

export const ConnectedLobby = connect(mapStateToProps, mapDispatchToProps)(Lobby)
