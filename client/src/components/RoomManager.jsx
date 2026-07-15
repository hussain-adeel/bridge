import { useState } from "react";
import LoadingScreen from "./LoadingScreen"
import BridgeGameBoard from "./BridgeGameBoard";
import Lobby from "./Lobby"

export default function RoomManager({gameState, localUser}) {
    if (!gameState) return <LoadingScreen />;

    
}