import { TEAM_IDS, RANKS, SUITS } from "../../../shared/gameConstants.js";
import { randomInt } from "node:crypto";

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

        remainingDeck: [],

        biddingData: {
            consecutivePasses: 0,
            hasBidThisAuction: false,
        },

        contract: {
            tricks: 0,
            suit: null,
            teamId: null,
            declarerId: null,
            declarerIndex: null,
        },

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
        },

        roundWinnerTeamId: null,
        matchWinnerTeamId: null,
        roundEndsAt: null
    };
}

export function createDeck() {
    return SUITS.flatMap((suit) => 
        RANKS.map((rank) => ({
            id: `${rank}-${suit}`,
            rank,
            suit,
        }))
    )
}

export function shuffleDeck(deck) {
    const shuffledDeck = [...deck];

    for (let index = shuffledDeck.length - 1; index > 0; index -= 1) {
        const randomIndex = randomInt(index + 1);

        [shuffledDeck[index], shuffledDeck[randomIndex]] = [
            shuffledDeck[randomIndex],
            shuffledDeck[index],
        ];
    }

    return shuffledDeck;
}

export function trickWinner(cardsOnTable, ledSuit, trumpSuit) {
    
}
