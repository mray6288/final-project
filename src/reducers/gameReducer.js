import {defaultState} from './defaultState'
import openSocket from 'socket.io-client'

let gameKey = 0
let playerId = 0

export default function(state = defaultState, action){
	switch(action.type){
		case 'ENTER_GAME':
			playerId++
			gameKey++
			let io = openSocket('https://3f26a47c.ngrok.io')
			return Object.assign({}, state, {
				gameKey, 
				io,
				username: action.username,
				playerId
			})
		case 'START_GAME':
			let opponent = null
			if (action.data.usernames[0] === state.username){
				opponent = action.data.usernames[1]
			} else {
				opponent = action.data.usernames[0]
			}
			if (state.scoreboard[state.username] === undefined){
				state.scoreboard[state.username] = 0
				state.scoreboard[opponent] = 0
			}
			return Object.assign({}, state, {
				goal: action.data.goal,
				timer: 0,
				opponent: opponent,
				playerId: action.data.playerId,
				scoreboard: state.scoreboard
				})
		case 'INCREMENT_TIMER':
			return Object.assign({}, state, {timer: state.timer + 1})
		case 'END_GAME':
			// let winner = ''
			let scoreboard = {}
			if (action.winnerId === state.playerId){
				scoreboard[state.username] = state.scoreboard[state.username] + 1
				scoreboard[state.opponent] = state.scoreboard[state.opponent]
			} else {
				scoreboard[state.username] = state.scoreboard[state.username]
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
		default:
			return state

	}
}