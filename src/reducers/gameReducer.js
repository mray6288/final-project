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
			return Object.assign({}, state, {
				goal: action.data.goal,
				timer: 0,
				opponent: opponent
				})
		default:
			return state

	}
}