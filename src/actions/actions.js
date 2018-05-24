// const API_URL = "https://ray-final-project-backend.herokuapp.com/api/v1"
// const API_URL = 'https://2eaa314f.ngrok.io'
const API_URL = "http://localhost:3000/api/v1"
const headers = { 
	"Content-Type": "application/json"
}

export function resetGameData(){
	return {
		type: 'RESET_GAME_DATA'
	}
}

export function updateGames(games){
	return {
		type: 'UPDATE_GAMES',
		games
	}
}

export function enterGame(){
  return {
    type: 'ENTER_GAME',
    
  };
};

export function startGame(game){
	return {
		type: 'START_GAME',
		game
	}
}

export function spectateGame(id){
	return {
		type: 'SPECTATE_GAME',
		id
	}
}

export function startSpectating(game){
	return {
		type: 'START_SPECTATING',
		game
	}
}

export function updateTimerAndGuesses(data){
	// console.log('updateTimerAndGuesses action')
	return {
		type: 'UPDATE_TIMER_AND_GUESSES',
		data
	}
}

export function endGameState(winnerName){
	return {
		type: 'END_GAME',
		winnerName
	}
}

export function playAgain(target){
	return {
		type: 'PLAY_AGAIN',
		target
	}
}

export function connectSocket(){
	return {
		type: 'CONNECT_SOCKET',
	}
}

export function createGame(user){
	return (dispatch) => {
		return fetch(API_URL + "/games", {
			method: "POST",
			headers: headers,
			body: JSON.stringify({player1: user.username})
		})
		.then(res => res.json())
		.then(game => {
			dispatch({
				type: "ENTER_GAME", 
				game: game
			})
		})
	}
}

export function joinGame(user, gameId){
	console.log('join game', user, gameId)
	return (dispatch) => {
		return fetch(API_URL + `/games/${gameId}`, {
			method: "PATCH",
			headers: headers,
			body: JSON.stringify({player2: user.username})
		})
		.then(res => res.json())
		.then(game => {
			dispatch({
				type: "ENTER_GAME", 
				game: game
			})
		})
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
			// console.log("LOGGING IN", user)
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
			// console.log("LOGGING IN", user)
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





