import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { startGame, startSpectating, updateTimerAndGuesses, endGameState, timeUp, playAgain, resetGameData } from '../actions/actions'
import CountdownModal from '../components/CountdownModal'


class GameWebSocket extends React.Component {

  state = {
    modalKey: 0
  }

  componentDidMount() {
      if (!this.props.user){
            window.location.href = '/lobby'
          }
      window.onbeforeunload = () => {
        this.leaveGame()
      }
      // this.counter = 0
      // console.log('game web socket did mount', this.props)
      this.subscription = this.props.io.subscriptions.create({channel: "GameChannel", id: this.props.gameId, username: this.props.user.username}, {
        received: (data) => {
          // console.log('received data', data)
          switch (data.type){
            case 'new_subscriber':
              this.isPlayer1 = data.game.player1 === this.props.user.username
              // console.log('is player1?', this.isPlayer1)
              if(data.game.player2){
                // console.log('start game data', data.game)
                if (data.isPlayer){
                  // console.log('player check', data.game.player1, this.props.user.username)
                  this.setState({modalKey:this.state.modalKey+1})
                  if (this.isPlayer1){
                    this.vectors = {
                      [data.game.player1]:[[],[],[]],
                      [data.game.player2]:[[],[],[]],
                    }
                    
                    setTimeout(this.startInterval, 4000)
                  }
                  this.props.startGame(data.game)
                } else {
                  // console.log('new sub is spectating')
                  if (this.props.spectator){
                    this.props.startSpectating(data.game)
                  }
                }
              }
              break
            case 'opponent_left':
              if (data.username !== this.props.user.username 
                && (data.username === this.props.player1 || data.username === this.props.player2)){
                this.opponentLeft(data.username)
              }
              break
            case 'drawing':
            // this.counter++
            // console.log('drawing emits: ', this.counter)
              if (this.isPlayer1){
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
              this.setState({modalKey:this.state.modalKey+1})
              if (this.isPlayer1){

                setTimeout(this.startInterval, 4000)
              }
              this.subscription.perform('clear_canvas', {scope_name: this.props.scope1.name, game_id:this.props.gameId})
              this.subscription.perform('clear_canvas', {scope_name: this.props.scope2.name, game_id:this.props.gameId})
              this.props.playAgain(data.data.target)
              break
            case 'time_up':
              this.timeUp()
            default:
              console.log('message type unknown', data)
          }
        }
      })
    }

  updateVectors = (data) => {
    this.vectors[data.scope_name][0].push(data.point.x)
    this.vectors[data.scope_name][1].push(data.point.y)
    this.vectors[data.scope_name][2].push(data.time)
  }

  startInterval = () => {
    this.interval = setInterval(this.incrementTimer, 1000)
  }

  incrementTimer = () => {
    this.subscription.perform('increment_timer', {game_id:this.props.gameId, vectors:this.vectors})
  }

  timeUp = () => {
    if (this.interval){
      // console.log('clearing interval')
      clearInterval(this.interval)
    }
    for(let v in this.vectors){
      this.vectors[v] = [[],[],[]]
    }
    this.props.timeUp()
  }

  endGame = (data) => {
    if (this.interval){
      // console.log('clearing interval')
      clearInterval(this.interval)
    }
    for(let v in this.vectors){
      this.vectors[v] = [[],[],[]]
    }
    this.props.endGameState(data.winnerName)
  }

  addPoint(data){
    if (!this.props.scope2){
      return null
    }
    let scope = null
    if (data.scope_name === this.props.player1){
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
    if (!this.props.scope2){
      return null
    }
    let scope = null
    if (data.scope_name === this.props.player1){
      scope = this.props.scope1
    } else {
      scope = this.props.scope2
    }
    if (scope.path){
      scope.path = null
    }
  }

  clearCanvas(data){
    if (!this.props.scope2){
      return null
    }
    let scope = null
    if (data.scope_name === this.props.player1){
      scope = this.props.scope1
    } else {
      scope = this.props.scope2
    }
    scope.project.activeLayer.clear()
    if (this.isPlayer1){
      this.vectors[data.scope_name] = [[],[],[]]
    }
  }

  opponentLeft(username){
   alert(`${username} left game - redirecting back to lobby`)
   setTimeout(() => window.location.href = '/lobby', 3000)
  }

  leaveGame(){
    this.props.resetGameData()
    if (!this.props.spectator){
      this.subscription.perform('leave_channel', {game_id:this.props.gameId, username:this.props.user.username})
    }
  }

  componentWillUnmount() {
    // console.log('game web socket will unmount', this.props)
    if (this.interval){
      // console.log('clearing interval')
      clearInterval(this.interval)
    }
    this.leaveGame()
    this.props.io.subscriptions.remove(this.subscription)
  }

  render() {
      return(
        <CountdownModal modalKey={this.state.modalKey}/>
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
    playAgain: playAgain,
    resetGameData: resetGameData,
    timeUp: timeUp
  }, dispatch)
}

export const ConnectedGameWebSocket = connect(mapStateToProps, mapDispatchToProps)(GameWebSocket)
