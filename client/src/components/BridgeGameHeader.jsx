import { useState } from "react";

export default function BridgeGameHeader({gameState}) {
    return (
        <header className="absolute top-6 w-full h-16 px-10 flex justify-between items-center z-10 select-none">
            <div className="flex-1 text-left">
                <h1 className="text-[#D3AF37] text-[40px] font-extrabold tracking-tighter drop-shadow-md">
                    BRIDGE
                </h1>
            </div>
            <div className="flex-1 text-center">
                <h1 className="text-white text-[40px] font-extrabold tracking-tighter drop-shadow-md">
                    <span className="text-green-300">{gameState.scores.team}</span> <span className="text-[#D3AF37]">-</span> <span className="text-red-300">{gameState.scores.enemy}</span>

                </h1>
            </div>
            <div className="flex-1 text-right">
                <h1 className="text-[#D3AF37] text-[40px] font-extrabold tracking-tighter drop-shadow-md"><span>{gameState.contract.tricks}</span> <span className="uppercase">{gameState.contract.suit}</span></h1>
            </div>
        </header>
    )
}