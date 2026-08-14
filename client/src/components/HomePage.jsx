import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase';
import bridge_logo from '../assets/bridge_logo.svg'
import JoinRoom from './JoinRoom';
import GameRules from './GameRules';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRoom } from '../hooks/useRoom';
import { useUsername } from '../hooks/useUsername';


export default function HomePage() {
    const [activeView, setActiveView] = useState("menu");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { onCreateRoom } = useRoom();
    const { username, loadingUsername } = useUsername();

    const navigate = useNavigate();
    const onMenu = () => {setActiveView("menu")}

    const handleCreateRoom = async () => {
        setLoading(true);
        setError("");

        try { 
            await onCreateRoom();

            
        }
        catch (err) { setError(err.message || "Failed to create room."); }
        finally { setLoading(false); }
    }

return (
        <div className="w-full min-h-screen p-6 md:p-12 flex flex-col items-center bg-board-bg bg-cover bg-center overflow-x-hidden">
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center w-full max-w-md mt-4 md:mt-8">
                <img 
                    src={bridge_logo} 
                    alt="Bridge Logo"
                    className="w-48 md:w-64 mb-6 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                {username && activeView === "menu" && (
                    <h1 className="text-3xl md:text-4xl font-black text-white/95 mb-8 text-center drop-shadow-xl tracking-tight">
                        Welcome, <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">{username}</span>!
                    </h1>
                )}
                
                <div className="w-full flex flex-col gap-4 overflow-y-auto no-scrollbar">
                    {activeView === "menu" && (
                        <div className="p-6 flex flex-col items-center gap-4 text-white font-bold bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                            <button
                                className="w-full select-none touch-manipulation active:scale-[0.98] cursor-pointer p-4 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => setActiveView("join")}
                            >
                                <span>Join Room</span>
                            </button>
                            <button
                                className="w-full select-none touch-manipulation active:scale-[0.98] cursor-pointer p-4 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-950/80 disabled:hover:border-neutral-800 disabled:active:scale-100"
                                onClick={handleCreateRoom}
                                disabled={loading}
                            >
                                <span>{loading ? "Creating..." : "Create Room"}</span>
                            </button>
                            <button
                                className="w-full select-none touch-manipulation active:scale-[0.98] cursor-pointer p-4 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-950/80 disabled:hover:border-neutral-800 disabled:active:scale-100"
                                onClick={() => navigate(`/profile/${username}`)}
                                disabled={loadingUsername}
                            >
                                <span>{loadingUsername ? "Loading..." : "Profile"}</span>
                            </button>
                            <button
                                className="w-full select-none touch-manipulation active:scale-[0.98] cursor-pointer p-4 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => setActiveView("rules")}
                            >
                                <span>Game Rules</span>
                            </button>
                            
                            <div className="w-full h-px bg-white/10 my-2" />
                            
                            <button
                                className="w-full select-none touch-manipulation active:scale-[0.98] cursor-pointer p-4 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 hover:border-red-500/50 text-red-100 rounded-2xl font-bold tracking-wide shadow-lg transition-all duration-300"
                                onClick={() => supabase.auth.signOut()}
                            >
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                    
                    {activeView === "join" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <JoinRoom />
                        </div>
                    )}
                    
                    {activeView === "rules" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4">
                            <GameRules />
                        </div>
                    )}
                </div>
                
                {activeView !== "menu" && (
                    <button 
                        onClick={onMenu} 
                        className="w-full max-w-50 mt-8 text-neutral-300 select-none touch-manipulation active:scale-95 cursor-pointer p-3 bg-neutral-900/60 backdrop-blur-md border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-800 hover:text-white rounded-xl font-medium shadow-xl transition-all duration-300"
                    >
                        Back to Menu
                    </button>
                )}
            </div>
        </div>
    )
}
