import { emitAsync, SOCKET_EVENTS } from "../utils/socket";
import { useNavigate } from "react-router-dom";

export function useRoom() {
    const navigate = useNavigate();

    const onCreateRoom = async () => {
        const response = await emitAsync(SOCKET_EVENTS.CREATE_ROOM, {});

        localStorage.setItem(
            "bridge_session",
            JSON.stringify({ roomCode: response.roomCode })
        )
        navigate(`/room/${response.roomCode}`);
        return true;
    };

    const onJoinRoom = async (roomCode) => {
        const response = await emitAsync(SOCKET_EVENTS.JOIN_ROOM, {roomCode});

        localStorage.setItem(
            "bridge_session",
            JSON.stringify({ roomCode: response.roomCode })
        )
        navigate(`/room/${response.roomCode}`);
        return true;
    };

    const onLeaveRoom = async (roomCode) => {
        await emitAsync(SOCKET_EVENTS.LEAVE_ROOM, { roomCode });
        localStorage.removeItem("bridge_session");
        navigate("/home");
    };

    return {
        onCreateRoom,
        onJoinRoom,
        onLeaveRoom
    }
}
