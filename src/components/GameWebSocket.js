import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { socketCallback } from '../actions/actions'

class GameWebSocket extends React.Component {
  componentDidMount() {
      // debugger
      // this.props.io.getGameData()//window.location.href.match(/\d+$/)[0])
      let what = this.props.io.subscriptions.create({channel: "GameChannel"}, {
        received: (users) => {
          console.log(users)
          this.props.socketCallback(users)
        }
      })
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
    socketCallback: socketCallback
  }, dispatch)
}

export const ConnectedGameWebSocket = connect(mapStateToProps, mapDispatchToProps)(GameWebSocket)
