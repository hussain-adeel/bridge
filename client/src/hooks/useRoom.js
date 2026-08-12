import { socket, emitAsync } from "../utils/socket";
import { useNavigate } from "react-router-dom";

export function useRoom() {
    const navigate = useNavigate();

    const onCreateRoom = async () => {
        const response = await emitAsync("createRoom", {});

        navigate(`/room/${response.roomCode}`);
        return true;
    };

    const onJoinRoom = async (roomCode) => {
        const response = await emitAsync("joinRoom", {roomCode});

        navigate(`/room/${response.roomCode}`);
        return true;
    };

    return {
        onCreateRoom,
        onJoinRoom,
    }
}
