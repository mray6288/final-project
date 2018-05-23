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
    if (localStorage.getItem("token")){
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
          <Link to='/lobby'>Lobby</Link>
          {this.props.user ? 
            <div>
            <button onClick={() => {
              this.props.logout()
              this.props.history.push('/login')
            }}>Logout</button>
            Logged in as {this.props.user.username}
            </div>
            : ''}

        </nav>
      </header>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup}/>
        <Route path='/lobby' component={ConnectedLobby}/>
        <Route path='/game/:id' component={ConnectedGameContainer}/>
        <Route component={ConnectedLobby}/>
      </Switch>
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
