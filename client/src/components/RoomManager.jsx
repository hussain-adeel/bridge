import LoadingScreen from "./LoadingScreen";
import BridgeGameBoard from "./BridgeGameBoard";
import Lobby from "./Lobby";
import { ROOM_STATUSES } from "../../../shared/gameConstants.js";
import { useNavigate, useParams } from "react-router-dom";
import { useRoomGameState } from "../hooks/useRoomGameState.js";

export default function RoomManager() {
    const { code: roomCode } = useParams()

    const {
        roomState,
        gameState,
        loading,
        roomError
    } = useRoomGameState(roomCode);

    const navigate = useNavigate();

    const errorMessage = roomError instanceof Error ? roomError.message : roomError;

    const returnHome = () => {
        localStorage.removeItem("bridge_session");
        navigate("/home", { replace: true });
    };

    if (errorMessage) {
        return (
            <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-board-bg p-6">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-950/30 via-slate-950/65 to-slate-950" />
                <div className="pointer-events-none absolute -left-28 top-16 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />
                <div className="relative w-full max-w-md rounded-2xl border border-red-400/20 bg-slate-900 p-8 text-center shadow-2xl">
                    <span className="text-4xl text-red-300">!</span>
                    <h1 className="mt-3 text-3xl font-extrabold text-white">Unable to join room</h1>
                    <p className="mt-3 text-slate-300">{errorMessage}</p>
                    <button
                        onClick={returnHome}
                        className="mt-7 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 font-bold text-white hover:bg-slate-700"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingScreen />;

    if (!roomState) return <LoadingScreen />;

    if (roomState.status === ROOM_STATUSES.LOBBY) {
        return (
            <Lobby
                players={roomState.players}
                roomCode={roomState.roomCode}
                hostId={roomState.host}
                roundsToWin={roomState.roundsToWin}
            />
        );
    }

    if (!gameState) return <LoadingScreen />;

    return (
        <BridgeGameBoard
            gameState={gameState}
            players={roomState.players}
        />
    );
}
