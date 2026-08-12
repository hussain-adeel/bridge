import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    
    const [initialLoading, setInitialLoading] = useState(true); 
    
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState("");

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setInitialLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setInitialLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginWithDiscord = () => supabase.auth.signInWithOAuth({ provider: 'discord' });
    const loginWithGithub = () => supabase.auth.signInWithOAuth({ provider: 'github' });

    const sendOtp = async (email) => {
        setLoading(true);
        setError("");
        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            return { success: true };
        } catch (err) {
            setError(err.message || "Failed to send code.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (email, token) => {
        setLoading(true);
        setError("");
        try {
            const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
            if (error) throw error;
            return { success: true };
        } catch (err) {
            setError("Invalid or expired token... please try again.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const signOut = () => supabase.auth.signOut();

    const value = {
        user,
        loading,
        error,
        loginWithDiscord,
        loginWithGithub,
        sendOtp,
        verifyOtp,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {!initialLoading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined)
        throw new Error('Invalid usage of useAuth... must be used within AuthContext')

    return context;
};