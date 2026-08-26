import {
    AUCTION_NUMBERS,
    BID_VALUES,
    CARDS_PER_PLAYER,
    CARDS_PER_TRICK,
    DEAL_CARD_COUNTS,
    DEAL_NUMBERS,
    DEFAULT_ROUNDS_TO_WIN,
    FIRST_TRICK_NUMBER,
    GAME_PHASES,
    MATCH_END_DURATION_MS,
    MAX_PLAYERS,
    ROUND_END_DURATION_MS,
    SUITS,
    TEAM_IDS,
    TRICK_RESULT_DURATION_MS,
    TRICKS_PER_ROUND,
    ROOM_STATUSES,
    GAME_LOG_EVENTS,
} from "../../../shared/gameConstants.js";
import { createDeck, shuffleDeck, trickWinner, createInitialGameState, getNextBidderIndex } from "../game/engine.js";
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
    };

    room.gameState.gameLog.push({
        id: crypto.randomUUID(),
        type: GAME_LOG_EVENTS.BID,
        playerIndex: player.index,
        teamId: player.teamId,
        tricks,
        suit
    });

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

    room.gameState.gameLog.push({
        id: crypto.randomUUID(),
        type: GAME_LOG_EVENTS.PASS,
        playerIndex: player.index,
        teamId: player.teamId
    });

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

    if (room.gameState.playingData.trickEndsAt) return {
        success: false,
        error: "The trick is still resolving."
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

    const ledSuit = room.gameState.playingData.ledSuit;
    const trumpSuit = room.gameState.contract.suit;
    const isLeadingTrick = ledSuit === null;
    const isTrump = playerCard.suit === trumpSuit;
    const hasNonTrumpCard = playerHand.some((card) => card.suit !== trumpSuit);

    if (
        isLeadingTrick &&
        isTrump &&
        !room.gameState.playingData.trumpBroken &&
        hasNonTrumpCard
    ) {
        return {
            success: false,
            error: "Trump cannot be led until it has been broken.",
        };
    }

    const playerHasLedSuit = !isLeadingTrick && playerHand.some((card) => card.suit === ledSuit);

    if (playerHasLedSuit && playerCard.suit !== ledSuit) return {
        success: false,
        error: "You must play the lead suit if you posses it."
    }

    if (isLeadingTrick) room.gameState.playingData.ledSuit = playerCard.suit;

    if (!isLeadingTrick && isTrump && ledSuit !== trumpSuit) {
        room.gameState.playingData.trumpBroken = true;
    }

    room.gameState.hands[player.id] = playerHand.filter((card) => card.id !== cardId);

    // add to played cards on table
    room.gameState.playingData.cardsOnTable.push({
        ...playerCard,
        playerIndex: player.index,
    });

    room.gameState.gameLog.push({
        id: crypto.randomUUID(),
        type: GAME_LOG_EVENTS.CARD_PLAYED,
        playerIndex: player.index,
        teamId: player.teamId,
        suit: playerCard.suit,
        rank: playerCard.rank
    });

    if (room.gameState.playingData.cardsOnTable.length >= CARDS_PER_TRICK) {
        const winningCard = trickWinner(room.gameState.playingData.cardsOnTable, room.gameState.playingData.ledSuit, room.gameState.contract.suit);
        room.gameState.playingData.trickWinnerIndex = winningCard.playerIndex;
        room.gameState.playingData.trickEndsAt = Date.now() + TRICK_RESULT_DURATION_MS;

        saveRoom(normalizedRoomCode, room);
        return {
            success: true,
            roomCode: normalizedRoomCode,
            shouldResolveTrick: true,
        }
    }

    // just advance activePlayerIndex
    room.gameState.activePlayerIndex = (player.index + 1) % MAX_PLAYERS;
    saveRoom(normalizedRoomCode, room);
    return {
        success: true,
        roomCode: normalizedRoomCode
    }
}

