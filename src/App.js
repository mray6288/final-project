import React, { Component } from 'react';
import './App.css';
import GameContainer from './containers/GameContainer'




class App extends Component {

  
  state = {
    enterGame: false
  }
  


  
  clickEnterGame = () => {
    this.setState({
      enterGame: true
    })
  }
  



  render() {
    let button = <button onClick={this.clickEnterGame} >Enter Game</button>
    return (
      <div className="App">
        <header className="App-header">
          

          <h1 className="App-title">Drawing Game</h1>
          
        </header>
        <p>Instructions: Race to draw a picture that the AI can recognize!</p>
        {this.state.enterGame ? <GameContainer /> : button}
        
      </div>
    );
  }
}

export default App;
