import LoadingScreen from "./LoadingScreen";
import BridgeGameBoard from "./BridgeGameBoard";
import Lobby from "./Lobby";
import { ROOM_STATUSES } from "../../../shared/gameConstants.js";

export default function RoomManager({
    roomState,
    gameState,
}) {
    const onRoundsChange = (roundsToWin) => console.log("Match rounds changed:", roundsToWin);
    const onToggleReady = () => console.log("Ready toggled");
    const onBid = (bid) => console.log("Bid placed:", bid);
    const onPass = () => console.log("Passed");
    const onPlayCard = (card) => console.log("Card played:", card);
    const onReturnToLobby = () => console.log("Return to lobby");

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
