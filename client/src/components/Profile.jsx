import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { useAuth } from "../context/AuthContext"; 
import LoadingScreen from "./LoadingScreen";
import { useProfile } from "../hooks/useProfile";
import { TEAM_IDS } from "../../../shared/gameConstants.js";

export default function Profile() {
    const { username: routeUsername } = useParams();
    const { user: currentUser } = useAuth(); 

    const navigate = useNavigate();

    const { profile, matchHistory, loading, notFound, newUsername, setNewUsername, updateStatus, error, handleSaveUsername } = useProfile(routeUsername);

    const [isEditing, setIsEditing] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await handleSaveUsername();

        if (result && result.success) {
            setIsEditing(false);
            navigate(`/profile/${newUsername}`, { replace: true })
        }
    };

    const calculateRate = (won, played) => {
        if (!played || played === 0) return "0.0%";
        return ((won / played) * 100).toFixed(1) + "%";
    };

    if (loading) return <LoadingScreen />;

    if (notFound) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-board-bg bg-cover bg-center overflow-hidden relative p-8">
                <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                <div className="relative z-10 w-full max-w-md bg-neutral-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
                    <h2 className="text-3xl font-black text-white tracking-tight">Player not found</h2>
                    <p className="text-neutral-400 text-center">This profile doesn't exist or may have been renamed.</p>
                    <button 
                        onClick={() => navigate("/")}
                        className="mt-6 w-full select-none touch-manipulation active:scale-[0.98] cursor-pointer p-3 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl font-bold text-white tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUser?.id === profile?.id;
    const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="w-full min-h-screen p-4 md:p-12 flex flex-col items-center bg-board-bg bg-cover bg-center overflow-x-hidden relative">
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-3xl bg-neutral-900/70 backdrop-blur-2xl border border-white/10 rounded-4xl p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col gap-8 mt-4 md:mt-10 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative group">
                    <div className="w-24 h-24 shrink-0 bg-linear-to-br from-neutral-800 to-neutral-950 rounded-full flex items-center justify-center text-4xl font-black text-white border border-white/10 select-none shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500">
                        {profile.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex flex-col items-center md:items-start w-full">
                        {!isEditing ? (
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-neutral-400 drop-shadow-sm">
                                    {profile.username}
                                </h1>
                                {isOwnProfile && (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="text-neutral-500 hover:text-emerald-400 transition-colors cursor-pointer p-2 rounded-full hover:bg-neutral-800/50"
                                        title="Edit Username"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full max-w-sm">
                                <input 
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    disabled={updateStatus === "loading"}
                                    className="w-full px-4 py-2 bg-neutral-950/80 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-white font-bold"
                                    autoFocus
                                />
                                {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
                                <div className="flex gap-2 w-full mt-1">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setNewUsername(profile.username);
                                        }}
                                        className="flex-1 p-2.5 text-sm font-bold bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-500 rounded-xl transition-all cursor-pointer text-white active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={updateStatus === "loading"}
                                        className="flex-1 p-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:active:scale-100 active:scale-95 shadow-lg hover:shadow-emerald-500/20"
                                    >
                                        {updateStatus === "loading" ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        )}
                        <span className="text-neutral-500 text-sm mt-2 font-medium tracking-wide uppercase">Member since {joinDate}</span>
                    </div>
                </div>

                <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-2" />

                <div className="flex flex-col gap-5">
                    <h2 className="text-xl font-extrabold text-white tracking-wide drop-shadow-sm">Career Statistics</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col p-5 bg-neutral-950/60 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg transition-transform hover:-translate-y-1 duration-300">
                            <h3 className="text-neutral-400 text-xs font-bold tracking-widest uppercase mb-4 border-b border-white/10 pb-3">Matches</h3>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-neutral-300 font-medium">Played</span>
                                <span className="font-bold text-white">{profile.matches_played || 0}</span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-neutral-300 font-medium">Won</span>
                                <span className="font-bold text-emerald-400">{profile.matches_won || 0}</span>
                            </div>
                            <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
                                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Win Rate</span>
                                <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{calculateRate(profile.matches_won, profile.matches_played)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col p-5 bg-neutral-950/60 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg transition-transform hover:-translate-y-1 duration-300">
                            <h3 className="text-neutral-400 text-xs font-bold tracking-widest uppercase mb-4 border-b border-white/10 pb-3">Rounds</h3>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-neutral-300 font-medium">Played</span>
                                <span className="font-bold text-white">{profile.rounds_played || 0}</span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-neutral-300 font-medium">Won</span>
                                <span className="font-bold text-emerald-400">{profile.rounds_won || 0}</span>
                            </div>
                            <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
                                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Win Rate</span>
                                <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{calculateRate(profile.rounds_won, profile.rounds_played)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col p-5 bg-neutral-950/60 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg transition-transform hover:-translate-y-1 duration-300">
                            <h3 className="text-neutral-400 text-xs font-bold tracking-widest uppercase mb-4 border-b border-white/10 pb-3">Tricks</h3>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-neutral-300 font-medium">Played</span>
                                <span className="font-bold text-white">{profile.tricks_played || 0}</span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-neutral-300 font-medium">Won</span>
                                <span className="font-bold text-emerald-400">{profile.tricks_won || 0}</span>
                            </div>
                            <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
                                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Win Rate</span>
                                <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{calculateRate(profile.tricks_won, profile.tricks_played)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-2" />

                <div className="flex flex-col gap-5">
                    <h2 className="text-xl font-extrabold text-white tracking-wide drop-shadow-sm">Recent Matches</h2>
                    
                    {matchHistory.length === 0 ? (
                        <div className="p-8 bg-neutral-950/60 backdrop-blur-md border border-white/5 rounded-2xl text-center shadow-inner">
                            <span className="text-neutral-500 font-medium">No matches played yet. Time to hit the tables!</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {matchHistory.map((entry, idx) => {
                                const match = entry.matches;
                                const isWin = entry.team_id === match.winning_team;
                                
                                const myScore = entry.team_id === TEAM_IDS.ONE ? match.team_1_score : match.team_2_score;
                                const oppScore = entry.team_id === TEAM_IDS.ONE ? match.team_2_score : match.team_1_score;

                                return (
                                    <div key={match.id || idx} className="flex justify-between items-center p-4 bg-neutral-950/60 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg hover:bg-neutral-900/80 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-1.5 h-12 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${isWin ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'}`}></div>
                                            
                                            <div className="flex flex-col">
                                                <span className={`font-black tracking-widest text-sm drop-shadow-sm ${isWin ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {isWin ? 'VICTORY' : 'DEFEAT'}
                                                </span>
                                                <span className="text-xs font-medium text-neutral-500 mt-0.5">
                                                    {new Date(match.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-2 font-mono text-xl tracking-tight">
                                                <span className={isWin ? "text-white font-bold" : "text-neutral-400"}>{myScore}</span>
                                                <span className="text-neutral-600/50">-</span>
                                                <span className={!isWin ? "text-white font-bold" : "text-neutral-400"}>{oppScore}</span>
                                            </div>
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">Score</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            <button 
                onClick={() => navigate("/")} 
                className="relative z-10 w-full max-w-50 mb-12 text-neutral-300 select-none touch-manipulation active:scale-95 cursor-pointer p-3 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-800 hover:text-white rounded-xl font-bold tracking-wide shadow-xl transition-all duration-300"
            >
                Back to Menu
            </button>

        </div>
    );
}
