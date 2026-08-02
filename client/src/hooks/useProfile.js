import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export function useProfile(routeUsername) {
    const [profile, setProfile] = useState(null);
    const [matchHistory, setMatchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [newUsername, setNewUsername] = useState("");
    const [updateStatus, setUpdateStatus] = useState("idle");
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProfileData() {
            setLoading(true);
            setNotFound(false);

            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("id, created_at, username, matches_played, rounds_played, tricks_played, matches_won, rounds_won, tricks_won")
                .eq("username", routeUsername)
                .maybeSingle();
            
            if (profileError) {
                console.error("[Bridge Client] Error fetching profile:", profileError.message);
                setNotFound(true);
            }
            else if (!profileData) setNotFound(true);
            else {
                setProfile(profileData);
                setNewUsername(profileData.username);

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
                    .limit(5);
                
                if (historyError) console.error("[Bridge Client] Error fetching match history:", historyError);
                else setMatchHistory(historyData.filter(entry => entry.matches) || []);
            }
            setLoading(false);
        }

        if (routeUsername) fetchProfileData();
        else {
            setLoading(false);
            setNotFound(true);
        }
    }, [routeUsername]);

    const handleSaveUsername = async () => {
        setUpdateStatus("loading");
        setError("");

        const trimmedName = newUsername.trim();

        if (!trimmedName || trimmedName === profile.username) {
            setUpdateStatus("idle");
            return { success: true };
        }

        const { error } = await supabase
            .from("profiles")
            .update({ username: trimmedName })
            .eq("id", profile.id)
        
        if (error) {
            if (error.code === "23505") setError("Username is already taken.");
            else setError("An error occured. Try again.");

            setUpdateStatus("idle");
            return { success: false }
        }
        else {
            setUpdateStatus("success");
            setProfile(prev => ({ ...prev, username: trimmedName }));
            return { success: true };
        }
    };

    return {
        profile,
        matchHistory,
        loading,
        notFound,
        newUsername,
        setNewUsername,
        updateStatus,
        error,
        handleSaveUsername
    };
} 