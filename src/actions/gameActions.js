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

export const endGameState = () => {
	return {
		type: 'END_GAME',
	}
}
