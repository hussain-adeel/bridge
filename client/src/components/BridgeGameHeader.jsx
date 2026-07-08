import { useState } from "react";

export default function BridgeGameHeader({gameState, localUser, myIndex}) {

    const teamId = gameState.players[myIndex]?.teamId;
    const enemyTeamId = gameState.players[(myIndex + 1) % 4]?.teamId;

    const tricksCalled = gameState.contract?.tricks;
    const suitCalled = gameState.contract?.suit;

    const teamScore = gameState.currentHandTricks[teamId];
    const enemyScore = gameState.currentHandTricks[enemyTeamId];

    const isMyTurn = gameState?.activePlayerIndex == myIndex;
    const isMyTeamBid = teamId == gameState.contract?.teamId;

    const activePlayer = gameState?.players[gameState?.activePlayerIndex];
    const activeUsername = activePlayer ? activePlayer?.username : "Waiting...";

    const turnText = isMyTurn ? "Your Turn!" : `${activeUsername}'s Turn`;
    const turnTextColor = isMyTurn ? "text-text-main" : "text-white";

    const handsNeededToWin = () => {
        let needToWin = 0;

        if (isMyTeamBid) needToWin = tricksCalled;
        else needToWin = 14 - tricksCalled;


        return needToWin - teamScore;
    };

    const handsLeft = handsNeededToWin();

    const scoreText = `${handsLeft} Hands to Win`
    const bidCallText = isMyTeamBid ? "Your Team Called" : "Enemy Team Called";

    return (
        <header className="absolute top-6 w-full h-16 px-2 pt-10 flex justify-between items-center z-10 select-none">
            <div className="flex-1 text-left">
                <div className="flex-col text-center">
                    <h2 className="text-[15px] font-extrabold tracking-tighter drop-shadow-md text-white">PLAYING:</h2>
                    <h1 className="text-text-main text-[40px] font-extrabold tracking-tighter drop-shadow-md">
                        BRIDGE
                    </h1>
                    <h2 className={`text-[15px] font-extrabold tracking-tighter drop-shadow-md ${turnTextColor}`}>
                        {turnText}
                    </h2>
                </div>
            </div>
            <div className="flex-1 text-center">
                <div className="flex-col text-center">
                    <h2 className="text-[15px] font-extrabold tracking-tighter drop-shadow-md text-white">SCORE:</h2>
                    <h1 className="text-white text-[40px] font-extrabold tracking-tighter drop-shadow-md">
                        <span className="text-friendly">{teamScore}</span> <span className="text-text-main">-</span> <span className="text-enemy">{enemyScore}</span>
                    </h1>
                    <h2 className="text-[15px] font-extrabold tracking-tighter drop-shadow-md text-white">{scoreText}</h2>
                </div>
            </div>
            <div className="flex-1 text-right">
                <div className="flex-col text-center">
                    <h2 className="text-[15px] font-extrabold tracking-tighter drop-shadow-md text-white">BID:</h2>
                    <h1 className="text-[#D3AF37] text-[40px] font-extrabold tracking-tighter drop-shadow-md"><span>{gameState.contract?.tricks}</span> <span className="uppercase">{gameState.contract?.suit}</span></h1>
                    <h2 className="text-[15px] font-extrabold tracking-tighter drop-shadow-md text-white">{bidCallText}</h2>
                </div>
                
            </div>
        </header>
    )
}