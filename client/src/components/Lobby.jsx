import { useState, useEffect } from "react";

export default function Lobby({players, roomCode, roundsInMatch, onRoundsChange, localUser, onToggleReady}) {
    const [copied, setCopied] = useState(false);

    const safePlayers = players ?? [];
    const safeRoomCode = roomCode ?? "Loading..."
    const safeLocalUser = localUser ?? {};
    const safeRoundsInMatch = roundsInMatch ?? 1;

    const roundOptions = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 50, 100]

    const isHost = (safePlayers.length > 0 && safePlayers[0].id == localUser.id) ?? false;
    const isReady = safePlayers[safeLocalUser.id]?.isReady ?? false;

    const handleCopyCode = () => {
        navigator.clipboard.writeText(roomCode);

        setCopied(true)

        setTimeout(() => setCopied(false), 2000)
    }
    
    return (
        <div className="w-screen h-screen bg-board-bg">
            <div className="flex flex-col items-center p-8 md:p-12">
                <div className="text-center">
                    <h1 className="text-white text-5xl md:text-[70px] mb-4 font-bold">Lobby</h1>
                    <h2 className="text-text-main text-2xl md:text-3xl mt-12 md:mt-24 font-bold">{`Room Code: `}</h2>
                </div>
                <div className="mt-3 md:mt-4">
                    <div className="flex items-center bg-slate-900 rounded-lg p-2 pr-2 pl-4 border border-slate-700 shadow-inner">
                        <span className="text-3xl font-mono font-bold tracking-widest text-white mr-4">
                            {safeRoomCode}
                        </span>
                        <button className={`
                            cursor-pointer flex items-center px-3 py-2 rounded transition-colors ${
                            copied 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                            }`}
                            onClick={handleCopyCode}
                        >
                            {copied ? (
                                // Checkmark SVG for "Copied"
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                ) : (
                                // Clipboard SVG for "Copy"
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div className="text-center mt-8 md:mt-12">
                    <h1 className="text-text-main mb-3 md:mb-4 font-bold text-2xl md:text-3xl">Players:</h1>
                    {safePlayers.map(player => {
                        return (
                            <div 
                                className={`
                                    text-white font-bold text-2xl border-3 rounded m-2 p-2 text-center
                                    ${player.id === safeLocalUser.id ? "border-amber-400" : "border-white"}
                                    ${player.isReady ? "bg-green-600" : ""}
                                `}
                                key={player.id}
                            >
                                {player.username}
                            </div>
                        )
                    })};
                </div>
                <div className="flex flex-col -mt-5 sm:-mt-1 ">
                    {!isHost ? (
                        <span className="text-white text-s md:text-xl font-semibold md:font-bold">{`[Match Rounds] first to ${safeRoundsInMatch} round(s)`}</span>
                    ) : (
                        <div className="flex-row">
                            <span className="text-white text-s md:text-xl font-semibold md:font-bold">{`[Match Options] First to `}</span>
                            <select 
                                name="roundSettingSelect" 
                                id="num-rounds"
                                defaultValue={safeRoundsInMatch}
                                onChange={(e) => onRoundsChange(Number(e.target.value))}
                                className="bg-slate-400"
                            >
                                {roundOptions.map(num => (
                                    <div>
                                    <span className="text-white text-s md:text-xl font-semibold md:font-bold">{`[Match Options] First to `}</span>
                                    <option key={num} value={num}>{num}</option>
                                    
                                    </div>
                                ))}
                            </select>
                            <span className="text-white text-s md:text-xl font-semibold md:font-bold">{` round wins.`}</span>
                        </div>
                    )}
                </div>

                <button
                    className=
                    {`
                        text-white font-bold cursor-pointer border-white hover:bg-green-500 text-2xl border-3 rounded m-2 mt-10 p-2 text-center
                        ${isReady ? 'bg-green-500' : 'bg-board-bg'}
                    `}
                    onClick={onToggleReady}
                >
                    Ready
                </button>

            </div>
        </div>
    )
}