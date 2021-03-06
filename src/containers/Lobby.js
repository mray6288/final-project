import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { createGame, joinGame, spectateGame} from '../actions/actions'
import { ConnectedLobbyWebSocket } from '../components/LobbyWebSocket'

function zoomOutMobile() {
  var viewport = document.querySelector('meta[name="viewport"]');

  if ( viewport ) {
    viewport.content = "initial-scale=1";
  }
}

class Lobby extends React.Component {

	componentDidMount() {
		zoomOutMobile()
	}

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
		let openFriends = []
		let spectatorGames = []
		let spectatorFriends = []
		let friends = []
		// console.log('render lobby props', this.props)
		if (this.props.user){
			friends = this.props.user.friends.map(friend => friend.username)
		}
		let button = null
		// console.log('friends', friends)
		for(let game of this.props.openGames){
			if (!game.player2){
				button = <button data-id={game.id} key={game.id} onClick={this.joinGame}>vs {game.player1}</button>
				if (friends.includes(game.player1)){
					openFriends.push(button)
				} else{
					openGames.push(button)
				}
			} else {
				button = <button data-id={game.id} key={game.id} onClick={this.spectateGame}>{game.player1} vs {game.player2}</button>
				if (friends.includes(game.player1) || friends.includes(game.player2)){
					spectatorFriends.push(button)
				} else {
					spectatorGames.push(button)
				}
			}
		}
		return (
			<div className='lobby'>
				<ConnectedLobbyWebSocket />
				<div className='start-game lobby-divs'>
				<p> Compete to see whose picture is guessed correctly by the Doodle AI first!</p>
				<button onClick={this.createGame}>START NEW GAME</button>
				</div>
				<div className='open-games-container lobby-divs'>
				<h2>Open Games</h2>
				<br/>
				<h3>with friends</h3>
				{openFriends.length > 0 ? '' : 'No friends playing!'}
				{openFriends}
				<br/><br/><br/>
				<h3>all games</h3>
				{openGames.length > 0 ? '' : 'No open games - start a new one!'}
				{openGames}
				</div>
				<div className='open-games-container lobby-divs'>
				
				<h2>Spectate Games</h2>
				<br/>
				<h3>with friends</h3>
				{spectatorFriends.length > 0 ? '' : 'No friends playing!'}
				{spectatorFriends}
				<br/><br/><br/>
				<h3>all games</h3>
				{spectatorGames.length > 0 ? '' : 'No games to spectate!'}
				{spectatorGames}
				</div>
				
			</div>
			)
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
