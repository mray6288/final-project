import React, { Component } from 'react';
import './App.css';
import { ConnectedGameContainer } from './containers/GameContainer'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getUser, logout } from './actions/actions'
import { ConnectedLobby } from './containers/Lobby'
import { ConnectedSpectatorContainer } from './containers/SpectatorContainer'
import Login from './components/Login'
import Signup from './components/Signup'
import {Route, withRouter} from 'react-router-dom'



class App extends Component {

  
  state = {
    // enterGame: false,
    // username: '',
    // gameNum: 1
  }

  componentDidMount(){
    if (localStorage.getItem("token")){
      this.props.getUser()
      .then(() => {
        this.props.history.push('/lobby')
      })
    } 
  }


  
  submitUsername = (e) => {
    e.preventDefault()
    this.props.login(e.target.username.value)


  }

  newGame = () => {
    console.log('new game?', this.state)
    this.setState({
      gameNum: this.state.gameNum+1
    })
  }
  




    render() {
      console.log('app props at render', this.props)

      return (
        <div className="App">
        <button onClick={() => {
          this.props.logout()
          this.props.history.push('/login')
        }}>Logout</button>
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup}/>
        <Route path='/lobby' component={ConnectedLobby}/>
        <Route path='/game' component={ConnectedGameContainer}/>
        </div>
      )
    }
  
}

function mapStateToProps(state){
  return {io: state.io, 
          gameKey: state.gameKey, 
          }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
      // login: login,
      logout: logout,
    },
    dispatch
  )
}

// export const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)
export default withRouter(connect(mapStateToProps, {getUser, logout})(App));
