import React from 'react'
import paper from '../../node_modules/paper/dist/paper-core.js'
// import {io} from '../api'
import { subscribeToDrawing } from '../api';
// import openSocket from 'socket.io-client'
// const  io = openSocket('http://localhost:8000')

let canvas = null
let tool = null
let path = null
let vectors = [[],[],[]]
let time_0 = 0
const URL = 'https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8'

const goal_options = ['apple','bowtie','circle','hexagon','sword','bike','watermelon','pizza','dog','foot','calculator','smiley face']

export default class Canvas extends React.Component {
	constructor(){
		super()
		this.state = {
			guess: 'No Fucking Clue',
			hasWon: false,
			hasLost: false,
			counter: 0,
			otherCanvas: null,
		}

		// subscribeToDrawing((err, otherCanvas) => this.setState({otherCanvas}), this.canvas)
		// this.socket = props.io()

	}

	goal = goal_options[Math.floor(Math.random() * goal_options.length)]

	

	componentDidMount(){
		this.interval = setInterval(this.fetchGuesses, 1000)
		this.canvas = document.getElementById('myCanvas');
		paper.setup(this.canvas);
		
		tool = new paper.Tool()
		time_0 = Date.now()

		

		let addPoint = (point) => {
			if (!path){
				path = new paper.Path();
				path.strokeColor = 'black';
				console.log('new path')
			}
			let time = Date.now()
			path.add(point);
			// debugger
			vectors[0].push(point.x)
			vectors[1].push(point.y)
			vectors[2].push(time - time_0)
		}

		// io.on('drawing', addPoint);

		tool.onMouseDown = function(event) {
			console.log('hello', this.canvas)
			// onMouseDown(event.point)
			// let {x, y} = event.point
			
			// console.log(x, y)
			// debugger
			// var pointOne     = new paper.Point(x, y);
			// // var pointTwo     = new paper.Point(-150, 100);
			// var pointThree   = new paper.Point(350, 30);
			// path.moveTo(pointOne);
			// // path.lineTo(pointOne.add(pointTwo));
			// // path.lineTo(pointTwo.add(pointThree));
			// path.lineTo(pointOne.add(pointThree));
			// path.closed = true;
			// addPoint(event.point)
			// io.emit('drawing', {point: event.point})

			// paper.view.draw();
		}

		


		tool.onMouseDrag = function(event) {
			addPoint(event.point)
			// io.emit('drawing', {point: event.point})
			
			
			// console.log(vectors)
		}

		tool.onMouseUp = function(event) {
			// console.log('mouse is up', event.point)
			path = null
		}

		// tool.onResize = function(event) {
		// 	// Whenever the window is resized, recenter the path:
		// 	console.log('resizing')
		// 	path.position = paper.view.center;
		// }
		
	}

	endFetch = () => {
		clearInterval(this.interval)
	}

	fetchGuesses = () => {
	    let data = {"input_type":0,
	             "requests":[
	              {"language":"quickdraw",
	              "writing_guide":{"width":1200,"height":260},
	              "ink":[vectors]
	              }
	             ]
	            }

	    fetch(URL, {
	      method: 'POST',
	      headers: {
	        'Content-Type':'application/json'
	      },
	      body: JSON.stringify(data)
	    }).then(r=>r.json()).then(json=>this.setGuess(json))
	}

	setGuess(json) {
		let won = false
		let lost = false
		let guesses = json[1][0][1]
		let scores = json[1][0][3].debug_info
		let goalScore = null
		

		console.log(JSON.stringify(guesses))
		if(guesses.length > 0){
			scores = JSON.parse(scores.slice(12, scores.indexOf(' Combiner')))
			for(let score of scores){
				if (score[0] === this.goal){
					goalScore = score[1]
					break
				}
			}
			if (guesses[0] === this.goal){
				if (goalScore < 10){
					this.endFetch()
					won = true
					guesses = [this.goal]
					console.log(json)
				} else {
					guesses = [guesses[1]]
					console.log(guesses)
				}
			} else if (goalScore){
				console.log(goalScore)
				
			}
			if (this.state.counter === 29 && !won){
				lost = true
				this.endFetch()
			}
			this.setState({
				guess: guesses[0],
				hasWon: won,
				hasLost: lost,
				counter: this.state.counter + 1
			})
		}

		
		

	}






	render() {
		return <div id='canvas-container'  >
		<h1>Your Goal: {this.goal} Timer: {this.state.counter}</h1>
		{this.state.otherCanvas}<br/>
		<canvas id="myCanvas" height='400px' width='800px' resize></canvas>
		<h2>Computer Guess: {this.state.guess}</h2>
		<button onClick={this.endFetch}>EndFetch</button>
		{this.state.hasWon ? <h1>YOU WIN! {this.state.counter} SECONDS</h1> : ''}
		{this.state.hasLost ? <h1>YOU LOST!</h1> : ''}
		</div>
	}
}