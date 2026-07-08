import { useState } from "react";
import BridgeGameHeader from "./BridgeGameHeader";

export default function BridgeGameBoard({gameState, localUser}) {

    const myIndex = gameState.players.findIndex(p => p.id === localUser.id);

    return (
        <div className="relative w-screen h-screen bg-board-bg">
            <BridgeGameHeader gameState={gameState} localUser={localUser} myIndex={myIndex}></BridgeGameHeader>

        </div>
    )
}