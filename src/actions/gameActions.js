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