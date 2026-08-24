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
        gameLog: [],

        lastTrickWinnerIndex: null,
        roundWinnerTeamId: null,
        matchWinnerTeamId: null,
        roundEndsAt: null,
        matchEndsAt: null
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
    let winningCard = cardsOnTable[0];

    for (const card of cardsOnTable.slice(1)) {
        const cardIsTrump = card.suit === trumpSuit;
        const winnerIsTrump = winningCard.suit === trumpSuit;
        const cardIsLeadSuit = card.suit === ledSuit;
        const winnerIsLeadSuit = winningCard.suit === ledSuit;

        if (!cardIsTrump && !cardIsLeadSuit) continue;

        if (cardIsTrump && !winnerIsTrump) {
            winningCard = card;
            continue;
        }
        if (!cardIsTrump && winnerIsTrump) continue;
        if (cardIsTrump && winnerIsTrump || cardIsLeadSuit && winnerIsLeadSuit) {
            const cardRank = RANKS.indexOf(card.rank);
            const winnerRank = RANKS.indexOf(winningCard.rank);

            if (cardRank > winnerRank) winningCard = card;
        }
    }

    return winningCard;
}

export function getNextBidderIndex(players, playerTricks, roundWinnerTeamId, lastTrickWinnerIndex) {
    const roundWinners = players.filter((player) => 
        player.teamId === roundWinnerTeamId
    )

    const playerOne = roundWinners[0]
    const playerTwo = roundWinners[1]

    if (playerTricks[playerOne.index] > playerTricks[playerTwo.index])
        return playerOne.index;
    else if (playerTricks[playerOne.index] < playerTricks[playerTwo.index])
        return playerTwo.index;
    else return lastTrickWinnerIndex;
}
