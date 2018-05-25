import {defaultState} from './defaultState'
import actionCable from 'actioncable'
import paper from '../../node_modules/paper/dist/paper-core.js'

const webSocketURL = 'wss://ray-final-project-backend.herokuapp.com/cable'
// const webSocketURL = 'wss://2eaa314f.ngrok.io'
// const webSocketURL = 'http://localhost:3000/cable'



export default function(state = defaultState, action){
	switch(action.type){
		case 'LOGIN':
			return Object.assign({}, state, {
				user: action.user,
			})
		case 'LOGOUT':
			return Object.assign({}, defaultState, {
				io: state.io
			})
		case 'CONNECT_SOCKET':
			const io = actionCable.createConsumer(webSocketURL)
			return Object.assign({}, state, {
				io
			})
		case 'RESET_GAME_DATA':
			return Object.assign({}, defaultState, {
				io: state.io,
				user: state.user
			})
		case 'UPDATE_GAMES':
			// console.log('UPDATE GAMES ACTION', action)
			return Object.assign({}, state, {openGames: action.games})
		case 'ENTER_GAME':
			// console.log('ENTER GAME REDUCER', action)
			return Object.assign({}, state, {
				gameId: action.game.id
			})
		case 'START_GAME':
			// console.log('start game reducer', action)
			let opponent = null
			let playerId = 0
			if (action.game.player1 === state.user.username){
				opponent = action.game.player2
				playerId = 1
			} else {
				opponent = action.game.player1
				playerId = 2
			}
			let scope1 = new paper.PaperScope()
			let scope2 = new paper.PaperScope()
			scope1.name = action.game.player1
			scope2.name = action.game.player2
			return Object.assign({}, state, {
				goal: action.game.target,
				timer: 0,
				opponent: opponent,
				playerId: playerId,
				player1: action.game.player1,
				player2: action.game.player2,
				scope1: scope1,
				scope2: scope2,
				scoreboard: {
					[action.game.player1]:action.game.player1_score,
					[action.game.player2]:action.game.player2_score,
				}
			})
		case 'SPECTATE_GAME':
			// console.log('spectate game reducer', action)
			return Object.assign({}, state, {
				gameId: action.id,
				spectator: true
			})
		case 'START_SPECTATING':
			// console.log('start spectating reducer', action)
			let scope11 = new paper.PaperScope()
			let scope22 = new paper.PaperScope()
			scope11.name = action.game.player1
			scope22.name = action.game.player2
			return Object.assign({}, state, {
				goal: action.game.target,
				timer: action.game.timer,
				player1: action.game.player1,
				player2: action.game.player2,
				scope1: scope11,
				scope2: scope22,
				scoreboard: {
					[action.game.player1]:action.game.player1_score,
					[action.game.player2]:action.game.player2_score,
				}
			})
		case 'UPDATE_TIMER_AND_GUESSES':
			return Object.assign({}, state, {
				timer: action.data.timer,
				guess1: action.data.guess1,
				guess2: action.data.guess2
			})
		case 'END_GAME':
			// console.log(action)
			let newScoreboard = {}
			if (action.winnerName === state.player1){
				newScoreboard[state.player1] = state.scoreboard[state.player1] + 1
				newScoreboard[state.player2] = state.scoreboard[state.player2]
			} else {
				newScoreboard[state.player1] = state.scoreboard[state.player1]
				newScoreboard[state.player2] = state.scoreboard[state.player2] + 1
			}
			return Object.assign({}, state, {
				gameOver: true,
				winnerName: action.winnerName,
				scoreboard: newScoreboard,
			})
		case 'TIME_UP':
			return Object.assign({}, state, {
				gameOver: true,
			})
		case 'PLAY_AGAIN':
			return Object.assign({}, state, {
				gameOver: false,
				timer: 0,
				winnerName: null,
				goal: action.target
			})
		default:
			return state

	}
}