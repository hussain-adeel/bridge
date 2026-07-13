import { useState } from "react";
import bridge_logo from "../assets/bridge_logo.svg";

export default function BridgeGameHeader({gamePhase, isMyTeamBid, isMyTurn, tricksCalled, suitCalled, teamScore, enemyScore}) {
    const suitSymbols = {
        'spades': '♠',
        'hearts': '♥',
        'clubs': '♣',
        'diamonds': '♦'
    }

    const safeTricksCalled = tricksCalled ?? 0;
    const safeSuitCalled = suitCalled ?? "";

    const suitSymbol = suitSymbols[safeSuitCalled.toLowerCase(safeSuitCalled)];

    const safeTeamScore = teamScore ?? 0;
    const safeEnemyScore = enemyScore ?? 0;

    const safeIsMyTurn = isMyTeamBid ?? false;
    const safeIsMyTeamBid = isMyTeamBid ?? false;

    const safeGamePhase = gamePhase ?? "LOADING";
    const isBiddingPhase = safeGamePhase === "BIDDING" || safeGamePhase === "DEALING";

    const headerVisibility = safeGamePhase === 'BIDDING' || safeGamePhase === 'DEALING'
        ? 'opacity-0 pointer-events-none' // Fades out and ignores clicks
        : 'opacity-100';                  // Fully visible

    const handsNeededToWin = () => {
        let needToWin = 0;

        if (safeIsMyTeamBid) needToWin = safeTricksCalled;
        else needToWin = 14 - safeTricksCalled;


        return needToWin - safeTeamScore;
    };

    const handsLeft = handsNeededToWin();

    const scoreText = `${handsLeft} Hands to Win`
    const bidCallText = () => {
        if (tricksCalled == 0) return "No bid yet"
        else if (isMyTeamBid) return "Your team called"
        else return "Enemy team called"
    }

    return (
        <header className={`w-full flex justify-center items-center pt-8 pb-6 xl:pb-0 px-8 xl:px-24 select-none`}>
            <div className="flex-1 text-left max-[400px]:text-center">
                <div className={`flex-col, ${headerVisibility}`}>
                    <h2 className="text-[20px] lg:text-[30px] font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        SCORE:
                    </h2>
                    <h1 className="text-white text-5xl lg:text-[60px] font-extrabold tracking-tighter drop-shadow-md whitespace-nowrap">
                        <span className="text-friendly">{safeTeamScore}</span> 
                        <span className="text-text-main mx-2">-</span> 
                        <span className="text-enemy">{safeEnemyScore}</span>
                    </h1>
                    <h2 className="text-[20px] lg:text-[30px] max-[400px]:hidden font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        {scoreText}
                    </h2>
                </div>
            </div>
"
            <div className="flex flex-1 max-[700px]:hidden justify-center">
                <img src={bridge_logo} alt="Bridge Game Logo" className="h-20 w-auto object-contain select-none drop-shadow-[0_0_8px_rgba(211,175,55,0.8)]" />
            </div>
            
            <div className="flex-1 text-right max-[400px]:text-center">
                <div className={`flex-col`}>
                    <h2 className="text-[20px] lg:text-[30px] font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        BID:
                    </h2>
                    <h1 className="text-[#D3AF37] text-5xl lg:text-[60px] font-extrabold tracking-tighter drop-shadow-md whitespace-nowrap">
                        <span>{safeTricksCalled}</span> <span className="ml-1">{suitSymbol}</span>
                    </h1>
                    <h2 className="text-[20px] lg:text-[30px] font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        {bidCallText()}
                    </h2>
                </div>
            </div>

        </header>
    )
}