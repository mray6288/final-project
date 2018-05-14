import React from 'react'
import Canvas from '../components/Canvas'
import paper from '../../node_modules/paper/dist/paper-core.js'
import openSocket from 'socket.io-client'


const goal_options = ['apple','bowtie','circle','hexagon','sword','bike','watermelon','pizza','dog','foot','calculator','smiley face']


export default class GameContainer extends React.Component {
	constructor(props){
		super()
		this.state = {
			goal: '',
		    timer: 0,
		    gameOver: false
		}

		this.scope1 = new paper.PaperScope()
		this.scope2 = new paper.PaperScope()
		this.io = openSocket('http://localhost:8000')
		this.io.on('initialize game', this.setGoal.bind(this))
		this.io.emit('initialize game', {goal: goal_options[Math.floor(Math.random() * goal_options.length)]})

	}
	

	componentDidMount(){
		this.interval = setInterval(this.incrementTimer, 1000)

		
	}

	setGoal(data){
		this.setState({
			goal: data.goal
		})
	}

	incrementTimer = () => {
		this.setState({timer:this.state.timer + 1})
	}

	endFetch() {
		console.log('clearing interval')
		clearInterval(this.interval)
	}

	gameOver = () => {
		this.endFetch()
		this.setState({
		  gameOver: true
		})
	}

	render() {
		console.log(this.io)
		return (
			<div className='game-container'>
				<h1>Your Goal: {this.state.goal}</h1>
	        	<h1>Timer: {this.state.timer}</h1>
				<Canvas io={this.io} scope={this.scope1} goal={this.state.goal} player='1' timer={this.state.timer} gameOver={this.gameOver}/>
        		<Canvas io={this.io} scope={this.scope2} goal={this.state.goal} player='2' timer={this.state.timer} gameOver={this.gameOver}/>
			</div>
			)
	}
}

