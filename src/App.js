import React, { Component } from 'react';
import './App.css';
import { ConnectedGameContainer } from './containers/GameContainer'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getUser, logout, connectSocket } from './actions/actions'
import { ConnectedLobby } from './containers/Lobby'
import { ConnectedSpectatorContainer } from './containers/SpectatorContainer'
import Login from './components/Login'
import Signup from './components/Signup'
import {Route, withRouter, Switch, Link} from 'react-router-dom'



class App extends Component {
  constructor(props){
    super()
    props.connectSocket()
  }



  componentDidMount(){
    // console.log(this.props)
    if (localStorage.getItem("token")){
      this.props.getUser()
      .then(() => {
        this.props.history.push('/lobby')
      })
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
              <button onClick={() => {
                this.props.logout()
                this.props.history.push('/login')
              }}>Logout</button>
              : ''}
          </nav>
        </header>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup}/>
          <Route path='/lobby' component={ConnectedLobby}/>
          <Route path='/game/:id' component={ConnectedGameContainer}/>
          <Route path='/spectate/:id' component={ConnectedSpectatorContainer}/>
          <Route component={Login}/>
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

// export const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
