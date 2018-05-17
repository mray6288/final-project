import React, { Component } from 'react';
import './App.css';
import { ConnectedGameContainer } from './containers/GameContainer'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { login } from './actions/gameActions'
import { ConnectedLobby } from './containers/Lobby'
import { ConnectedSpectatorContainer } from './containers/SpectatorContainer'





class App extends Component {

  
  state = {
    // enterGame: false,
    // username: '',
    // gameNum: 1
  }


  
  submitUsername = (e) => {
    e.preventDefault()
    this.props.login(e.target.username.value)
    // this.props.enterGame(e.target.username.value)
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
    // console.log(this.state)
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
        
        {this.props.gameKey ? (1===1 ? <ConnectedGameContainer newGame={this.newGame}/>  : <ConnectedSpectatorContainer />)
        : (this.props.username ? <ConnectedLobby /> : button)}
        
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
      login: login
    },
    dispatch
  )
}

export const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

