import { GAME_LOG_EVENTS, SUIT_SYMBOLS, TEAM_IDS } from "../../../shared/gameConstants.js";

function getPlayer(players, playerIndex) {
    return players.find((player) => player.index === playerIndex);
}

function getTeamLabel(teamId) {
    if (teamId === TEAM_IDS.ONE) return "ALPHA";
    if (teamId === TEAM_IDS.TWO) return "BRAVO";
    return "A team";
}

function getEntryText(entry, players) {
    if (entry.message) return entry.message;

    const player = getPlayer(players, entry.playerIndex);
    const playerName = player?.username ?? "A player";
    const displayRank = entry.rank === "T" ? "10" : entry.rank;

    switch (entry.type) {
        case GAME_LOG_EVENTS.MATCH_STARTED:
            return "Match started";
        case GAME_LOG_EVENTS.ROUND_STARTED:
            return `Round ${entry.roundNumber ?? ""} started`;
        case GAME_LOG_EVENTS.BID:
            return `${playerName} bid ${entry.tricks} ${SUIT_SYMBOLS[entry.suit] ?? ""}`;
        case GAME_LOG_EVENTS.PASS:
            return `${playerName} passed`;
        case GAME_LOG_EVENTS.CARD_PLAYED:
            return `${playerName} played ${displayRank} ${SUIT_SYMBOLS[entry.suit] ?? ""}`;
        case GAME_LOG_EVENTS.TRICK_WON:
            return `${playerName} won the trick`;
        case GAME_LOG_EVENTS.ROUND_WON:
            return `${getTeamLabel(entry.teamId)} won the round`;
        case GAME_LOG_EVENTS.MATCH_WON:
            return `${getTeamLabel(entry.teamId)} won the match`;
        default:
            return "Game event";
    }
}

export default function GameLog({ entries = [], players = [], myTeamId }) {
    return (
        <aside className="w-full max-w-72 rounded-xl border border-slate-700/80 bg-slate-900/80 p-3 shadow-xl backdrop-blur-md">
            <h2 className="px-1 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
                Game Log
            </h2>
            <div className="mt-2 max-h-36 space-y-1 overflow-y-auto pr-1">
                {entries.length === 0 ? (
                    <p className="px-1 py-2 text-sm text-slate-500">No events yet.</p>
                ) : (
                    [...entries].reverse().map((entry, index) => {
                        const player = getPlayer(players, entry.playerIndex);
                        const entryTeamId = entry.teamId ?? player?.teamId;
                        const isFriendly = entryTeamId === myTeamId;
                        const hasTeam = Boolean(entryTeamId);

                        return (
                            <p
                                key={entry.id ?? `${entry.type}-${entry.playerIndex ?? "team"}-${index}`}
                                className={`rounded-md px-2 py-1.5 text-sm font-semibold ${
                                    !hasTeam
                                        ? "bg-slate-800 text-slate-300"
                                        : isFriendly
                                        ? "bg-emerald-400/10 text-emerald-200"
                                        : "bg-red-400/10 text-red-200"
                                }`}
                            >
                                {getEntryText(entry, players)}
                            </p>
                        );
                    })
                )}
            </div>
        </aside>
    );
}
