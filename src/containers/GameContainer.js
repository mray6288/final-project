import React from 'react'
import { ConnectedCanvas } from '../components/Canvas'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
// import { } from '../actions/actions'
import { ConnectedScoreboard } from '../components/Scoreboard'
import { ConnectedGameWebSocket } from '../components/GameWebSocket'

class GameContainer extends React.Component {
	constructor(props){
		super()
		if (!props.user){
	        props.history.push('/lobby')
	      }
		this.state = {
			willRematch: false,
		}
	}
	
	componentDidMount(){
		if (!this.props.user){
	        this.props.history.push('/lobby')
	      }
		// console.log('game container did mount', this.props)
		this.channel = this.props.io.subscriptions.subscriptions[0]
	}

	componentWillUpdate(){
		if(this.props.timer === 0 && this.state.willRematch){
			// console.log('modal open here?')
			this.setState({
				willRematch: false,
			})
		}

	}

	playAgain = (e) => {
		this.channel.perform('play_again', {game_id:this.props.gameId})
		this.setState({
			willRematch: true,
			countdownDown: false
		})		
	}

	render() {
		// console.log('game container render', this.props)
		
		let canvases = null
        if (this.props.user.username === this.props.player1){
        	canvases = <div><ConnectedCanvas scope={this.props.scope1} endGame={this.endGame} />
				<ConnectedCanvas scope={this.props.scope2} endGame={this.endGame} />
				</div>
        } else {

        	canvases = <div><ConnectedCanvas scope={this.props.scope2} endGame={this.endGame} />
				<ConnectedCanvas scope={this.props.scope1} endGame={this.endGame} />
				</div>
        }
			        

		let game = (
				<div className='game-container'> 
				<ConnectedScoreboard />
				
				<h1>Draw a {this.props.goal}</h1>
	        	{this.props.gameOver ? (this.state.willRematch || this.props.spectator ? 'Waiting for next game' : <button onClick={this.playAgain}>Play Again</button>) : <h1>Timer: {this.props.timer}</h1>}

	        	{canvases}
	        	</div>
			)
		return (
				<div>
				<ConnectedGameWebSocket />
				
				{this.props.player2 ? game : 'Waiting for player 2'}
				</div>
			)
	}
}

function mapStateToProps(state){
	return {io: state.io,
		 	goal: state.goal,
		 	timer: state.timer,
		 	gameOver: state.gameOver,
		 	user: state.user,
		 	player1: state.player1,
		 	player2: state.player2,
		 	scope1: state.scope1,
		 	scope2: state.scope2,
		 	gameId: state.gameId,
		 	spectator: state.spectator

		 }
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({

	}, dispatch)
}

export const ConnectedGameContainer = connect(mapStateToProps, mapDispatchToProps)(GameContainer)
