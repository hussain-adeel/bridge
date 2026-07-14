export default function PlayerAvatar({ player, isTurn, gamePhase }) {
    
    if (!player) return null;
    const safeIsTurn = isTurn ?? false;
    const safeGamePhase = gamePhase ?? "LOADING"

    return (
        <div className={
            `select-none flex items-center justify-center rounded-lg border transition-all 

            flex-row px-2 py-1 text-[10px] gap-2 mb-3

            md:flex-col md:p-3 md:w-28 md:text-sm
            ${isTurn ? "bg-white text-black border-white" : "bg-neutral-900 text-neutral-400 border-neutral-800"}`}>
            
            <span className="font-bold uppercase truncate">{player.username}</span>

            <span className="font-mono font-bold md:mt-1">
                {safeGamePhase === "PLAYING" ? `${player.tricksWon || 0} HANDS` : ""}
            </span>
        </div>
    );
}