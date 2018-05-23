import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { createGame, joinGame, spectateGame} from '../actions/actions'
import { ConnectedLobbyWebSocket } from '../components/LobbyWebSocket'

class Lobby extends React.Component {

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
	return {
			user: state.user,
			openGames: state.openGames,
		 	gameId: state.gameId
		 }
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		createGame: createGame,
		spectateGame: spectateGame,
		joinGame: joinGame
	}, dispatch)
}

export const ConnectedLobby = connect(mapStateToProps, mapDispatchToProps)(Lobby)
