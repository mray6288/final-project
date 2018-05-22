import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { startGame, startSpectating, updateTimerAndGuesses, endGameState, playAgain } from '../actions/actions'

class GameWebSocket extends React.Component {

  componentDidMount() {
      if (!this.props.user){
            window.location.href = '/lobby'
          }
      // debugger
      this.player1_vectors = [[],[],[]]
      this.player2_vectors = [[],[],[]]

      // this.props.io.getGameData()//window.location.href.match(/\d+$/)[0])
      console.log('game web socket did mount', this.props)
      this.subscription = this.props.io.subscriptions.create({channel: "GameChannel", id: this.props.gameId, username: this.props.user.username}, {
        received: (data) => {
          // console.log('received data', data)
          switch (data.type){
            case 'new subscriber':
              if(data.game.player2){
                console.log('start game data', data.game)
                if (data.isPlayer){
                  this.vectors = {
                    [data.game.player1]:[[],[],[]],
                    [data.game.player2]:[[],[],[]],
                  }
                  
                  console.log('player check', data.game.player1, this.props.user.username)
                  if (data.game.player1 === this.props.user.username){

                    this.interval = setInterval(this.incrementTimer, 1000)
                  }
                  this.props.startGame(data.game)
                } else {
                  this.props.startSpectating(data.game)
                }
              }
              break
            case 'opponent_left':
              if (data.username != this.props.user.username){
                this.opponentLeft(data.username)
              }
              break
            case 'drawing':
              if (this.props.player1 === this.props.user.username){
                this.updateVectors(data.data)

              }
              this.addPoint(data.data)
              break
            case 'end_path':
              this.endPath(data.data)
              break
            case 'clear_canvas':
              this.clearCanvas(data.data)
              break
            case 'increment_timer':
              this.props.updateTimerAndGuesses(data.data)
              break
            case 'game_over':
              this.endGame(data)
              break
            case 'play_again':
              if (this.props.player1 === this.props.user.username){

                this.interval = setInterval(this.incrementTimer, 1000)
              }
              this.subscription.perform('clear_canvas', {scope_name: this.props.scope1.name, game_id:this.props.gameId})
              this.subscription.perform('clear_canvas', {scope_name: this.props.scope2.name, game_id:this.props.gameId})
              this.props.playAgain(data.data.target)
              break

            default:
              console.log('message type unknown', data)
          }
        },

        leaveChannel: () => {
          // debugger
          if (!this.props.spectator){
            // console.log(this.subscription, this.props)
            this.subscription.perform('leave_channel', {game_id:this.props.gameId, username:this.props.user.username})
          }
        }
      })
    }

  updateVectors = (data) => {
    this.vectors[data.scope_name][0].push(data.point.x)
    this.vectors[data.scope_name][1].push(data.point.y)
    this.vectors[data.scope_name][2].push(data.time)
    // console.log('NEW VECTORS', this.vectors)
  }

  incrementTimer = () => {
    // console.log('increment timer')
    this.subscription.perform('increment_timer', {game_id:this.props.gameId, vectors:this.vectors})
  }

  endGame = (data) => {
    if (this.interval){
      console.log('clearing interval')
      clearInterval(this.interval)
    }
    for(let v in this.vectors){
      this.vectors[v] = [[],[],[]]
    }
    // console.log('data', data)
    this.props.endGameState(data.winnerName)
  }

  addPoint(data){
    let scope = null

    if (data.scope_name == this.props.player1){
      scope = this.props.scope1
    } else {
      scope = this.props.scope2
    }
    scope.activate()

    if (!scope.path){
      scope.path = new scope.Path();
      scope.path.strokeColor = 'black';
      scope.path.strokeWidth = 8;
    }
    
    scope.path.add(data.point);
    
  }

  endPath(data){
    let scope = null
    if (data.scope_name == this.props.player1){
      scope = this.props.scope1
    } else {
      scope = this.props.scope2
    }

    scope.path = null
  }

  clearCanvas(data){
    let scope = null
    if (data.scope_name == this.props.player1){
      scope = this.props.scope1
    } else {
      scope = this.props.scope2
    }
    scope.project.activeLayer.clear()
    this.vectors[data.scope_name] = [[],[],[]]
  }

  opponentLeft(username){
   alert(`${username} left game - redirecting back to lobby`)
   setTimeout(() => window.location.href = '/lobby', 4000)
  }

  componentWillUnmount() {
    console.log('game web socket will unmount')
    if (this.interval){
      console.log('clearing interval')
      clearInterval(this.interval)
    }
    this.props.io.subscription.leaveChannel()
    this.props.io.subscriptions.remove(this.subscription)
    debugger
  }

  render() {
      return(
        <div />
      )
    }
}

function mapStateToProps(state){
  return {io: state.io,
          gameId: state.gameId,
          user: state.user,
          spectator: state.spectator,
          scope1: state.scope1,
          scope2: state.scope2,
          player1: state.player1,
          player2: state.player2
     }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    startGame: startGame,
    startSpectating: startSpectating,
    updateTimerAndGuesses: updateTimerAndGuesses,
    endGameState: endGameState,
    playAgain: playAgain
  }, dispatch)
}

export const ConnectedGameWebSocket = connect(mapStateToProps, mapDispatchToProps)(GameWebSocket)
