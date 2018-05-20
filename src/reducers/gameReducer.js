import {defaultState} from './defaultState'
import openSocket from 'socket.io-client'

// Action Cable setup
import actionCable from 'actioncable'




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
		case 'TEST_SOCKET':
			console.log('test socket results', action.payload)
			return Object.assign({}, state, {
				testSocket: action.payload
			})
		case 'UPDATE_GAMES':
			// console.log('UPDATE GAMES ACTION', action)
			return Object.assign({}, state, {openGames: action.games})
		case 'ENTER_GAME':
			
			gameKey++
			
			return Object.assign({}, state, {
				gameKey, 
				
			})
		case 'START_GAME':
			let opponent = null
			let playerId = 0
			if (action.data.usernames[0] === state.user.username){
				opponent = action.data.usernames[1]
				playerId = 1
			} else {
				opponent = action.data.usernames[0]
				playerId = 2
			}
			if (state.scoreboard[state.user.username] === undefined){
				state.scoreboard[state.user.username] = 0
				state.scoreboard[opponent] = 0
			}
			return Object.assign({}, state, {
				goal: action.data.goal,
				timer: 0,
				opponent: opponent,
				playerId: playerId,
				scoreboard: state.scoreboard
				})
		case 'SPECTATE_GAME':
			return Object.assign({}, state, {
				goal: action.data.goal,
				username: action.data.usernames[1],
				opponent: action.data.usernames[0],
				playerId: 3,
				gameOver: false,
				winnerId: null,
			})
		case 'INCREMENT_TIMER':
			return Object.assign({}, state, {timer: state.timer + 1})
		case 'END_GAME':
			// let winner = ''
			let scoreboard = {}
			if (action.winnerId === state.playerId){
				scoreboard[state.user.username] = state.scoreboard[state.user.username] + 1
				scoreboard[state.opponent] = state.scoreboard[state.opponent]
			} else {
				scoreboard[state.user.username] = state.scoreboard[state.user.username]
				scoreboard[state.opponent] = state.scoreboard[state.opponent] + 1
			}

			return Object.assign({}, state, {
				gameOver: true,
				winnerId: action.winnerId,
				scoreboard: scoreboard,
				// goal: ''
			})
		case 'PLAY_AGAIN':
			gameKey++
			return Object.assign({}, state, {
				gameKey,
				gameOver: false,
				timer: 0,
				winnerId: null,
				goal: 'waiting for opponent'
			})
		case 'RESET_GAME_PROPS':
			return Object.assign({}, state, {
				goal: '',
				timer: 0,
				gameOver: false,
				gameKey: null,
				winnerId: null,
				opponent: null,
				scoreboard: {}

			})
		default:
			return state

	}
}