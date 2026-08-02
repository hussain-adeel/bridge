import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { useAuth } from "../context/AuthContext"; 
import LoadingScreen from "./LoadingScreen";

export default function Profile() {
    const { username: routeUsername } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth(); 

    const [profile, setProfile] = useState(null);
    const [matchHistory, setMatchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [updateStatus, setUpdateStatus] = useState("idle"); 
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function fetchProfileData() {
            setLoading(true);
            setNotFound(false);

            // 1. Fetch the main profile stats
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("id, created_at, username, matches_played, rounds_played, tricks_played, matches_won, rounds_won, tricks_won") 
                .eq("username", routeUsername)
                .maybeSingle();

            if (profileError) {
                console.error("Error fetching profile:", profileError.message);
                setNotFound(true);
            } else if (!profileData) {
                setNotFound(true);
            } else {
                setProfile(profileData);
                setNewUsername(profileData.username);

                // 2. Fetch the match history using the relational mapping in Supabase
                const { data: historyData, error: historyError } = await supabase
                    .from("match_players")
                    .select(`
                        team_id,
                        matches (
                            id,
                            created_at,
                            winning_team,
                            team_1_score,
                            team_2_score,
                            status
                        )
                    `)
                    .eq("user_id", profileData.id)
                    .order("created_at", { ascending: false })
                    .limit(5); // Show last 5 matches

                if (historyError) {
                    console.error("Error fetching match history:", historyError.message);
                } else {
                    // Filter out any missing match references just in case
                    setMatchHistory(historyData.filter(entry => entry.matches) || []);
                }
            }
            setLoading(false);
        }

        if (routeUsername) {
            fetchProfileData();
        } else {
            setLoading(false);
            setNotFound(true);
        }
    }, [routeUsername]);

    const handleSaveUsername = async (e) => {
        e.preventDefault();
        setUpdateStatus("loading");
        setErrorMessage("");

        const trimmedName = newUsername.trim();
        if (!trimmedName || trimmedName === profile.username) {
            setIsEditing(false);
            setUpdateStatus("idle");
            return;
        }

        const { error } = await supabase
            .from("profiles")
            .update({ username: trimmedName })
            .eq("id", profile.id);

        if (error) {
            if (error.code === "23505") {
                setErrorMessage("Username is already taken.");
            } else {
                setErrorMessage("An error occurred. Try again.");
            }
            setUpdateStatus("idle");
        } else {
            setUpdateStatus("success");
            setIsEditing(false);
            navigate(`/profile/${trimmedName}`, { replace: true });
        }
    };

    const calculateRate = (won, played) => {
        if (!played || played === 0) return "0.0%";
        return ((won / played) * 100).toFixed(1) + "%";
    };

    if (loading) return <LoadingScreen />;

    if (notFound) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-board-bg text-white gap-4 p-8">
                <h2 className="text-2xl font-bold">Player not found</h2>
                <p className="text-neutral-400">This profile doesn't exist.</p>
                <button 
                    onClick={() => navigate("/")}
                    className="mt-4 p-3 px-6 bg-neutral-950 hover:bg-black rounded font-medium transition cursor-pointer"
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    const isOwnProfile = currentUser?.id === profile?.id;
    const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="w-full min-h-screen p-4 md:p-12 flex flex-col items-center bg-board-bg text-white overflow-y-auto">
            
            <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-10 shadow-2xl flex flex-col gap-8 mt-4 md:mt-10 mb-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-24 h-24 shrink-0 bg-neutral-800 rounded-full flex items-center justify-center text-4xl font-bold border-2 border-neutral-700 select-none shadow-inner">
                        {profile.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex flex-col items-center md:items-start w-full">
                        {!isEditing ? (
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-wide">{profile.username}</h1>
                                {isOwnProfile && (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="text-neutral-500 hover:text-white transition cursor-pointer p-1"
                                        title="Edit Username"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSaveUsername} className="flex flex-col gap-2 w-full max-w-sm">
                                <input 
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    disabled={updateStatus === "loading"}
                                    className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded focus:outline-none focus:border-neutral-400 transition text-white"
                                    autoFocus
                                />
                                {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
                                <div className="flex gap-2 w-full mt-1">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setNewUsername(profile.username);
                                            setErrorMessage("");
                                        }}
                                        className="flex-1 p-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={updateStatus === "loading"}
                                        className="flex-1 p-2 text-sm bg-neutral-200 text-black hover:bg-white font-bold rounded transition cursor-pointer disabled:opacity-50"
                                    >
                                        {updateStatus === "loading" ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        )}
                        <span className="text-neutral-500 text-sm mt-1">Member since {joinDate}</span>
                    </div>
                </div>

                <hr className="border-neutral-800" />

                {/* --- STATS SECTION --- */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-neutral-300">Career Statistics</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col p-5 bg-neutral-950 rounded-lg border border-neutral-800 shadow-md">
                            <h3 className="text-neutral-400 text-sm font-semibold tracking-wider uppercase mb-3 border-b border-neutral-800 pb-2">Matches</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-neutral-300">Played</span>
                                <span className="font-bold">{profile.matches_played || 0}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-neutral-300">Won</span>
                                <span className="font-bold text-green-400">{profile.matches_won || 0}</span>
                            </div>
                            <div className="mt-auto pt-3 border-t border-neutral-900 flex justify-between items-center">
                                <span className="text-neutral-500 text-sm">Win Rate</span>
                                <span className="font-bold">{calculateRate(profile.matches_won, profile.matches_played)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col p-5 bg-neutral-950 rounded-lg border border-neutral-800 shadow-md">
                            <h3 className="text-neutral-400 text-sm font-semibold tracking-wider uppercase mb-3 border-b border-neutral-800 pb-2">Rounds</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-neutral-300">Played</span>
                                <span className="font-bold">{profile.rounds_played || 0}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-neutral-300">Won</span>
                                <span className="font-bold text-green-400">{profile.rounds_won || 0}</span>
                            </div>
                            <div className="mt-auto pt-3 border-t border-neutral-900 flex justify-between items-center">
                                <span className="text-neutral-500 text-sm">Win Rate</span>
                                <span className="font-bold">{calculateRate(profile.rounds_won, profile.rounds_played)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col p-5 bg-neutral-950 rounded-lg border border-neutral-800 shadow-md">
                            <h3 className="text-neutral-400 text-sm font-semibold tracking-wider uppercase mb-3 border-b border-neutral-800 pb-2">Tricks</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-neutral-300">Played</span>
                                <span className="font-bold">{profile.tricks_played || 0}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-neutral-300">Won</span>
                                <span className="font-bold text-green-400">{profile.tricks_won || 0}</span>
                            </div>
                            <div className="mt-auto pt-3 border-t border-neutral-900 flex justify-between items-center">
                                <span className="text-neutral-500 text-sm">Win Rate</span>
                                <span className="font-bold">{calculateRate(profile.tricks_won, profile.tricks_played)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-neutral-800" />

                {/* --- MATCH HISTORY SECTION --- */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-neutral-300">Recent Matches</h2>
                    
                    {matchHistory.length === 0 ? (
                        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg text-center">
                            <span className="text-neutral-500">No matches played yet.</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {matchHistory.map((entry, idx) => {
                                const match = entry.matches;
                                const isWin = entry.team_id === match.winning_team;
                                
                                // Determine which score belongs to the user based on their team_id
                                const myScore = entry.team_id === 'team_1' ? match.team_1_score : match.team_2_score;
                                const oppScore = entry.team_id === 'team_1' ? match.team_2_score : match.team_1_score;

                                return (
                                    <div key={match.id || idx} className="flex justify-between items-center p-4 bg-neutral-950 border border-neutral-800 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-4">
                                            {/* Status Indicator Bar */}
                                            <div className={`w-1.5 h-10 rounded-full ${isWin ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            
                                            <div className="flex flex-col">
                                                <span className={`font-bold tracking-wider text-sm ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                                                    {isWin ? 'VICTORY' : 'DEFEAT'}
                                                </span>
                                                <span className="text-xs text-neutral-500 mt-0.5">
                                                    {new Date(match.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-2 font-mono text-lg">
                                                <span className={isWin ? "text-white font-bold" : "text-neutral-400"}>{myScore}</span>
                                                <span className="text-neutral-600">-</span>
                                                <span className={!isWin ? "text-white font-bold" : "text-neutral-400"}>{oppScore}</span>
                                            </div>
                                            <span className="text-[10px] uppercase tracking-widest text-neutral-500">Score</span>
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
                className="w-full max-w-sm text-white select-none touch-manipulation active:opacity-95 cursor-pointer p-3 bg-neutral-950 border border-neutral-800 hover:bg-black rounded font-medium transition"
            >
                Back to Menu
            </button>

        </div>
    );
}