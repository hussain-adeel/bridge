import { useState } from "react";
import LoadingScreen from "./LoadingScreen"
import BridgeGameBoard from "./BridgeGameBoard";
import Lobby from "./Lobby"
import { useParams } from "react-router-dom";

const { roomCode } = useParams();

export default function RoomManager({gameState, localUser}) {
    const safeGamePhase = gameState?.gamePhase ?? "Loading"


    if (!gameState || safeGamePhase === "Loading") return <LoadingScreen />;
    else if (safeGamePhase === "Lobby") 
        return (
            <Lobby 
                roomCode={roomCode}
            /> 
        )
    else {
        return (
            <BridgeGameBoard
                gameState={gameState}
            />
        )
    }
    
}