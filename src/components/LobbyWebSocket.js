import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { updateGames } from '../actions/actions'

class LobbyWebSocket extends React.Component {
  componentDidMount() {
      this.subscription = this.props.io.subscriptions.create({channel: "LobbyChannel"}, {
        received: (games) => {
          // console.log('games', games)
          this.props.updateGames(games)
        }
      })
    }

  componentWillUnmount() {
    this.props.io.subscriptions.remove(this.subscription)
  }
  
  render() {
      return(
        <div />
      )
    }
}

function mapStateToProps(state){
  return {io: state.io,
          
     }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    updateGames: updateGames
  }, dispatch)
}

export const ConnectedLobbyWebSocket = connect(mapStateToProps, mapDispatchToProps)(LobbyWebSocket)
