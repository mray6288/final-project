import React from 'react'
import { ConnectedCanvas } from '../components/Canvas'
import paper from '../../node_modules/paper/dist/paper-core.js'
// import openSocket from 'socket.io-client'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { startGame, incrementTimer, endGameState, playAgain } from '../actions/actions'
import { ConnectedScoreboard } from '../components/Scoreboard'

class GameContainer extends React.Component {
	constructor(props){
		super()
		if (!props.user){
	        props.history.push('/login')
	      }
		this.state = {
			// goal: '',
		 //    timer: 0,
		    // gameOver: false,
		    // gameStarted: false,
		    // player: 0,
		    // winnerId: 0,
		}
		this.scope1 = new paper.PaperScope()
		this.scope2 = new paper.PaperScope()
		this.scope1._id = 1
		this.scope2._id = 2

		// console.log('new io socket')
		// this.props.io = openSocket('https://3f26a47c.ngrok.io')//http://localhost:8000')
		// props.io.on('initialize game', (data) => this.playerId = data.playerId)
		// props.io.emit('initialize game', {username: props.username})
		// props.io.on('increment timer', this.incrementTimer.bind(this))

		if(props.io){
			props.io.on('start game', this.startGame.bind(this))
			props.io.on('opponent left', this.opponentLeft)
		}
		// console.log('num of players', this.props.io.sockets.clients().length)

	}
	

	// componentDidMount(){
	// 	this.interval = setInterval(this.incrementTimer, 1000)

		
	// }

	componentWillUnmount(){
		if (this.interval){
			clearInterval(this.interval)
		}

		this.props.io && this.props.io.emit('left game', this.props.user)
	}

	startGame(data){
		// console.log('data', data)
		this.props.startGame(data)
		console.log('starting timer')
		this.interval = setInterval(this.props.incrementTimer, 1000)

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

	endGame = (winnerId) => {

		// this.props.io.close()
		clearInterval(this.interval)
		this.interval = null
		this.props.endGameState(winnerId)
		// this.setState({
		//   gameOver: true,
		// })
	}

	opponentLeft = () => {
		alert('opponent left game - redirecting back to lobby')
		setTimeout(() => this.props.history.push('/lobby'), 4000)
	}



	playAgain = () => {
		// this.scope1 = new paper.PaperScope()
		// this.scope2 = new paper.PaperScope()
		// this.scope1._id = 1
		// this.scope2._id = 2
		this.props.io.emit('playAgain')
		this.props.playAgain()
		
		
	}

	render() {
		// console.log('scope1', this.scope1)
		// console.log('scope2', this.scope2)
		// console.log('username', this.props)
		// console.log('playerId', this.props.username, this.playerId)
		
		// <Canvas username={this.props.username} opponent={this.props.opponent} gameOver={this.props.gameOver} playerId={this.playerId} io={this.props.io} scope={this.scope1} goal={this.props.goal} timer={this.props.timer} endGame={this.endGame}/>
        // <Canvas username={this.props.username} opponent={this.props.opponent} gameOver={this.props.gameOver} playerId={this.playerId} io={this.props.io} scope={this.scope2} goal={this.props.goal} timer={this.props.timer} endGame={this.endGame}/>
        let canvases = null
        if (this.props.playerId === 1){
        	canvases = <div><ConnectedCanvas scope={this.scope1} endGame={this.endGame} />
				<ConnectedCanvas scope={this.scope2} endGame={this.endGame} />
				</div>
        } else {

        	canvases = <div><ConnectedCanvas scope={this.scope2} endGame={this.endGame} />
				<ConnectedCanvas scope={this.scope1} endGame={this.endGame} />
				</div>
        }
			        

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
				{this.props.opponent ? game : 'Waiting for player 2'}
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
		 	user: state.user}
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
