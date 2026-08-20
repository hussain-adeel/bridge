import { emitAsync, SOCKET_EVENTS } from "../utils/socket";

export function useGameActions(roomCode) {

    const onToggleReady = async () => {
        await emitAsync(
            SOCKET_EVENTS.READY, 
            { roomCode }
        );
    };

    const onRoundsChange = async (roundsToWin) => {
        await emitAsync(
            SOCKET_EVENTS.CHANGE_ROUNDS, 
            { roomCode, roundsToWin }
        );
    };

    const onStartMatch = async () => {
        await emitAsync(
            SOCKET_EVENTS.START_MATCH,
            { roomCode }
        );
    };

    const onBid = async ({tricks, suit}) => {
        await emitAsync(
            SOCKET_EVENTS.BID,
            { roomCode, tricks, suit }
        );
    };

    const onPass = async () => {
        await emitAsync(
            SOCKET_EVENTS.BID_PASS,
            { roomCode }
        );
    };

    const onPlayCard = async (cardId) => {
        await emitAsync(
            SOCKET_EVENTS.PLAY_CARD,
            { roomCode, cardId }
        );
    };

    const onReturnToLobby = async () => {
        await emitAsync(
            SOCKET_EVENTS.RETURN_TO_LOBBY,
            { roomCode }
        );
    };

    return {
        onToggleReady,
        onRoundsChange,
        onStartMatch,
        onBid,
        onPass,
        onPlayCard,
        onReturnToLobby
    }
}
