import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas'
import paper from '../../node_modules/paper/dist/paper-core.js'


const goal_options = ['apple','bowtie','circle','hexagon','sword','bike','watermelon','pizza','dog','foot','calculator','smiley face']


class App extends Component {

  
  state = {
    goal: goal_options[Math.floor(Math.random() * goal_options.length)],
    timer: 0,
    gameOver: false
  }
  scope1 = new paper.PaperScope()
  scope2 = new paper.PaperScope()


  componentDidMount(){
    this.interval = setInterval(this.incrementTimer, 1000)
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
    return (
      <div className="App">
        <header className="App-header">
          

          <h1 className="App-title">Drawing Game</h1>
          
        </header>
        <p>Instructions: Race to draw a picture that the AI can recognize!</p>
        <h1>Your Goal: {this.state.goal}</h1>
        <h1>Timer: {this.state.timer}</h1>
        <Canvas scope={this.scope1} goal={this.state.goal} player='1' timer={this.state.timer} gameOver={this.gameOver}/>
        <Canvas scope={this.scope2} goal={this.state.goal} player='2' timer={this.state.timer} gameOver={this.gameOver}/>
      </div>
    );
  }
}

export default App;
