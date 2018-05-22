import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { createGame, joinGame, updateGames, spectateGame, connectSocket } from '../actions/actions'
import { ConnectedLobbyWebSocket } from '../components/LobbyWebSocket'

class Lobby extends React.Component {
	constructor(props){
		super()
		if (!props.user){
	        props.history.push('/login')
	      }
	 //    props.io.on('open games', data => this.props.updateGames(data))
		// props.io.on('spectate game', data => this.props.spectateGame(data))
	}
		


	// componentDidMount(){
		
		
	// 	this.props.io.emit('open games')
	// 	this.interval = setInterval(() => this.props.io.emit('open games'), 3000)
		
		
	// }

	// componentWillUnmount(){
	// 	this.interval && clearInterval(this.interval)
	// 	this.props.io.off('open games')
	// 	this.props.io.off('spectate game')
	// }



	// createGame = (e) => {
	// 	this.props.createGame(this.props.user.username)
		
	// 	this.props.history.push("/game")
	// 	this.props.io.emit('join game', {username: this.props.user.username, gameId:e.target.dataset.id})

	// }

	// spectateGame = (e) => {

	// 	this.props.history.push("/spectate")
	// 	this.props.io.emit('join game', {username: this.props.user.username, gameId:e.target.dataset.id})
	// }

	createGame = () => {

		this.props.createGame(this.props.user)
		.then(() => this.props.history.push(`/game/${this.props.gameId}`))
	}

	joinGame = (e) => {
		e.persist()
		this.props.joinGame(this.props.user, e.target.dataset.id)
		.then(() => this.props.history.push(`/game/${e.target.dataset.id}`))
	}

	spectateGame = (e) => {
		e.persist()
		this.props.spectateGame(e.target.dataset.id)
		this.props.history.push(`/game/${e.target.dataset.id}`)
	}

	render(){

		let openGames = []
		let spectatorGames = []
		for(let game of this.props.openGames){
			if (!game.player2){
				openGames.push(<button data-id={game.id} onClick={this.joinGame}>vs {game.player1}</button>)
			} else {
				spectatorGames.push(<button data-id={game.id} onClick={this.spectateGame}>{game.player1} vs {game.player2}</button>)
			}
		}
		
		
		return <div className='lobby'>
				<ConnectedLobbyWebSocket />
				<h2>Open Games</h2>
				{openGames}<br/>
				<button onClick={this.createGame}>NEW GAME</button>
				<h2>Spectate Games</h2>
				{spectatorGames}
				
				</div>
	}

}

function mapStateToProps(state){
	return {io: state.io,
			user: state.user,
			openGames: state.openGames,
			testSocket: state.testSocket,
		 	goal: state.goal,
		 	timer: state.timer,
		 	gameId: state.gameId, 
		 	gameOver: state.gameOver,
		 	opponent: state.opponent,
		 	playerId: state.playerId,
		 	
		 }
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		createGame: createGame,
		updateGames: updateGames,
		spectateGame: spectateGame,
		connectSocket: connectSocket,
		joinGame: joinGame
	}, dispatch)
}

export const ConnectedLobby = connect(mapStateToProps, mapDispatchToProps)(Lobby)
