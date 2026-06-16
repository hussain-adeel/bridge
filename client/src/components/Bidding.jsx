import { useState } from "react";

export default function Bidding({currBidSuit, currBidRank, isMyTurn, onBid, onPass}) {

    const [stagedBid, setStagedBid] = useState(null);
    const [confirmPass, setConfirmPass] = useState(false);

    const SUITS = ["Spades", "Hearts", "Clubs", "Diamonds"]
    const BIDS = [6, 7, 8, 9, 10, 11, 12]

    const currRank = currBidRank || 0;
    const currSuit = currBidSuit || "";

    return (

        <div
            className="w-full max-w-md flex flex-col mx-auto bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-600 gap-6 font-normal select-none"
        >

            <div className="text-center cursor-default">
                <span className="text-white font-extrabold text-3xl">PLACE YOUR BID</span> <br />
                {isMyTurn ? <span className="text-green-300 font-extrabold  text-l">Your Turn!</span> : <span className="text-red-300 font-extrabold font-sans text-l">Waiting For Others...</span>}
                
            </div>

            <div className="grid grid-cols-4 gap-4 text-center font-bold text-white">
                {SUITS.map((suit) => (

                    <div key={suit} className="flex flex-col gap-2">
                        <span className="cursor-default">{suit}</span>
                        {BIDS.map((rank) => {
                            const isDisabled = !isMyTurn || rank <= currBidRank
                            const isCurrentBid = rank === currBidRank && suit === currBidSuit
                            const isUserSelected = stagedBid?.suit === suit && stagedBid?.rank === rank;
                            
                            return (
                                <button 
                                    key={`${suit}-${rank}`}
                                    disabled={isDisabled}
                                    onClick={() => isUserSelected ? setStagedBid(null) : setStagedBid({suit, rank})}
                                    className={`
                                        py-1.5 rounded font-bold transition-all duration-200
                                        ${isCurrentBid 
                                            ? "bg-amber-400 text-black border border-amber-500 cursor-not-allowed" 

                                            : isUserSelected
                                            ? "bg-green-700 hover:bg-green-500 text-white border border-green-600 hover:border-green-400"

                                            : !isMyTurn
                                            ? "bg-slate-700 text-slate-500 border border-slate-700 opacity-60 cursor-default" 
                                            
                                            : " text-white border border-green-500 bg-slate-700 hover:bg-green-700 cursor-pointer disabled:border-red-500 disabled:bg-slate-700 disabled:text-slate-600 disabled:cursor-not-allowed disabled:hover:bg-slate-700"}
                                        
                                        
                                        `}
                                >
                                        {rank}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-slate-600 text-white">
                <button 
                    onClick={() => confirmPass === true ? onPass() : setConfirmPass(true)}
                    className={`py-1.5 rounded font-bold transition-all duration-200 bg-slate-700 cursor-pointer hover:bg-slate-600 disabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60`}
                    disabled={currRank === 0 && currSuit === "" || !isMyTurn}
                >
                    Pass
                </button>
                <button 
                    onClick={() => onBid()}
                    className="py-1.5 rounded font-bold transition-all duration-200 bg-slate-700 hover:bg-slate-600 disabled:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={stagedBid === null}
                >
                    Play
                </button>
            </div>
        </div>
    )


}