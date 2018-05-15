import React, { Component } from 'react';
import './App.css';
import { ConnectedGameContainer } from './containers/GameContainer'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { enterGame } from './actions/gameActions'


class App extends Component {

  
  state = {
    // enterGame: false,
    // username: '',
    // gameNum: 1
  }


  
  submitUsername = (e) => {
    e.preventDefault()
    this.props.enterGame(e.target.username.value)
    // debugger
    // this.setState({
    //   enterGame: true,
    //   username: event.target.username.value
    // })

  }

  newGame = () => {
    console.log('new game?', this.state)
    this.setState({
      gameNum: this.state.gameNum+1
    })
  }
  



  render() {
    console.log('app props at render', this.props)
    console.log(this.state)
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
        {this.props.gameKey ? <ConnectedGameContainer newGame={this.newGame}/> : button}
        
      </div>
    );
  }
}

function mapStateToProps(state){
  return {io: state.io, 
          gameKey: state.gameKey, 
          username: state.username}
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
      enterGame: enterGame
    },
    dispatch
  )
}

export const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

