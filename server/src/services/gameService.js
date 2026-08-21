import {
    AUCTION_NUMBERS,
    BID_VALUES,
    CARDS_PER_PLAYER,
    CARDS_PER_TRICK,
    DEAL_CARD_COUNTS,
    DEAL_NUMBERS,
    FIRST_TRICK_NUMBER,
    GAME_PHASES,
    MAX_PLAYERS,
    SUITS,
    TEAM_IDS,
    TRICKS_PER_ROUND,
} from "../../../shared/gameConstants.js";
import { createDeck, shuffleDeck, trickWinner } from "../game/engine.js";
import { getValidRoom } from "../utils/roomUtils.js";
import { saveRoom } from "../game/state.js";

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
            gameState.biddingData = {
                consecutivePasses: 0,
                hasBidThisAuction: false,
            };

            break;
        case DEAL_NUMBERS.SECOND:
            gameState.gamePhase = GAME_PHASES.BIDDING;
            gameState.auctionNumber = AUCTION_NUMBERS.SECOND;
            gameState.biddingData = {
                consecutivePasses: 0,
                hasBidThisAuction: false,
            };

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
        error: `Cannot pass or bid when in phase: ${room.gameState.gamePhase}`
    }

    if (player.index !== room.gameState.activePlayerIndex) {
        return {
            success: false,
            error: "It is not your turn to pass or bid.",
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
        hasBidThisAuction: true,
    }

    saveRoom(normalizedRoomCode, room);

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

    if (room.gameState.gamePhase !== GAME_PHASES.BIDDING) return {
        success: false,
        error: `Cannot pass or bid when in phase: ${room.gameState.gamePhase}`
    }

    if (player.index !== room.gameState.activePlayerIndex) {
        return {
            success: false,
            error: "It is not your turn to pass or bid.",
        };
    }

    // ensure some contract exists
    if (room.gameState.contract.tricks === 0) return {
        success: false,
        error: "You cannot pass as the starting player."
    }

    room.gameState.biddingData.consecutivePasses += 1;

    const passesRequired = room.gameState.biddingData.hasBidThisAuction
        ? MAX_PLAYERS - 1
        : MAX_PLAYERS;

    if (room.gameState.biddingData.consecutivePasses >= passesRequired) {
        room.gameState.gamePhase = GAME_PHASES.DEALING;
        room.gameState.dealNumber += 1;
        room.gameState.biddingData = {
            consecutivePasses: 0,
            hasBidThisAuction: false,
        };
        room.gameState.activePlayerIndex = room.gameState.contract.declarerIndex;
        
        const dealResult = dealCurrentPacket(room.gameState, room.roomState.players);

        if (!dealResult.success) return dealResult;

        saveRoom(normalizedRoomCode, room);

        return {
            success: true,
            roomCode: normalizedRoomCode
        }
    }

    room.gameState.activePlayerIndex = (player.index + 1) % MAX_PLAYERS;

    saveRoom(normalizedRoomCode, room);

    return {
        success: true,
        roomCode: normalizedRoomCode
    }
}

export function playCard({ userId, roomCode, cardId }) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;

    const player = room.roomState.players.find((player) => player.id === userId);
    if (!player) return {
        success: false, 
        error: "You are not connected to this room."
    };

    if (room.gameState.gamePhase !== GAME_PHASES.PLAYING) return {
        success: false,
        error: `Cannot play card when in phase: ${room.gameState.gamePhase}`
    }

    if (player.index !== room.gameState.activePlayerIndex) {
        return {
            success: false,
            error: "It is not your turn to play a card.",
        };
    }

    const playerHand = room.gameState.hands[player.id];

    if (!playerHand) return {
        success: false,
        error: "Error getting player hand."
    }

    const playerCard = playerHand.find((card) => card.id === cardId)

    if (!playerCard) return {
        success: false,
        error: "You do not have this card."
    }

    if (room.gameState.playingData.ledSuit === null) room.gameState.playingData.ledSuit = playerCard.suit;

    const playerHasLedSuit = playerHand.some((card) => card.suit === room.gameState.playingData.ledSuit);

    if (playerHasLedSuit && playerCard.suit !== room.gameState.playingData.ledSuit) return {
        success: false,
        error: "You must play the lead suit if you posses it."
    }

    // else we let them play it

    // first, remove from player's hand
    playerHand = playerHand.filter((card) => card.id !== cardId);

    // add to played cards on table
    room.gameState.playingData.cardsOnTable.push({
        ...playerCard,
        playerIndex: player.index,
    });

    if (room.gameState.playingData.cardsOnTable.length >= CARDS_PER_TRICK) {
        // determine trick winner
        const winningCard = trickWinner(room.gameState.playingData.cardsOnTable, room.gameState.playingData.ledSuit, room.gameState.contract.suit);

        const winningIndex = winningCard.playerIndex;
        const winningPlayer = room.roomState.players.find((player) => player.index === winningIndex);
        
        // update score
        room.gameState.currentHandTricks[winningPlayer.teamId] += 1;
        room.gameState.playerTricks[winningIndex] += 1;

        // clear cardsOnTable
        room.gameState.playingData.cardsOnTable = [];

        // advance to next round or if match over, do that
        // check if either team has reached target
        const bidMet = room.gameState.currentHandTricks[room.gameState.contract.teamId] >= room.gameState.contract.tricks;

        const otherTeamId =
            room.gameState.contract.teamId === TEAM_IDS.ONE
                ? TEAM_IDS.TWO
                : TEAM_IDS.ONE;
        const bidImpossible = room.gameState.currentHandTricks[otherTeamId] >= ((TRICKS_PER_ROUND + 1) - room.gameState.contract.tricks);

        if (bidMet) {

        }
        if (bidImpossible) {

        }
    }
    
    return {
        success: true,
        roomCode: normalizedRoomCode
    }
}

