import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";

export function useRoom() {
    const navigate = useNavigate();

    const onCreateRoom = () => {
        socket.emit("createRoom", {}, (response) => {
            if (response.success) navigate(`/room/${response.roomCode}`);
            else console.error("Error:", response.error);
        });
    };

    const onJoinRoom = (roomCode) => {
        socket.emit("joinRoom", { roomCode }, (response) => {
            if (response.success) navigate(`/room/${response.roomCode}`);
            else console.error("Error:", response.error);
        });
    };

    return {
        onCreateRoom,
        onJoinRoom,
    }
}
