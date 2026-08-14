
export function getPlayerGameState(gameState, userId) {
    const {hands, ...publicGameState} = gameState;
    
    return {
        ...publicGameState,
        hand: hands?.[userId] ?? []
    };
}