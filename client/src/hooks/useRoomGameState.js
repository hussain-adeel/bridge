import { useCallback, useState, useEffect } from "react";
import { useSocketEvent } from "./useSocketEvent";
import { emitAsync, SOCKET_EVENTS } from "../utils/socket";


export function useRoomGameState(roomCode) {
    const [roomState, setRoomState] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [roomError, setRoomError] = useState("");

    const loadState = useCallback(async () => {
        setLoading(true);
        setRoomError("");

        try {
            const response = await emitAsync(
                SOCKET_EVENTS.GET_ROOM_STATE, 
                { roomCode }
            );

            if (response.roomState?.roomCode !== roomCode) return;

            setRoomState(response.roomState);
            setGameState(response.gameState);
        }
        catch (error) { setRoomError(error.message); }
        finally { setLoading(false); } 
    }, [roomCode]);

    useEffect(() => {
        loadState();
    }, [loadState]);

    useSocketEvent(SOCKET_EVENTS.ROOM_STATE_UPDATED, ({ roomState, gameState }) => {
        if (roomState?.roomCode !== roomCode) return;
        setRoomError("")

        setRoomState(roomState);
        setGameState(gameState);
        setLoading(false);
    });

    return {
        roomState,
        gameState,
        loading,
        roomError,
        loadState
    }
}

