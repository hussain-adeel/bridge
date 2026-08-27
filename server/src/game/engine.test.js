import { describe, expect, test } from "vitest";
import { createDeck, createInitialGameState, getNextBidderIndex, shuffleDeck, trickWinner } from "./engine.js";
import { RANKS, SUITS, TEAM_IDS } from "../../../shared/gameConstants.js";

describe("createDeck", () => {
    test("creates 52 unique cards", () => {
        const deck = createDeck();
        const ids = deck.map((card) => card.id);

        expect(deck).toHaveLength(52);
        expect(new Set(ids).size).toBe(52);
    });
});

describe("createInitialGameState", () => {
    test("starts with empty hands and reset scores", () => {
        const gameState = createInitialGameState();

        expect(gameState.matchId).toBeNull();
        expect(gameState.hands).toEqual({});
        expect(gameState.remainingDeck).toEqual([]);
        expect(gameState.playerTricks).toEqual({ 0: 0, 1: 0, 2: 0, 3: 0 });
        expect(gameState.currentHandTricks).toEqual({ [TEAM_IDS.ONE]: 0, [TEAM_IDS.TWO]: 0 });
        expect(gameState.matchScore).toEqual({ [TEAM_IDS.ONE]: 0, [TEAM_IDS.TWO]: 0 });
    });
});

describe("shuffleDeck", () => {
    test("returns all 52 original cards without changing the original deck", () => {
        const deck = createDeck();
        const shuffledDeck = shuffleDeck(deck);

        expect(shuffledDeck).toHaveLength(52);
        expect(new Set(shuffledDeck.map((card) => card.id))).toEqual(new Set(deck.map((card) => card.id)));
        expect(deck).toEqual(createDeck());
    });
});

describe("trickWinner", () => {
    test("selects the highest card in the led suit when no trump is played", () => {
        const cards = [
            {
                id: `${RANKS[3]}-${SUITS[0]}`,
                rank: RANKS[3],
                suit: SUITS[0],
                playerIndex: 0
            },
            {
                id: `${RANKS[5]}-${SUITS[0]}`,
                rank: RANKS[5],
                suit: SUITS[0],
                playerIndex: 1
            },
            {
                id: `${RANKS[8]}-${SUITS[0]}`,
                rank: RANKS[8],
                suit: SUITS[0],
                playerIndex: 2
            },
            {
                id: `${RANKS[11]}-${SUITS[0]}`,
                rank: RANKS[11],
                suit: SUITS[0],
                playerIndex: 3
            },
        ]

        const ledSuit = SUITS[0];
        const trumpSuit = SUITS[2];

        const winningCard = trickWinner(cards, ledSuit, trumpSuit);

        expect(winningCard.playerIndex).toBe(3);
    });
    test("selects a trump card over a led-suit card", () => {
        const cards = [
            {
                id: `${RANKS[3]}-${SUITS[0]}`,
                rank: RANKS[3],
                suit: SUITS[0],
                playerIndex: 0
            },
            {
                id: `${RANKS[5]}-${SUITS[2]}`,
                rank: RANKS[5],
                suit: SUITS[2],
                playerIndex: 1
            },
            {
                id: `${RANKS[8]}-${SUITS[0]}`,
                rank: RANKS[8],
                suit: SUITS[0],
                playerIndex: 2
            },
            {
                id: `${RANKS[11]}-${SUITS[0]}`,
                rank: RANKS[11],
                suit: SUITS[0],
                playerIndex: 3
            },
        ]

        const ledSuit = SUITS[0];
        const trumpSuit = SUITS[2];

        const winningCard = trickWinner(cards, ledSuit, trumpSuit);

        expect(winningCard.playerIndex).toBe(1);
    });
    test("selects the highest trump card when multiple trumps are played", () => {
        const cards = [
            {
                id: `${RANKS[3]}-${SUITS[0]}`,
                rank: RANKS[3],
                suit: SUITS[0],
                playerIndex: 0
            },
            {
                id: `${RANKS[5]}-${SUITS[2]}`,
                rank: RANKS[5],
                suit: SUITS[2],
                playerIndex: 1
            },
            {
                id: `${RANKS[8]}-${SUITS[2]}`,
                rank: RANKS[8],
                suit: SUITS[2],
                playerIndex: 2
            },
            {
                id: `${RANKS[11]}-${SUITS[0]}`,
                rank: RANKS[11],
                suit: SUITS[0],
                playerIndex: 3
            },
        ]

        const ledSuit = SUITS[0];
        const trumpSuit = SUITS[2];

        const winningCard = trickWinner(cards, ledSuit, trumpSuit);

        expect(winningCard.playerIndex).toBe(2);
    });
    test("ignores off-suit non-trump discards", () => {
        const cards = [
            {
                id: `${RANKS[3]}-${SUITS[0]}`,
                rank: RANKS[3],
                suit: SUITS[0],
                playerIndex: 0
            },
            {
                id: `${RANKS[5]}-${SUITS[0]}`,
                rank: RANKS[5],
                suit: SUITS[0],
                playerIndex: 1
            },
            {
                id: `${RANKS[8]}-${SUITS[3]}`,
                rank: RANKS[8],
                suit: SUITS[3],
                playerIndex: 2
            },
            {
                id: `${RANKS[11]}-${SUITS[1]}`,
                rank: RANKS[11],
                suit: SUITS[1],
                playerIndex: 3
            },
        ]

        const ledSuit = SUITS[0];
        const trumpSuit = SUITS[2];

        const winningCard = trickWinner(cards, ledSuit, trumpSuit);

        expect(winningCard.playerIndex).toBe(1);
    });
})

describe("getNextBidderIndex", () => {
    const players = [
        { id: "player-0", index: 0, teamId: TEAM_IDS.ONE },
        { id: "player-1", index: 1, teamId: TEAM_IDS.TWO },
        { id: "player-2", index: 2, teamId: TEAM_IDS.ONE },
        { id: "player-3", index: 3, teamId: TEAM_IDS.TWO },
    ];

    test("selects the round winner with more tricks", () => {
        const nextBidderIndex = getNextBidderIndex(
            players,
            { 0: 3, 1: 2, 2: 5, 3: 1 },
            TEAM_IDS.ONE,
            0
        );

        expect(nextBidderIndex).toBe(2);
    });

    test("uses the last trick winner when round-winning partners tie", () => {
        const nextBidderIndex = getNextBidderIndex(
            players,
            { 0: 4, 1: 1, 2: 4, 3: 2 },
            TEAM_IDS.ONE,
            2
        );

        expect(nextBidderIndex).toBe(2);
    });
});
