import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { addFriend } from '../actions/actions'

class Canvas extends React.Component {
	constructor(props){
		super()
		this.state = {
			isFriend: false
		}
		this.tool = null
		this.path = null
		this.time_0 = 0
		this.isMine = props.scope.name === props.user.username
		this.throttle = 1
	}

	componentDidMount(){
		// console.log('canvas did mount', this.props)
		this.setupCanvas()
		this.channel = this.props.io.subscriptions.subscriptions[0]		
		this.isFriend() && this.setState({isFriend: true})
	}

	componentDidUpdate(prevProps){
		if (prevProps.gameOver && !this.props.gameOver){
			this.setupCanvas()
		}
	}

	componentWillUnMount(){
		if (this.interval){
			clearInterval(this.interval)
		}	
	}

	emitDrawing(event){
		if (this.throttle !== 3){
			this.throttle += 1
			return null
		} else {
			this.throttle = 1
		}
		if (this.props.gameOver || this.props.goal === 'waiting for opponent'){
			return null
		}
		this.channel.perform('drawing', {point: {x: event.point.x, y: event.point.y}, time: Date.now() - this.time_0, scope_name: this.props.scope.name, game_id:this.props.gameId})
	}

	emitEndPath(){
		this.channel.perform('end_path', {scope_name: this.props.scope.name, game_id:this.props.gameId})
	}

	setupCanvas(){
		this.vectors = [[],[],[]]
		this.time_0 = 0
		this.vectorLength = 0
		this.props.scope.name = this.props.scope.name
		this.canvas = document.getElementById(`canvas-${this.props.scope.name}`);
		this.props.scope.setup(this.canvas);
		this.props.scope.view.setViewSize(670, 370)
		if (this.channel){
			this.channel.perform('clear_canvas', {scope_name: this.props.scope.name, game_id:this.props.gameId})
		}
		if (this.isMine){
			this.tool = new this.props.scope.Tool()
			this.time_0 = Date.now()
			this.tool.onMouseDown = this.emitEndPath.bind(this)
			this.tool.onMouseDrag = this.emitDrawing.bind(this)
			this.tool.onMouseUp = this.emitEndPath.bind(this)
		}

	}

	emitClearCanvas = () => {
		this.channel.perform('clear_canvas', {scope_name: this.props.scope.name, game_id:this.props.gameId})
	}

	isFriend() {
		if (this.isMine || this.props.user.friends.find(friend => friend.username === this.props.scope.name)){
			return true
		} else {
			return false
		}
	}

	addFriend = () => {
		this.setState({isFriend: true})
		this.props.addFriend({user: this.props.user, friend: this.props.scope.name, scoreboard: this.props.scoreboard})
	}

	isWinner() {
		return this.props.winnerName === this.props.scope.name
	}

	render() {
		// console.log('canvas render', this.props)
		return <div className='canvas-object'  >
		<h2 className='winner'>{this.isWinner() ? `${this.props.scope.name} WINS!` : <br/>}</h2>
		<h2>AI Guess: {this.props.scope.name === this.props.player1 ? this.props.guess1 : this.props.guess2}</h2>
		<br/>
		<canvas id={`canvas-${this.props.scope.name}`} className={this.isWinner() ? 'winning-drawing' : (this.isMine ? 'my-drawing' : 'opponent-drawing')} resize></canvas>
		<h3>{this.props.scope.name}</h3>
		{!this.state.isFriend ? <button className='btn' onClick={this.addFriend}>Add Friend</button>: ''}
		{this.isMine && !this.props.gameOver ? <button className='btn' onClick={this.emitClearCanvas}>Clear Canvas</button> : ''}
		</div>
	}
}

function mapStateToProps(state){
	return {io: state.io,
		 	goal: state.goal,
		 	gameOver: state.gameOver,
		 	user: state.user,
		 	winnerName: state.winnerName,
		 	player1: state.player1,
		 	player2: state.player2,
		 	gameId: state.gameId,
		 	guess1: state.guess1,
		 	guess2: state.guess2,
		 	scoreboard: state.scoreboard
		 }
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		addFriend: addFriend
	}, dispatch)
}

export const ConnectedCanvas = connect(mapStateToProps, mapDispatchToProps)(Canvas)

