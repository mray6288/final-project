import React, { Component } from 'react';
import './App.css';
import { ConnectedGameContainer } from './containers/GameContainer'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getUser, logout, connectSocket } from './actions/actions'
import { ConnectedLobby } from './containers/Lobby'
import Login from './components/Login'
import Signup from './components/Signup'
import {Route, withRouter, Switch, Link} from 'react-router-dom'

class App extends Component {
  constructor(props){
    super()
    props.connectSocket()
  }

  componentDidMount(){
    // console.log('app did mount', this.props)
    let x = localStorage.getItem('token')
    if (x && x !== 'undefined'){      
      this.props.getUser()
      .then(() => {
        this.props.history.push('/lobby')
      })
    } else {
      this.props.history.push('/login')
    }
  }

  render() {
    // console.log('app props at render', this.props)
    return (
      <div className="App">
      <header>
        
          <nav>
          {this.props.user ? 
            <div>
              <Link class='nav-lobby' to="/lobby">Lobby</Link>
              <h1 class='nav-title'>Doodle Duel</h1>
              <div class='nav-logout'>
              <Link onClick={() => this.props.logout()} to='/login'>
                Logout
              </Link><br/>
              Logged in as {this.props.user.username}
              </div>
            </div>
            
            : ''}
            </nav>
        
      </header>
      <div className='lobby-container'>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup}/>
        <Route path='/lobby' component={ConnectedLobby}/>
        <Route path='/game/:id' component={ConnectedGameContainer}/>
        <Route component={ConnectedLobby}/>
      </Switch>
      </div>
      </div>
    )
  }
  
}

function mapStateToProps(state){
  return {io: state.io, 
          user: state.user
          }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
      getUser: getUser,
      logout: logout,
      connectSocket: connectSocket
      
    },
    dispatch
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
