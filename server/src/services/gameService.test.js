import { afterEach, describe, expect, test, vi } from "vitest";
import { createDeck, createInitialGameState } from "../game/engine.js";
import { AUCTION_NUMBERS, DEAL_NUMBERS, GAME_PHASES, TEAM_IDS } from "../../../shared/gameConstants.js";
import { dealCurrentPacket, playCard } from "./gameService.js";
import { saveRoom, deleteRoom } from "../game/state.js";

vi.mock("./statsService.js", () => ({
    completeMatchRecord: vi.fn(),
    recordRoundStats: vi.fn(),
}));

describe("dealCurrentPacket", () => {
    test("deals the correct amount of cards", () => {
        let gameState = createInitialGameState();
        gameState.dealNumber = DEAL_NUMBERS.FIRST;
        gameState.gamePhase = GAME_PHASES.DEALING;

        const players = [
            {id: "0", username: "testPlayer0", socketId: "socketId0", isReady: true, index: 0, teamId: TEAM_IDS.ONE, isConnected: true},
            {id: "1", username: "testPlayer1", socketId: "socketId1", isReady: true, index: 1, teamId: TEAM_IDS.TWO, isConnected: true},
            {id: "2", username: "testPlayer2", socketId: "socketId2", isReady: true, index: 2, teamId: TEAM_IDS.ONE, isConnected: true},
            {id: "3", username: "testPlayer3", socketId: "socketId3", isReady: true, index: 3, teamId: TEAM_IDS.TWO, isConnected: true}
        ]

        const result = dealCurrentPacket(gameState, players);

        expect(result.success).toBe(true);
        expect(gameState.gamePhase).toBe(GAME_PHASES.BIDDING);
        expect(gameState.remainingDeck.length).toBe(32);

        for (const player of players) {
            expect(gameState.hands[player.id]).toHaveLength(5);
        }
    })
})

const roomCode = "TEST";

const roomPlayers = [
    { id: "player-0", index: 0, teamId: TEAM_IDS.ONE },
    { id: "player-1", index: 1, teamId: TEAM_IDS.TWO },
    { id: "player-2", index: 2, teamId: TEAM_IDS.ONE },
    { id: "player-3", index: 3, teamId: TEAM_IDS.TWO },
];

function savePlayingRoom({
    activePlayerIndex = 0,
    ledSuit = null,
    trumpSuit = "Spades",
    trumpBroken = false,
    trickEndsAt = null,
    hands = {},
}) {
    const gameState = createInitialGameState();
    gameState.gamePhase = GAME_PHASES.PLAYING;
    gameState.activePlayerIndex = activePlayerIndex;
    gameState.contract.suit = trumpSuit;
    gameState.playingData.ledSuit = ledSuit;
    gameState.playingData.trumpBroken = trumpBroken;
    gameState.playingData.trickEndsAt = trickEndsAt;
    gameState.hands = hands;

    saveRoom(roomCode, {
        roomState: {
            roomCode,
            players: roomPlayers,
        },
        gameState,
    });

    return gameState;
}

afterEach(() => {
    deleteRoom(roomCode);
})

describe("later deal packets", () => {
    test("deals 4 additional cards to each player during the second deal", () => {
        const gameState = createInitialGameState();
        gameState.dealNumber = DEAL_NUMBERS.SECOND;
        gameState.gamePhase = GAME_PHASES.DEALING;
        gameState.remainingDeck = createDeck().slice(0, 32);
        gameState.hands = Object.fromEntries(roomPlayers.map((player) => [player.id, createDeck().slice(0, 5)]));

        const result = dealCurrentPacket(gameState, roomPlayers);

        expect(result.success).toBe(true);
        expect(gameState.gamePhase).toBe(GAME_PHASES.BIDDING);
        expect(gameState.auctionNumber).toBe(AUCTION_NUMBERS.SECOND);
        expect(gameState.remainingDeck).toHaveLength(16);

        for (const player of roomPlayers) {
            expect(gameState.hands[player.id]).toHaveLength(9);
        }
    });

    test("deals the final cards and starts play after a contract is set", () => {
        const gameState = createInitialGameState();
        gameState.dealNumber = DEAL_NUMBERS.FINAL;
        gameState.gamePhase = GAME_PHASES.DEALING;
        gameState.remainingDeck = createDeck().slice(0, 16);
        gameState.hands = Object.fromEntries(roomPlayers.map((player) => [player.id, createDeck().slice(0, 9)]));
        gameState.contract.declarerIndex = 2;

        const result = dealCurrentPacket(gameState, roomPlayers);

        expect(result.success).toBe(true);
        expect(gameState.gamePhase).toBe(GAME_PHASES.PLAYING);
        expect(gameState.activePlayerIndex).toBe(2);
        expect(gameState.remainingDeck).toHaveLength(0);

        for (const player of roomPlayers) {
            expect(gameState.hands[player.id]).toHaveLength(13);
        }
    });

    test("rejects the final deal without a declarer", () => {
        const gameState = createInitialGameState();
        gameState.dealNumber = DEAL_NUMBERS.FINAL;
        gameState.gamePhase = GAME_PHASES.DEALING;
        gameState.remainingDeck = createDeck().slice(0, 16);

        const result = dealCurrentPacket(gameState, roomPlayers);

        expect(result.success).toBe(false);
        expect(result.error).toBe("A final contract is required before the final deal.");
        expect(gameState.remainingDeck).toHaveLength(16);
    });
});

