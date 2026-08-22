export const GAME_PHASES = {
    DEALING: "DEALING",
    BIDDING: "BIDDING",
    PLAYING: "PLAYING",
    ROUND_END: "ROUND_END",
    MATCH_END: "MATCH_END",
};

export const ROOM_STATUSES = {
    LOBBY: "LOBBY",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETE: "COMPLETE",
};

export const SOCKET_EVENTS = {
    CREATE_ROOM: "createRoom",
    JOIN_ROOM: "joinRoom",
    READY: "ready",
    CHANGE_ROUNDS: "changeRounds",
    START_MATCH: "startMatch",
    LEAVE_ROOM: "leaveRoom",

    BID: "bid",
    BID_PASS: "bidPass",
    PLAY_CARD: "playCard",

    RETURN_TO_LOBBY: "returnToLobby",
    RECONNECT_TO_ROOM: "reconnectToRoom",

    ROOM_STATE_UPDATED: "roomStateUpdated",
    GET_ROOM_STATE: "getRoomState"
};

export const AUCTION_NUMBERS = {
    FIRST: 1,
    SECOND: 2,
};

export const DEAL_NUMBERS = {
    FIRST: 1,
    SECOND: 2,
    FINAL: 3,
};

export const DEAL_CARD_COUNTS = {
    [DEAL_NUMBERS.FIRST]: 5,
    [DEAL_NUMBERS.SECOND]: 4,
    [DEAL_NUMBERS.FINAL]: 4,
};

export const MAX_PLAYERS = 4;
export const CARDS_PER_PLAYER = 13;
export const TRICKS_PER_ROUND = 13;
export const MATCH_ROUND_OPTIONS = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 50, 100];
export const DEFAULT_ROUNDS_TO_WIN = MATCH_ROUND_OPTIONS[0];
export const FIRST_TRICK_NUMBER = 1;
export const CARDS_PER_TRICK = 4;
export const ROUND_END_DURATION_MS = 7000;
export const MATCH_END_DURATION_MS = 7000;

export const TEAM_IDS = {
    ONE: "team_1",
    TWO: "team_2",
};

export const ROOM_CODE_LENGTH = 4;
export const ROOM_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const SUITS = ["Spades", "Hearts", "Diamonds", "Clubs"];
export const SUIT_SYMBOLS = {
    Spades: "\u2660",
    Hearts: "\u2665",
    Diamonds: "\u2666",
    Clubs: "\u2663",
};
export const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

export const MINIMUM_BID = 6;
export const MAXIMUM_BID = 12;
export const BID_VALUES = Array.from({ length: MAXIMUM_BID - MINIMUM_BID + 1 }, (_, index) => MINIMUM_BID + index);
