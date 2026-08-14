import { useEffect, useState } from "react";

export default function End({myTeamId, roundWinnerTeamId, matchWinnerTeamId, roundEndsAt, teamRoundScore, enemyRoundScore, matchOver, teamMatchScore, enemyMatchScore, onReturnToLobby}) {

    const [fillWidth, setFillWidth] = useState(0);
    const [remainingRoundTime, setRemainingRoundTime] = useState(0);

    useEffect(() => {
        if (matchOver) return undefined;

        const animationFrame = requestAnimationFrame(() => {
            const endTime = new Date(roundEndsAt).getTime();
            const remainingTime = Number.isFinite(endTime) ? Math.max(endTime - Date.now(), 0) : 0;
            setRemainingRoundTime(remainingTime);
            setFillWidth(100);
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [matchOver, roundEndsAt]);

    // Round Details
    const safeTeamWonRound = roundWinnerTeamId === myTeamId;
    const safeTeamRoundScore = teamRoundScore ?? 0;
    const safeEnemyRoundScore = enemyRoundScore ?? 0;

    // Match Details
    const safeMatchOver = matchOver ?? false;
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
        <div className="relative opacity-90 z-100 w-full max-w-md flex flex-col mx-auto bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-600 gap-6 font-normal select-none items-center">
            <div className="cursor-default text-center">
                <h1 className="text-white font-extrabold text-3xl mb-2">
                    {safeMatchOver ? "Match Summary" : "Round Summary"}
                </h1>
                <span className={`${safeTeamWonMatch || safeTeamWonRound ? 'text-green-300' : 'text-red-300'} font-semibold text-xl`}>{summaryStatusText()}</span>
                <br />
                <h2 className="text-white font-extrabold text-3xl mt-10">
                    {safeMatchOver ? "Match Score" : "Round Score"}
                    <br/>
                    <span className="text-friendly">{safeMatchOver ? safeTeamMatchScore : safeTeamRoundScore}</span> 
                    <span className="text-text-main mx-2">-</span> 
                    <span className="text-enemy">{safeMatchOver ? safeEnemyMatchScore : safeEnemyRoundScore}</span>
                </h2>
                <br />
                <h2 className="text-white font-extrabold text-3xl">
                    {safeMatchOver ? "Previous Round Score" : "Ongoing Match Score"}
                    <br></br>
                    <span className="text-friendly">{safeMatchOver ? safeTeamRoundScore : safeTeamMatchScore}</span> 
                    <span className="text-text-main mx-2">-</span> 
                    <span className="text-enemy">{safeMatchOver ? safeEnemyRoundScore : safeEnemyMatchScore}</span>
                </h2>
                <div className="pt-12">
                    {safeMatchOver ? (
                    <button 
                        className="w-full h-12 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 shadow-inner cursor-pointer text-white font-bold uppercase tracking-wider text-sm drop-shadow-md"
                        onClick={onReturnToLobby}
                    >
                        Return to Lobby
                    </button> 
                    ) : (
                    <div className="relative w-full h-12 bg-slate-800 rounded flex items-center justify-center overflow-hidden border border-slate-600 shadow-inner cursor-default">
                    
                    <div 
                        className="absolute left-0 top-0 h-full bg-linear-to-r from-blue-700 to-blue-500"
                        style={{ 
                            width: `${fillWidth}%`, 
                            transition: `width ${remainingRoundTime}ms linear`
                        }}
                    ></div>

                    <span className="relative z-10 text-white font-bold uppercase tracking-wider text-sm drop-shadow-md">
                        Starting next round...
                    </span>
                    
                    </div>
                    )};
                    
                    
                </div>
            </div>
        </div>
    )
}