describe("playCard", () => {
    test("rejects an off-suit card when the player has the led suit", () => {
        savePlayingRoom({
            activePlayerIndex: 1,
            ledSuit: "Hearts",
            hands: {
                "player-1": [
                    { id: "K-Hearts", rank: "K", suit: "Hearts" },
                    { id: "A-Clubs", rank: "A", suit: "Clubs" },
                ],
            },
        });

        const result = playCard({ userId: "player-1", roomCode, cardId: "A-Clubs" });

        expect(result.success).toBe(false);
        expect(result.error).toBe("You must play the lead suit if you posses it.");
    });

    test("rejects an out-of-turn player", () => {
        savePlayingRoom({
            activePlayerIndex: 0,
            hands: {
                "player-1": [{ id: "K-Hearts", rank: "K", suit: "Hearts" }],
            },
        });

        const result = playCard({ userId: "player-1", roomCode, cardId: "K-Hearts" });

        expect(result.success).toBe(false);
        expect(result.error).toBe("It is not your turn to play a card.");
    });

    test("rejects a card the player does not hold", () => {
        savePlayingRoom({
            hands: {
                "player-0": [{ id: "K-Hearts", rank: "K", suit: "Hearts" }],
            },
        });

        const result = playCard({ userId: "player-0", roomCode, cardId: "A-Spades" });

        expect(result.success).toBe(false);
        expect(result.error).toBe("You do not have this card.");
    });

    test("plays a legal led-suit card and advances the turn", () => {
        const gameState = savePlayingRoom({
            ledSuit: "Hearts",
            hands: {
                "player-0": [
                    { id: "K-Hearts", rank: "K", suit: "Hearts" },
                    { id: "A-Clubs", rank: "A", suit: "Clubs" },
                ],
            },
        });

        const result = playCard({ userId: "player-0", roomCode, cardId: "K-Hearts" });

        expect(result.success).toBe(true);
        expect(gameState.hands["player-0"]).toHaveLength(1);
        expect(gameState.playingData.cardsOnTable).toEqual([
            { id: "K-Hearts", rank: "K", suit: "Hearts", playerIndex: 0 },
        ]);
        expect(gameState.activePlayerIndex).toBe(1);
    });

    test("allows a void player to play trump and breaks trump", () => {
        const gameState = savePlayingRoom({
            ledSuit: "Hearts",
            trumpSuit: "Spades",
            hands: {
                "player-0": [
                    { id: "K-Spades", rank: "K", suit: "Spades" },
                    { id: "A-Clubs", rank: "A", suit: "Clubs" },
                ],
            },
        });

        const result = playCard({ userId: "player-0", roomCode, cardId: "K-Spades" });

        expect(result.success).toBe(true);
        expect(gameState.playingData.trumpBroken).toBe(true);
        expect(gameState.hands["player-0"]).toHaveLength(1);
    });

    test("rejects leading trump before it is broken when another suit is available", () => {
        savePlayingRoom({
            trumpSuit: "Spades",
            hands: {
                "player-0": [
                    { id: "K-Spades", rank: "K", suit: "Spades" },
                    { id: "A-Clubs", rank: "A", suit: "Clubs" },
                ],
            },
        });

        const result = playCard({ userId: "player-0", roomCode, cardId: "K-Spades" });

        expect(result.success).toBe(false);
        expect(result.error).toBe("Trump cannot be led until it has been broken.");
    });

    test("allows leading trump when the player only has trump cards", () => {
        const gameState = savePlayingRoom({
            trumpSuit: "Spades",
            hands: {
                "player-0": [
                    { id: "K-Spades", rank: "K", suit: "Spades" },
                    { id: "A-Spades", rank: "A", suit: "Spades" },
                ],
            },
        });

        const result = playCard({ userId: "player-0", roomCode, cardId: "K-Spades" });

        expect(result.success).toBe(true);
        expect(gameState.playingData.ledSuit).toBe("Spades");
        expect(gameState.hands["player-0"]).toHaveLength(1);
    });

    test("rejects cards while a trick is resolving", () => {
        savePlayingRoom({
            trickEndsAt: Date.now() + 3000,
            hands: {
                "player-0": [{ id: "K-Hearts", rank: "K", suit: "Hearts" }],
            },
        });

        const result = playCard({ userId: "player-0", roomCode, cardId: "K-Hearts" });

        expect(result.success).toBe(false);
        expect(result.error).toBe("The trick is still resolving.");
    });
});
