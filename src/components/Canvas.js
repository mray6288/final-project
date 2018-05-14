import React from 'react'


const URL = 'https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8'




export default class Canvas extends React.Component {
	constructor(props){
		super()
		this.state = {
			guess: '',
			hasWon: false,
			gameOver: props.gameOver,
			
		}
		this.isMine = props.scope._id === props.playerId
		this.tool = null
		this.path = null
		this.vectors = [[],[],[]]
		this.time_0 = 0
		this.vectorLength = 0

		this.io = props.io
		this.io.on('drawing', this.addPoint.bind(this))
		this.io.on('endPath', this.endPath.bind(this))
		this.io.on('setGuess', this.setGuess.bind(this))
		this.paperSetup = props.scope
		
	}

	


	addPoint(data){
		if (data.id !== this.paperSetup._id){
			return null
		} else {
			this.paperSetup.activate()
		}

		if (!this.path){
			this.path = new this.paperSetup.Path();
			this.path.strokeColor = 'black';
			// console.log('new path')
		}
		
		this.path.add(data.point);
		
	}

	endPath(data){
		if (data.id !== this.paperSetup._id){
			return null
		} else {
			this.paperSetup.activate()
		}
		this.path = null
	}

	emitDrawing(event){

		this.io.emit('drawing', {point: {x: event.point.x, y: event.point.y}, id: this.paperSetup._id})
		this.vectors[0].push(event.point.x)
		this.vectors[1].push(event.point.y)
		this.vectors[2].push(Date.now() - this.time_0)
	}

	emitEndPath(){

		// console.log('ending path on', this.paperSetup._id)
		this.io.emit('endPath', {id: this.paperSetup._id})
	}

	componentDidMount(){
		

		this.canvas = document.getElementById(`canvas-${this.paperSetup._id}`);
		
		this.paperSetup.setup(this.canvas);
		
		
		

		if (this.isMine){
			this.interval = setInterval(this.fetchGuesses, 1000)

			this.tool = new this.paperSetup.Tool()
			this.time_0 = Date.now()
			this.tool.onMouseDown = null

			this.tool.onMouseDrag = this.emitDrawing.bind(this)

			this.tool.onMouseUp = this.emitEndPath.bind(this)
		}

		// tool.onResize = function(event) {
		// 	// Whenever the window is resized, recenter the path:
		// 	console.log('resizing')
		// 	path.position = paper.view.center;
		// }
		
	}



	fetchGuesses = () => {
		// console.log(this.vectors[0].length, this.)
		if (this.vectors[0].length === this.vectorLength){
			return null
		} else {
			this.vectorLength = this.vectors[0].length
		}

	    let data = {"input_type":0,
	             "requests":[
	              {"language":"quickdraw",
	              "writing_guide":{"width":1200,"height":260},
	              "ink":[this.vectors]
	              }
	             ]
	            }

	    fetch(URL, {
	      method: 'POST',
	      headers: {
	        'Content-Type':'application/json'
	      },
	      body: JSON.stringify(data)
	    }).then(r=>r.json()).then(json=>this.io.emit('setGuess', {json: json, id:this.paperSetup._id}))

	}

	setGuess(data) {
		if (data.id !== this.paperSetup._id){
			return null
		}
		let json = data.json

		let won = false
		let guesses = json[1][0][1]
		let scores = json[1][0][3].debug_info
		let goalScore = null
		

		console.log(JSON.stringify(guesses))
		if(guesses.length > 0){
			scores = JSON.parse(scores.slice(12, scores.indexOf(' Combiner')))
			for(let score of scores){
				if (score[0] === this.props.goal){
					goalScore = score[1]
					break
				}
			}
			if (guesses[0] === this.props.goal){
				if (goalScore < 10){
					this.props.gameOver()
					won = true
					guesses = [this.props.goal]
					// console.log(json)
				} else {
					guesses = [guesses[1]]
					console.log(guesses)
				}
			} else if (goalScore){
				console.log(goalScore)
				
			}
			// if (this.props.timer === 29 && !won){
			// 	lost = true
			// 	this.endFetch()
			// }
			this.setState({
				guess: guesses[0],
				hasWon: won,
				gameOver: true,
			})
		}

		
		

	}

	clearCanvas = () => {
		this.paperSetup.project.activeLayer.clear()
		if (!this.state.gameOver){
			this.vectors = [[],[],[]]
		}
	}





	render() {
		return <div className='canvas-object'  >
		<h2 className='winner'>{this.state.hasWon ? `PLAYER ${this.props.playerId} WINS! ${this.props.timer} SECONDS` : <br/>}</h2>
		
		<h2>AI Guess: {this.state.guess}</h2>
		{this.state.otherCanvas}<br/>
		<canvas id={`canvas-${this.paperSetup._id}`} className={this.state.hasWon ? 'winning-drawing' : 'drawing'} height='370px' width='670px' resize></canvas>
		<h3>{this.paperSetup._id === this.props.playerId ? 'YOU' : 'THEM'}</h3>
		<button onClick={this.clearCanvas}>Clear</button>
		</div>
	}
}