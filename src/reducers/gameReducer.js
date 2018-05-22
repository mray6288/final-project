import {defaultState} from './defaultState'
import openSocket from 'socket.io-client'

// Action Cable setup
import actionCable from 'actioncable'
import paper from '../../node_modules/paper/dist/paper-core.js'




let gameKey = 0
let playerId = 0

export default function(state = defaultState, action){
	switch(action.type){
		case 'LOGIN':
			playerId++
			// let io = openSocket('https://3f26a47c.ngrok.io')
			// console.log('username set', action.user)
			return Object.assign({}, state, {
				user: action.user,
				playerId,

			})
		case 'LOGOUT':
			return defaultState
		case 'CONNECT_SOCKET':
			// console.log('socket connected')
			// const CableApp = {}
			// CableApp.cable = 
			const io = actionCable.createConsumer(`ws://${window.location.hostname}:3000/cable`)
			// let io = openSocket('https://3f26a47c.ngrok.io')
			return Object.assign({}, state, {
				io
			})
		// case 'TEST_SOCKET':
		// 	console.log('test socket results', action.payload)
		// 	return Object.assign({}, state, {
		// 		testSocket: action.payload
		// 	})
		case 'UPDATE_GAMES':
			console.log('UPDATE GAMES ACTION', action)
			return Object.assign({}, state, {openGames: action.games})
		case 'ENTER_GAME':
			console.log('ENTER GAME REDUCER', action)
			return Object.assign({}, state, {
				gameId: action.game.id
				
			})
		case 'START_GAME':
			console.log('start game reducer', action)
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
			console.log('spectate game reducer', action)
			return Object.assign({}, state, {
				gameId: action.id,
				spectator: true
			})
		case 'START_SPECTATING':
			console.log('start spectating reducer', action)
			let scope11 = new paper.PaperScope()
			let scope22 = new paper.PaperScope()

			scope11.name = action.game.player1
			scope22.name = action.game.player2
			return Object.assign({}, state, {
				goal: action.game.target,
				timer: 0,
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
				timer: state.timer + 1,
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
				newScoreboard[state.player] = state.scoreboard[state.player1]
				newScoreboard[state.player2] = state.scoreboard[state.player2] + 1
			}

			return Object.assign({}, state, {
				gameOver: true,
				winnerName: action.winnerName,
				scoreboard: newScoreboard,
				// goal: ''
			})
		case 'PLAY_AGAIN':
			return Object.assign({}, state, {
				gameOver: false,
				timer: 0,
				winnerName: null,
				goal: action.target
			})
		case 'RESET_GAME_PROPS':
			return Object.assign({}, state, {
				goal: '',
				timer: 0,
				gameOver: false,
				gameKey: null,
				winnerName: null,
				opponent: null,
				scoreboard: {}

			})
		default:
			return state

	}
}