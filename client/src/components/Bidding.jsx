import { useState } from "react";
import { useParams } from "react-router-dom";
import { AUCTION_NUMBERS, BID_VALUES, GAME_PHASES, SUITS } from "../../../shared/gameConstants.js";
import { useGameActions } from "../hooks/useGameActions.js";

export default function Bidding({currSuit, currTricks, gamePhase, auctionNumber, isMyTurn}) {

    const { code: roomCode } = useParams();
    const { onBid, onPass } = useGameActions(roomCode);

    const [stagedBid, setStagedBid] = useState(null);
    const [confirmPass, setConfirmPass] = useState(false);

    const safeCurrSuit = currSuit ?? "";
    const safeCurrTricks = currTricks ?? 0;
    const safeGamePhase = gamePhase;
    const safeIsMyTurn = isMyTurn ?? false;

    const biddingPhase = auctionNumber === AUCTION_NUMBERS.SECOND ? 2 : 1;
    const titleText = safeGamePhase === GAME_PHASES.BIDDING ? "BIDDING" : "LOADING DATA...";

    return (

        <div
            className="z-100 w-full max-w-md flex flex-col mx-auto bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-600 gap-6 font-normal select-none"
        >

            <div className="text-center cursor-default">
                <span className="text-white font-extrabold text-3xl">{titleText}</span>
                <span className="mt-1 block text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Phase {biddingPhase} of 2</span>
                {safeIsMyTurn ? <span className="text-green-300 font-extrabold  text-l">Your Turn!</span> : <span className="text-red-300 font-extrabold font-sans text-l">Waiting For Others...</span>}
                
            </div>

            <div className="grid grid-cols-4 gap-4 text-center font-bold text-white">
                {SUITS.map((suit) => (

                    <div key={suit} className="flex flex-col gap-2">
                        <span className="cursor-default">{suit}</span>
                        {BID_VALUES.map((tricks) => {
                            const isDisabled = !safeIsMyTurn || tricks <= safeCurrTricks;
                            const isCurrentBid = tricks === safeCurrTricks && suit === safeCurrSuit;
                            const isUserSelected = stagedBid?.suit === suit && stagedBid?.tricks === tricks;
                            
                            return (
                                <button 
                                    key={`${suit}-${tricks}`}
                                    disabled={isDisabled}
                                    onClick={() => isUserSelected ? setStagedBid(null) : setStagedBid({ suit, tricks })}
                                    className={`
                                            min-h-11 touch-manipulation active:scale-95 py-2 rounded font-bold transition-all duration-150
                                            
                                            ${isCurrentBid 
                                                ? "bg-amber-400 text-black border border-amber-500 cursor-not-allowed" 
                                                : isUserSelected
                                                ? "bg-green-700 text-white border border-green-600"
                                                : !safeIsMyTurn
                                                ? "bg-slate-700 text-slate-500 border border-slate-700 opacity-60 cursor-default" 
                                                : "text-white border border-green-500 bg-slate-700 hover:bg-green-700 active:bg-green-600 cursor-pointer disabled:border-red-500 disabled:bg-slate-700 disabled:text-slate-600 disabled:cursor-not-allowed"}
                                        `}
                                >
                                        {tricks}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-slate-600 text-white">
                <button 
                    onClick={() => {
                        if (confirmPass) {
                            onPass();
                            setConfirmPass(false);
                            return;
                        }
                        setConfirmPass(true);
                    }}
                    className={
                        `py-1.5 rounded font-bold transition-all duration-200 cursor-pointer disabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60
                        ${confirmPass? "bg-green-700 hover:bg-green-500 border-green-600 hover:border-green-400" : "hover:bg-slate-600 bg-slate-700 "}
                    `}
                    disabled={safeCurrTricks === 0 && safeCurrSuit === "" || !safeIsMyTurn}
                >
                    {confirmPass ? "Confrim Pass?" : "Pass"}
                </button>
                <button 
                    onClick={() => {
                        onBid(stagedBid);
                        setStagedBid(null);
                    }}
                    className="py-1.5 rounded font-bold transition-all duration-200 bg-slate-700 hover:bg-slate-600 disabled:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={stagedBid === null}
                >
                    Bid
                </button>
            </div>
        </div>
    )


}
