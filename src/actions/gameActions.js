export const enterGame = (username) => {
  return {
    type: 'ENTER_GAME',
    username
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
