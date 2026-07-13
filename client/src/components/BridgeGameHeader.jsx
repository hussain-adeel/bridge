import { useState } from "react";
import bridge_logo from "../assets/bridge_logo.svg";

export default function BridgeGameHeader({gameState, localUser, myIndex}) {

    const suitSymbols = {
        'spades': '♠',
        'hearts': '♥',
        'clubs': '♣',
        'diamonds': '♦'
    }
    
    const teamId = gameState.players[myIndex]?.teamId;
    const enemyTeamId = gameState.players[(myIndex + 1) % 4]?.teamId;

    const tricksCalled = gameState.contract?.tricks;
    const suitCalled = gameState.contract?.suit;

    const suitSymbol = suitSymbols[suitCalled.toLowerCase(suitCalled)];

    const teamScore = gameState?.currentHandTricks[teamId];
    const enemyScore = gameState?.currentHandTricks[enemyTeamId];

    const isMyTurn = gameState?.activePlayerIndex == myIndex;
    const isMyTeamBid = teamId == gameState.contract?.teamId;

    const headerVisibility = gameState.gamePhase === 'BIDDING' || gameState.gamePhase === 'DEALING'
        ? 'opacity-0 pointer-events-none' // Fades out and ignores clicks
        : 'opacity-100';                  // Fully visible

    // const activePlayer = gameState?.players[gameState?.activePlayerIndex];
    // const activeUsername = activePlayer ? activePlayer?.username : "Waiting...";

    // const turnText = isMyTurn ? "Your Turn!" : `${activeUsername}'s Turn`;
    // const turnTextColor = isMyTurn ? "text-text-main" : "text-white";

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
        <header className="w-full flex justify-center items-center pt-8 pb-6 xl:pb-0 px-8 xl:px-24">
            <div className="flex-1 text-left max-[400px]:text-center">
                <div className={`flex-col, ${headerVisibility}`}>
                    <h2 className="text-[20px] lg:text-[30px] font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        SCORE:
                    </h2>
                    <h1 className="text-white text-5xl lg:text-[60px] font-extrabold tracking-tighter drop-shadow-md whitespace-nowrap">
                        <span className="text-friendly">{teamScore}</span> 
                        <span className="text-text-main mx-2">-</span> 
                        <span className="text-enemy">{enemyScore}</span>
                    </h1>
                    <h2 className="text-[20px] lg:text-[30px] max-[400px]:hidden font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        {scoreText}
                    </h2>
                </div>
            </div>

            <div className="flex max-[700px]:hidden flex-1 justify-center">
                <img src={bridge_logo} alt="Bridge Game Logo" className="h-20 w-auto object-contain select-none drop-shadow-[0_0_8px_rgba(211,175,55,0.8)]" />
            </div>
            
            <div className="flex-1 text-right max-[400px]:text-center">
                <div className={`flex-col, ${headerVisibility}`}>
                    <h2 className="text-[20px] lg:text-[30px] font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        BID:
                    </h2>
                    <h1 className="text-[#D3AF37] text-5xl lg:text-[60px] font-extrabold tracking-tighter drop-shadow-md whitespace-nowrap">
                        <span>{tricksCalled}</span> <span className="uppercase ml-1">{suitSymbol}</span>
                    </h1>
                    <h2 className="text-[20px] lg:text-[30px] font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        {bidCallText}
                    </h2>
                </div>
            </div>

        </header>
    )
}