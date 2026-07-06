import { useState } from "react";
import BridgeGameHeader from "./BridgeGameHeader";

export default function BridgeGameBoard({gameState}) {

    gameState.teamScore = 4;
    gameState.enemyScore = 4;

    return (
        <div className="relative w-screen h-screen bg-[#0f172a]">
            <BridgeGameHeader gameState={gameState}></BridgeGameHeader>

        </div>
    )
}