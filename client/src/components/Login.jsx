import { useState } from 'react';
import { supabase } from '../utils/supabase';

export default function Login() {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const loginWithDiscord = () => supabase.auth.signInWithOAuth({ provider: 'discord' });
    const loginWithGithub = () => supabase.auth.signInWithOAuth({ provider: 'github' });

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            
            setStep(2);
        } catch (err) {
            setError(err.message || "Failed to send code.");
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
            if (error) throw error;
            
        } catch (err) {
            setError("Invalid or expired token... please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="md:w-100 md:h-full p-6 bg-neutral-800 rounded-xl shadow-lg border border-neutral-700">
            <div className="flex flex-col items-center text-white font-extrabold gap-1">
                <div className="mb-6 text-center overflow-y-auto select-none">
                    <h1 className="text-2xl font-extrabold text-center text-text-main">Login</h1>
                    <h2 className="font-medium font-mono text-red-500 text-sm h-5 mt-1">{error}</h2>
                </div>
                
                <button onClick={loginWithGithub} className="select-none touch-manipulation active:opacity-95 cursor-pointer w-full p-2 bg-neutral-950 hover:bg-black rounded font-medium transition">Continue with Github</button>
                <button onClick={loginWithDiscord} className="select-none touch-manipulation active:opacity-95 cursor-pointer w-full p-2 bg-neutral-950 hover:bg-black rounded font-medium transition">Continue with Discord</button>

                <div className="relative flex items-center py-2 select-none w-full">
                    <div className="grow border-t border-neutral-600"></div>
                    <span className="shrink-0 mx-4 text-neutral-400 text-sm">or</span>
                    <div className="grow border-t border-neutral-600"></div>
                </div>

                <div className="w-full select-auto">
                    {step === 1 ? (
                        <form onSubmit={handleSendCode} className="flex flex-col gap-1">
                            <input 
                                type="email" 
                                name="email"
                                autoComplete="email"
                                value={email} 
                                placeholder="name@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                                className="px-4 py-2 border border-neutral-50 bg-neutral-300 text-neutral-950 w-full"
                            />
                            <button type="submit" disabled={loading || !isValidEmail} className="select-none touch-manipulation disabled:opacity-50 active:opacity-95 cursor-pointer w-full p-2 bg-neutral-950 hover:bg-black rounded font-medium transition mt-2">
                                {loading ? "Sending Code..." : "Send Login Code"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyCode} className="flex flex-col gap-1">
                            <p className="text-sm font-normal text-neutral-300 text-center mb-2">Code sent to {email}</p>
                            <input 
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={8} 
                                value={token} 
                                placeholder="12345678"
                                onChange={(e) => setToken(e.target.value)}
                                className="px-4 py-2 border border-neutral-50 bg-neutral-300 text-neutral-950 text-center tracking-widest text-lg font-mono"
                            />
                            <button type="submit" disabled={loading || token.length !== 8} className="select-none touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 active:opacity-95 cursor-pointer w-full p-2 bg-neutral-950 hover:disabled:bg-neutral-950 hover:bg-black rounded font-medium transition mt-2">
                                {loading ? "Verifying..." : "Verify Code"}
                            </button>
                            
                            <button 
                                type="button" 
                                onClick={() => setStep(1)}
                                className="text-sm text-neutral-400 hover:text-white mt-2 font-normal underline"
                            >
                                Use a different email
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}