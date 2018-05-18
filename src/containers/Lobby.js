import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { enterGame, updateGames, spectateGame, connectSocket } from '../actions/actions'


class Lobby extends React.Component {
	constructor(props){
		super()
		if (!props.user){
	        props.history.push('/login')
	      }
	    // console.log('constructor')
	    props.io.on('open games', data => this.props.updateGames(data))
		props.io.on('spectate game', data => this.props.spectateGame(data))
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

		


		// props.io.on('start game', this.startGame.bind(this))
		// console.log('num of players', this.props.io.sockets.clients().length)
		// setTimeout(this.enterGame, 5000)
	}


	componentDidMount(){
		// console.log('did mount')
		
		
		this.props.io.emit('open games')
		this.interval = setInterval(() => this.props.io.emit('open games'), 3000)
		
		
	}

	componentWillUnmount(){
		// console.log('will unmount')
		this.interval && clearInterval(this.interval)
		this.props.io.off('open games')
		this.props.io.off('spectate game')
	}



	enterGame = (e) => {
		this.props.enterGame(this.props.user.username)
		// console.log(e)
		
		this.props.history.push("/game")
		this.props.io.emit('join game', {username: this.props.user.username, gameId:e.target.dataset.id})

	}

	spectateGame = (e) => {
		// return null
		// console.log('data', data)
		this.props.history.push("/spectate")
		this.props.io.emit('join game', {username: this.props.user.username, gameId:e.target.dataset.id})
	}


	render(){
		// console.log('lobby render', this.props)
		// if(this.props.io){
		// 	if (!this.interval) {
		// 		this.props.io.on('open games', data => this.props.updateGames(data))
		// 		this.props.io.emit('open games')
		// 	}else {
		// 		clearInterval(this.interval)
		// 		this.interval = setInterval(() => this.props.io.emit('open games'), 3000)
		// 	}
		// }

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
				<h2>Open Games</h2>
				{openGames}<br/>
				<button onClick={this.enterGame}>NEW GAME</button>
				<h2>Spectate Games</h2>
				{spectatorGames}
				
				</div>
	}

}

function mapStateToProps(state){
	return {io: state.io,
			user: state.user,
			openGames: state.openGames,

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