export function resolveTrick({ roomCode }) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;
    const { gameState } = room;
    const winningIndex = gameState.playingData.trickWinnerIndex;

    if (
        gameState.gamePhase !== GAME_PHASES.PLAYING ||
        !Number.isInteger(winningIndex) ||
        gameState.playingData.cardsOnTable.length !== CARDS_PER_TRICK
    ) {
        return { success: false, error: "No trick is ready to resolve." };
    }

    const winningPlayer = room.roomState.players.find((player) => player.index === winningIndex);
    if (!winningPlayer) return { success: false, error: "Unable to find the trick winner." };

    gameState.currentHandTricks[winningPlayer.teamId] += 1;
    gameState.playerTricks[winningIndex] += 1;
    gameState.lastTrickWinnerIndex = winningIndex;
    gameState.activePlayerIndex = winningIndex;
    gameState.gameLog.push({
        id: crypto.randomUUID(),
        type: GAME_LOG_EVENTS.TRICK_WON,
        playerIndex: winningPlayer.index,
        teamId: winningPlayer.teamId,
    });

    gameState.playingData.cardsOnTable = [];
    gameState.playingData.ledSuit = null;
    gameState.playingData.trickWinnerIndex = null;
    gameState.playingData.trickEndsAt = null;

    const otherTeamId =
        gameState.contract.teamId === TEAM_IDS.ONE
            ? TEAM_IDS.TWO
            : TEAM_IDS.ONE;

    const roundOver =
        gameState.currentHandTricks[gameState.contract.teamId] >= gameState.contract.tricks ||
        gameState.currentHandTricks[otherTeamId] >= ((TRICKS_PER_ROUND + 1) - gameState.contract.tricks);

    if (roundOver) {
        gameState.matchScore[winningPlayer.teamId] += 1;

        const matchWon =
            gameState.matchScore[winningPlayer.teamId] >= room.roomState.roundsToWin;

        gameState.gamePhase = matchWon
            ? GAME_PHASES.MATCH_END
            : GAME_PHASES.ROUND_END;
        gameState.trickNumber = 0;
        gameState.roundWinnerTeamId = winningPlayer.teamId;
        gameState.matchWinnerTeamId = matchWon ? winningPlayer.teamId : null;
        gameState.roundEndsAt = Date.now() + ROUND_END_DURATION_MS;
        gameState.matchEndsAt = matchWon ? Date.now() + MATCH_END_DURATION_MS : null;
        gameState.gameLog.push({
            id: crypto.randomUUID(),
            type: GAME_LOG_EVENTS.ROUND_WON,
            playerIndex: winningIndex,
            teamId: winningPlayer.teamId,
        });

        if (matchWon) {
            gameState.gameLog.push({
                id: crypto.randomUUID(),
                type: GAME_LOG_EVENTS.MATCH_WON,
                playerIndex: winningIndex,
                teamId: winningPlayer.teamId,
            });
        }

        saveRoom(normalizedRoomCode, room);
        return {
            success: true,
            roomCode: normalizedRoomCode,
            shouldStartNextRound: !matchWon,
            shouldReturnToLobby: matchWon,
        };
    }

    gameState.trickNumber += 1;
    saveRoom(normalizedRoomCode, room);

    return {
        success: true,
        roomCode: normalizedRoomCode,
    };
}

export function startNextRound({ roomCode }) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;

    if (room.gameState.gamePhase !== GAME_PHASES.ROUND_END) {
        return { 
            success: false, 
            error: "Round is not ready to advance." 
        };
    }

    const gameLog = room.gameState.gameLog;
    const nextRoundNumber = room.gameState.roundNumber + 1;
    const matchScore = room.gameState.matchScore;
    const activePlayerIndex = getNextBidderIndex(
        room.roomState.players,
        room.gameState.playerTricks,
        room.gameState.roundWinnerTeamId,
        room.gameState.lastTrickWinnerIndex
    )

    room.gameState = createInitialGameState();
    room.gameState.roundNumber = nextRoundNumber;
    room.gameState.matchScore = matchScore;
    room.gameState.gamePhase = GAME_PHASES.DEALING;
    room.gameState.dealNumber = DEAL_NUMBERS.FIRST;
    room.gameState.activePlayerIndex = activePlayerIndex;
    room.gameState.gameLog = gameLog;

    const dealResult = dealCurrentPacket(
        room.gameState,
        room.roomState.players
    );

    if (!dealResult.success) return dealResult;

    room.gameState.gameLog.push({
            id: crypto.randomUUID(),
            type: GAME_LOG_EVENTS.ROUND_STARTED,
            roundNumber: room.gameState.roundNumber,
        });

    saveRoom(normalizedRoomCode, room);

    return {
        success: true,
        roomCode: normalizedRoomCode
    }
}

export function returnRoomToLobby({ roomCode }) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;

    if (room.gameState.gamePhase !== GAME_PHASES.MATCH_END) {
        return { 
            success: false, 
            error: "Match is not ready to end." 
        };
    }

    // db save stats goes here later

    room.gameState = createInitialGameState();
    room.roomState.status = ROOM_STATUSES.LOBBY;
    room.roomState.roundsToWin = DEFAULT_ROUNDS_TO_WIN;
    room.roomState.players.forEach(player => {
        player.isReady = false;
    });

    saveRoom(normalizedRoomCode, room);
    return {
        success: true,
        roomCode: normalizedRoomCode
    }


}

