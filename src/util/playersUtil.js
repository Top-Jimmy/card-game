export function initialPlayers(num_players = 2) {
    let players = [];
    for (var i = 0; i<num_players; i++) {
        players.push({
			name: 'Player ' + (i+1).toString(),
			bank: {
                yellow: 0,
                red: 0,
                green: 0,
                black: 0,
                white: 0,
				wild: 0,
			},
			cardCount: {
				yellow: 0,
                red: 0,
                green: 0,
                black: 0,
                white: 0,
			},
			points: 0,
			reserves: [],
			cardList: [],
			titles: [],
		});
    }
    return players;
}

export function getNextPlayer(gameState) {
	// Ending turn, return index of next player
	if (!gameState) {
		console.log('nextPlayer: no gameState');
		return;
	}

	if (gameState.currentPlayer + 1 === gameState.players.length) { // Last player, return first
		return 0;
	} else { // Return next player
		return gameState.currentPlayer + 1;
	}
}
