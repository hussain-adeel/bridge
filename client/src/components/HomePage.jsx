import { useState } from 'react'
import { supabase } from '../utils/supabase';
import bridge_logo from '../assets/bridge_logo.svg'
import JoinRoom from './JoinRoom';
import GameRules from './GameRules';
import ProfileStats from './ProfileStats';


export default function HomePage({onJoinRoom, onCreateRoom}) {
    const [activeView, setActiveView] = useState("menu");
    const [loading, setLoading] = useState(false);
    const [roomCode, setRoomCode] = useState("");

    const onMenu = () => {setActiveView("menu")}

    return (
        <div className="w-full h-screen p-8 md:p-12 flex flex-col items-center bg-board-bg">
            <img 
                src={bridge_logo} 
                alt="Bridge Logo"
                className="w-md"
            />
            <div className="w-full max-w-md flex flex-col gap-4 overflow-y-auto">
                {activeView === "menu" && (
                    <div className="p-3 flex flex-col items-center gap-3 text-white font-bold">
                        <button
                            className="w-full select-none touch-manipulation active:opacity-95 cursor-pointer p-3 bg-neutral-950 hover:bg-black rounded font-medium transition"
                            onClick={() => setActiveView("join")}
                        >
                            <span>Join Room</span>
                        </button>
                        <button
                            className="select-none touch-manipulation active:opacity-95 cursor-pointer w-full p-3 bg-neutral-950 hover:bg-black rounded font-medium transition"
                        >
                            <span>Create Room</span>
                        </button>
                        <button
                            className="select-none touch-manipulation active:opacity-95 cursor-pointer w-full p-3 bg-neutral-950 hover:bg-black rounded font-medium transition"
                            onClick={() => setActiveView("stats")}
                        >
                            <span>View Statistics</span>
                        </button>
                        <button
                            className="select-none touch-manipulation active:opacity-95 cursor-pointer w-full p-3 bg-neutral-950 hover:bg-black rounded font-medium transition"
                            onClick={() => setActiveView("rules")}
                        >
                            <span>View Game Rules</span>
                        </button>
                        <button
                            className="select-none touch-manipulation active:opacity-95 cursor-pointer w-full p-3 bg-neutral-950 hover:bg-black rounded font-medium transition"
                            onClick={() => supabase.auth.signOut()}
                        >
                            <span>Log Out</span>
                        </button>
                    </div>
                )}
                {activeView === "join" && (
                    <JoinRoom onJoinRoom={onJoinRoom}></JoinRoom>
                )}
                {activeView === "rules" && (
                    <GameRules></GameRules>
                )}
                {activeView == "stats" && (
                    <ProfileStats></ProfileStats>
                )}
            </div>
            <div>
                {activeView !== "menu" && (
                    <button onClick={onMenu} className="w-50 md:w-md mt-6 text-white select-none touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 active:opacity-95 cursor-pointer p-2 bg-neutral-950 hover:disabled:bg-neutral-950 hover:bg-black rounded font-medium transition">
                        Back to Menu
                    </button>
                )}
            </div>
        </div>
    )
}
