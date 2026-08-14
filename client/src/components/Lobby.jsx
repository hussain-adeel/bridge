import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { DEFAULT_ROUNDS_TO_WIN, MATCH_ROUND_OPTIONS } from "../../../shared/gameConstants.js";

export default function Lobby({ players, roomCode, hostId, roundsToWin, onRoundsChange = () => {}, onToggleReady = () => {} }) {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const safePlayers = players ?? [];
    const safeRoomCode = roomCode ?? "Loading...";
    const safeRoundsToWin = roundsToWin ?? DEFAULT_ROUNDS_TO_WIN;
    const localPlayer = safePlayers.find((player) => player.id === user?.id);
    const isHost = hostId === user?.id;
    const isReady = localPlayer?.isReady ?? false;

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(safeRoomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-screen h-screen bg-board-bg select-none">
            <div className="flex flex-col items-center p-8 md:p-12">
                <div className="text-center">
                    <h1 className="text-white text-5xl md:text-[70px] mb-4 font-bold">Lobby</h1>
                    <h2 className="text-text-main text-2xl md:text-3xl mt-12 md:mt-24 font-bold">Room Code:</h2>
                </div>
                <div className="mt-3 md:mt-4">
                    <div className="flex items-center bg-slate-900 rounded-lg p-2 pr-2 pl-4 border border-slate-700 shadow-inner">
                        <span className="text-3xl font-mono font-bold tracking-widest text-white mr-4">
                            {safeRoomCode}
                        </span>
                        <button
                            className={`cursor-pointer flex items-center px-3 py-2 rounded transition-colors ${copied ? "bg-green-500/20 text-green-400" : "bg-slate-700 hover:bg-slate-600 text-slate-300"}`}
                            onClick={handleCopyCode}
                        >
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                </div>
                <div className="text-center mt-8 md:mt-12">
                    <h2 className="text-text-main mb-3 md:mb-4 font-bold text-2xl md:text-3xl">Players:</h2>
                    {safePlayers.map((player) => (
                        <div
                            className={`text-white font-bold text-2xl border-3 rounded m-2 p-2 text-center ${player.id === user?.id ? "border-amber-400" : "border-white"} ${player.isReady ? "bg-green-600" : ""}`}
                            key={player.id}
                        >
                            {player.username}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col -mt-5 sm:-mt-1">
                    {isHost ? (
                        <div className="flex-row">
                            <span className="text-white text-s md:text-xl font-semibold md:font-bold">[Match Options] First to </span>
                            <select
                                name="roundSettingSelect"
                                id="num-rounds"
                                value={safeRoundsToWin}
                                onChange={(event) => onRoundsChange(Number(event.target.value))}
                                className="bg-slate-400"
                            >
                                {MATCH_ROUND_OPTIONS.map((roundCount) => (
                                    <option key={roundCount} value={roundCount}>{roundCount}</option>
                                ))}
                            </select>
                            <span className="text-white text-s md:text-xl font-semibold md:font-bold"> round wins.</span>
                        </div>
                    ) : (
                        <span className="text-white text-s md:text-xl font-semibold md:font-bold">[Match Rounds] first to {safeRoundsToWin} round(s)</span>
                    )}
                </div>
                <button
                    className={`text-white font-bold cursor-pointer border-white hover:bg-green-500 text-2xl border-3 rounded m-2 mt-10 p-2 text-center ${isReady ? "bg-green-500" : "bg-board-bg"}`}
                    onClick={onToggleReady}
                    disabled={!localPlayer}
                >
                    {isReady ? "Ready" : "Mark Ready"}
                </button>
            </div>
        </div>
    );
}
