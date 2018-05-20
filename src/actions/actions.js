const API_URL = "https://ray-final-project-backend.herokuapp.com/api/v1"
// const API_URL = "http://localhost:3000/api/v1"
const headers = { 
	"Content-Type": "application/json"
}

export function socketCallback(payload){
	console.log('socket callback function')
	return {
		type: 'TEST_SOCKET',
		payload
	}
}

export function updateGames(games){
	// console.log('actions games', games)
	return {
		type: 'UPDATE_GAMES',
		games
	}
}

export function resetGameProps(){
	// console.log('actions games', games)
	return {
		type: 'RESET_GAME_PROPS',
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



// function authedHeaders(){
// 	return {
// 		...headers,
// 		"Authorization": localStorage.getItem("token")
// 	}
// }
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





