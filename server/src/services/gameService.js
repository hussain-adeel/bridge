import {
    AUCTION_NUMBERS,
    BID_VALUES,
    CARDS_PER_PLAYER,
    DEAL_CARD_COUNTS,
    DEAL_NUMBERS,
    FIRST_TRICK_NUMBER,
    GAME_PHASES,
    MAX_PLAYERS,
    SUITS,
} from "../../../shared/gameConstants.js";
import { createDeck, shuffleDeck } from "../game/engine.js";
import { getValidRoom } from "../utils/roomUtils.js";

export function getPlayerGameState(gameState, userId) {
    const {hands, remainingDeck, ...publicGameState} = gameState;
    
    return {
        ...publicGameState,
        hand: hands?.[userId] ?? []
    };
}

export function dealCurrentPacket(gameState, players) {
    const dealNumber = gameState.dealNumber;
    const cardCount = DEAL_CARD_COUNTS[dealNumber];

    if (!cardCount) return {
        success: false,
        error: `Invalid deal number: ${dealNumber}`
    }

    if (gameState.gamePhase !== GAME_PHASES.DEALING) return {
        success: false,
        error: `Cannot deal in current phase: ${gameState.gamePhase}`
    }

    if (dealNumber === DEAL_NUMBERS.FIRST) 
        gameState.remainingDeck = shuffleDeck(createDeck());

    if (
    dealNumber === DEAL_NUMBERS.FINAL &&
    !Number.isInteger(gameState.contract?.declarerIndex)
    ) {
    return {
        success: false,
        error: "A final contract is required before the final deal.",
    };
    };
    
    if (gameState.remainingDeck.length < cardCount * players.length)
        return { success: false, error: "Not enough cards remaining to deal." };

    players.forEach(player => {
        gameState.hands[player.id] ??= [];

        const newCards = gameState.remainingDeck.splice(0, cardCount);
        gameState.hands[player.id].push(...newCards);
    });

    switch (dealNumber) {
        case DEAL_NUMBERS.FIRST:
            gameState.gamePhase = GAME_PHASES.BIDDING;
            gameState.auctionNumber = AUCTION_NUMBERS.FIRST;

            break;
        case DEAL_NUMBERS.SECOND:
            gameState.gamePhase = GAME_PHASES.BIDDING;
            gameState.auctionNumber = AUCTION_NUMBERS.SECOND;

            break;
        case DEAL_NUMBERS.FINAL:
            gameState.gamePhase = GAME_PHASES.PLAYING;
            gameState.trickNumber = FIRST_TRICK_NUMBER;
            gameState.activePlayerIndex = gameState.contract.declarerIndex;

            const allCardsDealt = players.every((player) => 
                gameState.hands[player.id].length === CARDS_PER_PLAYER
            );

            if (!allCardsDealt) return {
                success: false,
                error: "Players have incorrect number of cards"
            };

            break;
    }

    return {
        success: true,
        gameState,
        players,
    }
}

export function bid({ userId, roomCode, tricks, suit }) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;

    const player = room.roomState.players.find((player) => player.id === userId);

    if (!player) return {
        success: false, 
        error: "You are not connected to this room."
    };

    if (room.gameState.gamePhase !== GAME_PHASES.BIDDING) return {
        success: false,
        error: `Cannot bid when in phase: ${room.gameState.gamePhase}`
    }

    if (player.index !== room.gameState.activePlayerIndex) {
        return {
            success: false,
            error: "It is not your turn to bid.",
        };
    }

    const isValidTricks =
        Number.isInteger(tricks) &&
        BID_VALUES.includes(tricks) &&
        tricks > room.gameState.contract.tricks;

    if (!isValidTricks) return {
        success: false,
        error: "Invalid trick amount for bid."
    }

    const isValidSuit = SUITS.includes(suit);

    if (!isValidSuit) return {
        success: false,
        error: "Invalid suit for bid."
    }

    // set bid
    room.gameState.contract = {
        tricks: tricks,
        suit: suit,
        teamId: player.teamId,
        declarerId: player.id,
        declarerIndex: player.index,
    }

    
    room.gameState.activePlayerIndex = (player.index + 1) % MAX_PLAYERS;
    room.gameState.biddingData = {
        consecutivePasses: 0,
    }


    return {
        success: true,
        roomCode: normalizedRoomCode
    }
}

export function bidPass({ userId, roomCode }) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;

    const player = room.roomState.players.find((player) => player.id === userId);
    if (!player) return {
        success: false, 
        error: "You are not connected to this room."
    };
}