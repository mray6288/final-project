const API_URL = "https://ray-final-project-backend.herokuapp.com/api/v1"
const headers = { 
	"Content-Type": "application/json"
}


export function updateRooms(rooms){
	// console.log('actions rooms', rooms)
	return {
		type: 'UPDATE_ROOMS',
		rooms
	}
}

export function enterGame(){
  return {
    type: 'ENTER_GAME',
    
  };
};

export function startGame(data){
	return {
		type: 'START_GAME',
		data
	}
}

export function spectateGame(data){
	return {
		type: 'SPECTATE_GAME',
		data
	}
}

export function incrementTimer(){
	return {
		type: 'INCREMENT_TIMER',
	}
}

export function endGameState(winnerId){
	return {
		type: 'END_GAME',
		winnerId
	}
}

export function playAgain(guess){
	return {
		type: 'PLAY_AGAIN',
		guess
	}
}

export function connectSocket(){
	return {
		type: 'CONNECT_SOCKET',
	}
}

//login stuff



function authedHeaders(){
	return {
		...headers,
		"Authorization": localStorage.getItem("token")
	}
}
export function login(username, password){
	return (dispatch) => {
		return fetch(API_URL + "/login", {
			method: "POST",
			headers: headers,
			body: JSON.stringify({username, password})
		})
		.then(res => res.json())
		.then(user => {
			console.log("LOGGING IN", user)
			localStorage.setItem("token", user.jwt)
			dispatch({
				type: "LOGIN", 
				user: user.user
			})
		})
	}
}

export function signup(username, password){
	return (dispatch) => {
		return fetch(API_URL + "/signup", {
			method: "POST",
			headers: headers,
			body: JSON.stringify({username, password})
		})
		.then(res => res.json())
		.then(user => {
			console.log("LOGGING IN", user)
			localStorage.setItem("token", user.jwt)
			dispatch({
				type: "LOGIN", 
				user: user.user
			})
		})
	}
}

export function getUser(){

	const token = localStorage.getItem("token")
	return (dispatch) => {
		return fetch(API_URL + "/get_user", {
			headers: {
				"Authorization": token
			}
		})
		.then(res => res.json())
		.then(user => {
			dispatch({
				type: "LOGIN",
				user: user.user
			})
		})
	}
}

export function logout(){
	localStorage.removeItem("token")
	return {
		type: "LOGOUT"
	}
}

// export function createMatch(bot_id){

// 	return (dispatch) => {
// 		return fetch(API_URL + "/bots/match", {
// 			method: "POST",
// 			headers: authedHeaders(),
// 			body: JSON.stringify({bot_id})
// 		})
// 		.then(res => res.json())
// 		.then(match => {
// 			dispatch({type: "NEW_MATCH", payload: match})
// 		})
// 	}
// }

// export function deleteMatch(match_id){
// 	return (dispatch) => {
// 		return fetch(API_URL + "/bots/delete_match", {
// 			method: "POST",
// 			headers: authedHeaders(),
// 			body: JSON.stringify({match_id})
// 		})
// 		.then(res => res.json())
// 		.then(message => {
// 			dispatch({type: "DELETE_MATCH", payload: match_id})
// 		})
// 	}
// }

// export function getBots(){
// 	return (dispatch) => {
// 		return fetch(API_URL + "/bots")
// 		.then(res => res.json())
// 		.then(bots => {
// 			dispatch({type: "GET_BOTS", payload: bots})
// 		})
// 	}
// }




