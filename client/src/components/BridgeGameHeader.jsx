import { GAME_PHASES, SUIT_SYMBOLS } from "../../../shared/gameConstants.js";
import GameLog from "./GameLog";

export default function BridgeGameHeader({ gamePhase, isMyTeamBid, tricksCalled, suitCalled, teamScore, enemyScore, gameLog, players, myTeamId }) {
    const safeTricksCalled = tricksCalled ?? 0;
    const safeSuitCalled = suitCalled ?? "";
    const safeTeamScore = teamScore ?? 0;
    const safeEnemyScore = enemyScore ?? 0;
    const safeIsMyTeamBid = isMyTeamBid ?? false;
    const suitSymbol = SUIT_SYMBOLS[safeSuitCalled] ?? "";
    const headerVisibility = gamePhase === GAME_PHASES.BIDDING || gamePhase === GAME_PHASES.DEALING
        ? "opacity-0 pointer-events-none"
        : "opacity-100";

    const bidCallText = () => {
        if (safeTricksCalled === 0) return "No bid yet";
        return safeIsMyTeamBid ? "Your team called" : "Enemy team called";
    };

    return (
        <header className="w-full flex flex-col items-center gap-4 px-4 pt-8 pb-6 md:px-8 xl:flex-row xl:items-start xl:px-24 xl:pb-0 min-[700px]:flex-row min-[700px]:items-start select-none">
            <div className="flex w-full justify-center min-[700px]:w-auto min-[700px]:flex-1 min-[700px]:justify-start">
                <GameLog entries={gameLog} players={players} myTeamId={myTeamId} />
            </div>

            <div className="flex w-full max-w-72 flex-col rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-center shadow-xl backdrop-blur-md min-[700px]:w-auto min-[700px]:flex-1">
                <div className={`flex flex-col items-center pb-3 ${headerVisibility}`}>
                    <h2 className="text-sm font-extrabold tracking-[0.16em] text-slate-400 whitespace-nowrap">
                        SCORE:
                    </h2>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-white drop-shadow-md whitespace-nowrap">
                        <span className="text-friendly">{safeTeamScore}</span>
                        <span className="text-text-main mx-2">-</span>
                        <span className="text-enemy">{safeEnemyScore}</span>
                    </h1>
                </div>
                <div className="border-t border-slate-700/80 pt-3">
                    <p className="text-sm font-bold text-slate-200 whitespace-nowrap">
                        {safeTricksCalled === 0
                            ? "No bid yet"
                            : `${bidCallText()} ${safeTricksCalled} ${suitSymbol}`}
                    </p>
                </div>
            </div>
        </header>
    );
}
