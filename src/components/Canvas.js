import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'


const URL = 'https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8'




class Canvas extends React.Component {
	constructor(props){
		super()
		this.state = {
			// guess: '',
			// hasWon: false,
			
		}

		
		this.tool = null
		this.path = null
		// this.vectors = [[],[],[]]
		this.time_0 = 0
		// this.vectorLength = 0


		// this.io = props.io
		// this.io.on('drawing', this.addPoint.bind(this))
		// this.io.on('endPath', this.endPath.bind(this))
		// this.io.on('clearCanvas', this.clearCanvas.bind(this))
		// this.io.on('setGuess', this.setGuess.bind(this))
		this.paperSetup = props.scope
		// this.props.scope.name = props.scope.name
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
		// this.io.off('drawing')
		// this.io.off('endPath')
		// this.io.off('clearCanvas')
		// this.io.off('setGuess')
		
	}



	


	// addPoint(data){
	// 	//need name instead of id!!!!!!!!!!
	// 	if (data.name !== this.props.scope.name){
	// 		return null
	// 	} else {
	// 		this.paperSetup.activate()
	// 	}

	// 	if (!this.path){
	// 		this.path = new this.paperSetup.Path();
	// 		this.path.strokeColor = 'black';
	// 		this.path.strokeWidth = 8;
	// 		// console.log('new path')
	// 	}
		
	// 	this.path.add(data.point);
		
	// }

	// endPath(data){
	// 	//need name instead of id!!!!!!!!!!
	// 	if (data.name !== this.props.scope.name){
	// 		return null
	// 	} else {
	// 		this.paperSetup.activate()
	// 	}
	// 	this.path = null
	// }

	emitDrawing(event){
		if (this.props.gameOver || this.props.goal === 'waiting for opponent'){
			return null
		}

		this.channel.perform('drawing', {point: {x: event.point.x, y: event.point.y}, time: Date.now() - this.time_0, scope_name: this.props.scope.name, game_id:this.props.gameId})
		// this.vectors[0].push(event.point.x)
		// this.vectors[1].push(event.point.y)
		// this.vectors[2].push(Date.now() - this.time_0)
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
		
		this.paperSetup.setup(this.canvas);
		this.paperSetup.view.setViewSize(670, 370)
		// this.clearCanvas({name:this.props.scope.name})
		if (this.channel){
			this.channel.perform('clear_canvas', {scope_name: this.props.scope.name, game_id:this.props.gameId})
		}

		if (this.isMine){
			// this.interval = setInterval(this.fetchGuesses, 1000)

			this.tool = new this.paperSetup.Tool()
			this.time_0 = Date.now()
			this.tool.onMouseDown = null

			this.tool.onMouseDrag = this.emitDrawing.bind(this)

			this.tool.onMouseUp = this.emitEndPath.bind(this)
		}

	}

	


	fetchGuesses = () => {
	// 	if (this.props.gameOver){
	// 		clearInterval(this.interval)
	// 		this.interval = 'inactive'
	// 		return null
	// 	}
	// 	// console.log(this.vectors[0].length, this.)
	// 	if (this.vectors[0].length === this.vectorLength){
	// 		return null
	// 	} else {
	// 		this.vectorLength = this.vectors[0].length
	// 	}

	    // let data = {"input_type":0,
	    //          "requests":[
	    //           {"language":"quickdraw",
	    //           "writing_guide":{"width":1200,"height":260},
	    //           "ink":[this.vectors]
	    //           }
	    //          ]
	    //         }

	//     fetch(URL, {
	//       method: 'POST',
	//       headers: {
	//         'Content-Type':'application/json'
	//       },
	//       body: JSON.stringify(data)
	//     }).then(r=>r.json()).then(json=>this.io.emit('setGuess', {json: json, id:this.props.scope.name}))

	}

	// setGuess(data) {
	// 	//need name instead of id!!!!!!!!!!
	// 	if (data.name !== this.props.scope.name){
	// 		return null
	// 	}
	// 	let json = data.json

	// 	let guesses = json[1][0][1]
	// 	let scores = json[1][0][3].debug_info
	// 	let goalScore = null
		

	// 	console.log(JSON.stringify(guesses))
	// 	if(guesses.length > 0){
	// 		scores = JSON.parse(scores.slice(12, scores.indexOf(' Combiner')))
	// 		for(let score of scores){
	// 			if (score[0] === this.props.goal){
	// 				goalScore = score[1]
	// 				break
	// 			}
	// 		}
	// 		if (guesses[0] === this.props.goal || (this.props.timer > 40 && guesses.slice(0, 5).includes(this.props.goal))){
	// 			if (goalScore < 10){
	// 				this.props.endGame(this.props.scope.name)
	// 				guesses = [this.props.goal]

	// 				// if (this.isMine){
	// 				// 	this.io.emit('gameOver')
	// 				// }
	// 				// console.log(json)
	// 			} else {
	// 				guesses = [guesses[1]]
	// 				console.log(guesses)
	// 			}
	// 		} else if (goalScore){
	// 			console.log(goalScore)
				
	// 		} 
	// 		// if (this.props.timer === 29 && !won){
	// 		// 	lost = true
	// 		// 	this.endFetch()
	// 		// }
	// 		this.setState({
	// 			guess: guesses[0],
	// 			// hasWon: won,
	// 		})
			
	// 	}

		
		

	// }

	emitClearCanvas = () => {
		// console.log('hello')
		this.channel.perform('clear_canvas', {scope_name: this.props.scope.name, game_id:this.props.gameId})
	}

	// clearCanvas = (data) => {
	// 	//need name instead of id!!!!!!!!!!
	// 	if (data.name !== this.props.scope.name ){
	// 		console.log(data.id, this.props.scope.name)
	// 		return null
	// 	}
	// 	this.paperSetup.project.activeLayer.clear()
	// 	this.vectors = [[],[],[]]
	// 	this.setState({
	// 		guess: ''
	// 	})
	// 	// }
	// }


	isWinner() {
		debugger
		return this.props.winnerName === this.props.scope.name
	}


	render() {
		// console.log('canvas render', this.props)
		// console.log('canvas name', this.props.scope.name)

		return <div className='canvas-object'  >
		<h2 className='winner'>{this.isWinner() ? (this.isMine ? `${this.props.user.username} WINS!` : `${this.props.opponent} WINS!`) : <br/>}</h2>
		
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
		 	timer: state.timer,
		 	gameOver: state.gameOver,
		 	opponent: state.opponent,
		 	playerId: state.playerId,
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

