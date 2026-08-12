import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useAuth } from "../context/AuthContext";

export function useUsername() {
    const { user } = useAuth();
    const [username, setUsername] = useState("");
    const [loadingUsername, setLoadingUsername] = useState(true);

    useEffect(() => {
        async function fetchUsername() {
            if (!user?.id) {
                setLoadingUsername(false);
                return;
            }
            
            const { data, error } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", user.id)
                .single();

            if (error) console.error("[Bridge Client] Error Fetching Username:", error.message);
            else if (data) setUsername(data.username);

            setLoadingUsername(false);
        }

        fetchUsername();
    }, [user]);

    return { username, loadingUsername };
}