import { useEffect, useState } from "react";

export default function End({myTeamId, roundWinnerTeamId, matchWinnerTeamId, roundEndsAt, matchEndsAt, teamRoundScore, enemyRoundScore, matchOver, teamMatchScore, enemyMatchScore}) {

    const [fillWidth, setFillWidth] = useState(0);
    const [remainingRoundTime, setRemainingRoundTime] = useState(0);
    const safeMatchOver = matchOver ?? false;
    const endTimeValue = safeMatchOver ? matchEndsAt : roundEndsAt;

    useEffect(() => {
        const animationFrame = requestAnimationFrame(() => {
            const endTime = new Date(endTimeValue).getTime();
            const remainingTime = Number.isFinite(endTime) ? Math.max(endTime - Date.now(), 0) : 0;
            setRemainingRoundTime(remainingTime);
            setFillWidth(100);
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [endTimeValue]);

    // Round Details
    const safeTeamWonRound = roundWinnerTeamId === myTeamId;
    const safeTeamRoundScore = teamRoundScore ?? 0;
    const safeEnemyRoundScore = enemyRoundScore ?? 0;

    // Match Details
    const safeTeamMatchScore = teamMatchScore ?? 0;
    const safeEnemyMatchScore = enemyMatchScore ?? 0;
    const safeTeamWonMatch = matchWinnerTeamId === myTeamId;

    const summaryStatusText = () => {
        if (safeMatchOver)
        {
            if (safeTeamWonMatch) return "Match Won!"
            else return "Match Lost"
        }
        else if (safeTeamWonRound) return "Round Won!"
        else return "Round Lost"
    }

    return (
        <div className="relative z-100 mx-auto flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-6 font-normal shadow-[0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-md select-none">
            <div className="cursor-default text-center">
                <h1 className="mb-3 text-2xl font-extrabold uppercase tracking-[0.12em] text-white">
                    {safeMatchOver ? "Match Summary" : "Round Summary"}
                </h1>
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-extrabold ${safeTeamWonMatch || safeTeamWonRound ? 'bg-emerald-400/10 text-green-300 ring-1 ring-emerald-300/30' : 'bg-red-400/10 text-red-300 ring-1 ring-red-300/30'}`}>{summaryStatusText()}</span>
                <h2 className="mt-6 rounded-xl border border-slate-700/70 bg-slate-950/35 px-8 py-4 text-2xl font-extrabold text-white">
                    {safeMatchOver ? "Match Score" : "Round Score"}
                    <br/>
                    <span className="text-friendly">{safeMatchOver ? safeTeamMatchScore : safeTeamRoundScore}</span> 
                    <span className="text-text-main mx-2">-</span> 
                    <span className="text-enemy">{safeMatchOver ? safeEnemyMatchScore : safeEnemyRoundScore}</span>
                </h2>
                <h2 className="mt-3 rounded-xl border border-slate-700/70 bg-slate-950/20 px-8 py-3 text-xl font-extrabold text-white">
                    {safeMatchOver ? "Previous Round Score" : "Ongoing Match Score"}
                    <br></br>
                    <span className="text-friendly">{safeMatchOver ? safeTeamRoundScore : safeTeamMatchScore}</span> 
                    <span className="text-text-main mx-2">-</span> 
                    <span className="text-enemy">{safeMatchOver ? safeEnemyRoundScore : safeEnemyMatchScore}</span>
                </h2>
                <div className="pt-6">
                    <div className="relative flex h-9 w-full cursor-default items-center justify-center overflow-hidden rounded-full border border-slate-700/80 bg-slate-950/60 shadow-inner">
                    
                    <div 
                        className="absolute left-0 top-0 h-full bg-linear-to-r from-blue-700 to-blue-500"
                        style={{ 
                            width: `${fillWidth}%`, 
                            transition: `width ${remainingRoundTime}ms linear`
                        }}
                    ></div>

                    <span className="relative z-10 text-white font-bold uppercase tracking-wider text-sm drop-shadow-md">
                        {safeMatchOver ? "Returning to lobby..." : "Starting next round..."}
                    </span>
                    
                    </div>
                </div>
            </div>
        </div>
    )
}
