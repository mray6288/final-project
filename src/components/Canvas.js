import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

class Canvas extends React.Component {
	constructor(props){
		super()
		this.state = {
	
		}
		this.tool = null
		this.path = null
		this.time_0 = 0
		this.isMine = props.scope.name === props.user.username
		
	}

	componentDidMount(){
		// console.log('canvas did mount', this.props)
		this.setupCanvas()
		this.channel = this.props.io.subscriptions.subscriptions[0]		
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
			this.tool.onMouseDown = null
			this.tool.onMouseDrag = this.emitDrawing.bind(this)
			this.tool.onMouseUp = this.emitEndPath.bind(this)
		}

	}

	emitClearCanvas = () => {
		this.channel.perform('clear_canvas', {scope_name: this.props.scope.name, game_id:this.props.gameId})
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
		<canvas id={`canvas-${this.props.scope.name}`} className={this.isWinner() ? 'winning-drawing' : (this.isMine ? 'my-drawing' : 'opponent-drawing')} height='370px' width='670px' resize></canvas>
		<h3>{this.props.scope.name}</h3>
		{this.isMine ? <button onClick={this.emitClearCanvas}>Clear Canvas</button> : ''}
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
		 	guess2: state.guess2
		 }
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
	}, dispatch)
}

export const ConnectedCanvas = connect(mapStateToProps, mapDispatchToProps)(Canvas)

