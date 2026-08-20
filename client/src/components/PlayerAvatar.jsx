import { GAME_PHASES } from "../../../shared/gameConstants.js";

export default function PlayerAvatar({ player, isTurn, gamePhase, tricksWon }) {
    if (!player) return null;
    const safeIsTurn = isTurn ?? false;
    const safeGamePhase = gamePhase;
    const safeTricksWon = tricksWon ?? 0;

    return (
        <a 
            href={`/profile/${player.username}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`View ${player.username}'s profile`}
            className={`
                select-none flex items-center justify-center rounded-lg border transition-all 
                cursor-pointer hover:scale-105 active:scale-95
                flex-row px-2 py-1 text-[10px] gap-2 mb-3
                md:flex-col md:p-3 md:w-28 md:text-sm
                ${safeIsTurn 
                    ? "bg-white text-black border-white shadow-md" 
                    : "bg-neutral-900 text-white border-neutral-800 hover:border-neutral-600"
                }
            `}
        >
            <div className="flex items-center gap-1 overflow-hidden w-full justify-center">
                <span className="font-bold uppercase truncate">{player.username}</span>
                <span
                    aria-label={player.isConnected === false ? "Disconnected" : "Connected"}
                    className={`h-2 w-2 rounded-full shrink-0 ${player.isConnected === false ? "bg-red-400" : "bg-green-400"}`}
                />
                
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-3 w-3 opacity-50 shrink-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </div>
            
            {safeGamePhase === GAME_PHASES.PLAYING && (
                <span className="font-mono font-bold md:mt-1">
                    {safeTricksWon} TRICKS
                </span>
            )}
        </a>
    );
}
