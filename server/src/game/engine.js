import { TEAM_IDS } from "./constants.js";

export function createInitialGameState() {
    return {
        gamePhase: null,
        roundNumber: 1,
        dealNumber: null,
        auctionNumber: null,
        trickNumber: null,
        activePlayerIndex: 0,

        teams: {
            [TEAM_IDS.ONE]: { name: 'Alpha' },
            [TEAM_IDS.TWO]: { name: 'Bravo' }
        },

        hands: {}, 

        biddingData: {
            history: []
        },

        contract: null,

        playingData: {
            ledSuit: null, 
            cardsOnTable: []
        },

        playerTricks: {
            0: 0,
            1: 0,
            2: 0,
            3: 0
        },
        currentHandTricks: {
            [TEAM_IDS.ONE]: 0,
            [TEAM_IDS.TWO]: 0
        },
        matchScore: {
            [TEAM_IDS.ONE]: 0,
            [TEAM_IDS.TWO]: 0
        }
    };
}
