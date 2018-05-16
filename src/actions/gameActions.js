export const login = (username) => {
	return {
		type: 'LOGIN',
		username
	}
}

export const updateRooms = (rooms) => {
	console.log('actions rooms', rooms)
	return {
		type: 'UPDATE_ROOMS',
		rooms
	}
}

export const enterGame = () => {
  return {
    type: 'ENTER_GAME',
    
  };
};

export const startGame = (data) => {
	return {
		type: 'START_GAME',
		data
	}
}

export const incrementTimer = () => {
	return {
		type: 'INCREMENT_TIMER',
	}
}

export const endGameState = (winnerId) => {
	return {
		type: 'END_GAME',
		winnerId
	}
}

export const playAgain = (guess) => {
	return {
		type: 'PLAY_AGAIN',
		guess
	}
}


