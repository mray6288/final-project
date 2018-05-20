import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { enterGame, updateGames, spectateGame, connectSocket } from '../actions/actions'
import { ConnectedGameWebSocket } from '../components/GameWebSocket'

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



	// enterGame = (e) => {
	// 	this.props.enterGame(this.props.user.username)
		
	// 	this.props.history.push("/game")
	// 	this.props.io.emit('join game', {username: this.props.user.username, gameId:e.target.dataset.id})

	// }

	// spectateGame = (e) => {

	// 	this.props.history.push("/spectate")
	// 	this.props.io.emit('join game', {username: this.props.user.username, gameId:e.target.dataset.id})
	// }


	render(){

		let openGames = []
		let spectatorGames = []
		for(let game in this.props.openGames){
			let players = this.props.openGames[game]
			if (players.length === 1){
				openGames.push(<button data-id={game} onClick={this.enterGame}>vs {players[0]}</button>)
			} else {
				spectatorGames.push(<button data-id={game} onClick={this.spectateGame}>{players[0]} vs {players[1]}</button>)
			}
		}
		
		
		return <div className='lobby'>
				<ConnectedGameWebSocket />
				<h2>Open Games</h2>
				{openGames}<br/>
				<button onClick={this.enterGame}>NEW GAME</button>
				<h2>Spectate Games</h2>
				{spectatorGames}
				<h2>Logged In Users: {this.props.testSocket[0]}</h2>
				
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
		 	gameKey: state.gameKey, 
		 	gameOver: state.gameOver,
		 	opponent: state.opponent,
		 	playerId: state.playerId,
		 	
		 }
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		enterGame: enterGame,
		updateGames: updateGames,
		spectateGame: spectateGame,
		connectSocket: connectSocket
	}, dispatch)
}

export const ConnectedLobby = connect(mapStateToProps, mapDispatchToProps)(Lobby)
