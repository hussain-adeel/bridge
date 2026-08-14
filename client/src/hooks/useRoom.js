import { emitAsync, SOCKET_EVENTS } from "../utils/socket";
import { useNavigate } from "react-router-dom";

export function useRoom() {
    const navigate = useNavigate();

    const onCreateRoom = async () => {
        const response = await emitAsync(SOCKET_EVENTS.CREATE_ROOM, {});

        navigate(`/room/${response.roomCode}`);
        return true;
    };

    const onJoinRoom = async (roomCode) => {
        const response = await emitAsync(SOCKET_EVENTS.JOIN_ROOM, {roomCode});

        navigate(`/room/${response.roomCode}`);
        return true;
    };

    return {
        onCreateRoom,
        onJoinRoom,
    }
}
