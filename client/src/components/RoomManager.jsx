import LoadingScreen from "./LoadingScreen";
import BridgeGameBoard from "./BridgeGameBoard";
import Lobby from "./Lobby";
import { ROOM_STATUSES } from "../../../shared/gameConstants.js";
import { useNavigate } from "react-router-dom";

export default function RoomManager({
    roomState,
    gameState,
    roomError = null,
}) {
    const navigate = useNavigate();
    const onRoundsChange = (roundsToWin) => console.log("Match rounds changed:", roundsToWin);
    const onToggleReady = () => console.log("Ready toggled");
    const onStartMatch = () => console.log("Match started");
    const onBid = (bid) => console.log("Bid placed:", bid);
    const onPass = () => console.log("Passed");
    const onPlayCard = (cardId) => console.log("Card played:", cardId);
    const onReturnToLobby = () => console.log("Return to lobby");
    const errorMessage = roomError instanceof Error ? roomError.message : roomError;

    const returnHome = () => {
        localStorage.removeItem("bridge_session");
        navigate("/home", { replace: true });
    };

    if (errorMessage) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-board-bg p-6">
                <div className="w-full max-w-md rounded-2xl border border-red-400/20 bg-slate-900 p-8 text-center shadow-2xl">
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

    if (!roomState) return <LoadingScreen />;

    if (roomState.status === ROOM_STATUSES.LOBBY) {
        return (
            <Lobby
                players={roomState.players}
                roomCode={roomState.roomCode}
                hostId={roomState.host}
                roundsToWin={roomState.roundsToWin}
                onRoundsChange={onRoundsChange}
                onToggleReady={onToggleReady}
                onStartMatch={onStartMatch}
            />
        );
    }

    if (!gameState) return <LoadingScreen />;

    return (
        <BridgeGameBoard
            gameState={gameState}
            players={roomState.players}
            onBid={onBid}
            onPass={onPass}
            onPlayCard={onPlayCard}
            onReturnToLobby={onReturnToLobby}
        />
    );
}
