import React, { Component } from 'react';
import './App.css';
import GameContainer from './containers/GameContainer'




class App extends Component {

  
  state = {
    enterGame: false,
    username: '',
    gameNum: 1
  }


  
  submitUsername = (event) => {
    this.setState({
      enterGame: true,
      username: event.target.username.value,
      gameContainer: <GameContainer key={this.state.gameNum} username={this.state.username} newGame={this.newGame}/>
    })

  }

  newGame = () => {
    console.log('new game?', this.state)
    this.setState({
      gameNum: this.state.gameNum+1,
      gameContainer: <GameContainer key={this.state.gameNum+1} username={this.state.username} newGame={this.newGame}/>
    })
  }
  



  render() {
    let button = (
      <form onSubmit={this.submitUsername}>

      Username: <input type='text' name='username' />
      <input type='submit' value='Enter Game'/>
      </form>
      )
    return (
      <div className="App">
        <header className="App-header">
          

          <h1 className="App-title">Drawing Game</h1>
          
        </header>
        <p>Instructions: Race to draw a picture that the AI can recognize!</p>
        {this.state.enterGame ? <GameContainer key={this.state.gameNum+1} username={this.state.username} newGame={this.newGame}/> : button}
        
      </div>
    );
  }
}

export default App;
