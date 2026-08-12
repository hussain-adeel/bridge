import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(new Array(8).fill(""));
    const [step, setStep] = useState(1);
    const inputRefs = useRef([]);

    const { loginWithDiscord, loginWithGithub, sendOtp, verifyOtp, loading, error } = useAuth();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (!isValidEmail) return;
        
        try {
            const response = await sendOtp(email);
            if (response?.error) {
                console.error("Auth Error:", response.error);
                return; 
            }
            setStep(2); 
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } catch (err) {
            console.error("Crash in handleSendOtp:", err);
        }
    };

    const submitOtp = async (code) => {
        if (code.length !== 8) return;
        try {
            await verifyOtp(email, code);
        } catch (err) {
            console.error("Crash in handleVerifyOtp:", err);
        }
    };

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 7) {
            inputRefs.current[index + 1].focus();
        }

        const fullOtp = newOtp.join("");
        if (fullOtp.length === 8) {
            submitOtp(fullOtp);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
        if (pasteData) {
            const newOtp = [...otp];
            for (let i = 0; i < pasteData.length; i++) {
                newOtp[i] = pasteData[i];
            }
            setOtp(newOtp);
            
            if (pasteData.length === 8) {
                inputRefs.current[7].focus();
                submitOtp(pasteData);
            } else {
                inputRefs.current[pasteData.length]?.focus();
            }
        }
    };

    return (
        <div className="w-full z-20 relative bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-700 flex flex-col gap-1">
            <div className="mb-4 text-center select-none w-full">
                <h1 className="text-2xl font-extrabold text-text-main text-yellow-500">Login</h1>
                <div className="h-5 mt-1">
                    {error && <h2 className="font-medium font-mono text-red-500 text-sm">{error}</h2>}
                </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
                <button type="button" onClick={loginWithGithub} className="select-none touch-manipulation active:scale-[0.98] cursor-pointer w-full p-3 bg-neutral-950 hover:bg-black rounded-lg font-bold text-white transition-all duration-200">
                    Continue with Github
                </button>
                <button type="button" onClick={loginWithDiscord} className="select-none touch-manipulation active:scale-[0.98] cursor-pointer w-full p-3 bg-neutral-950 hover:bg-black rounded-lg font-bold text-white transition-all duration-200">
                    Continue with Discord
                </button>
            </div>

            <div className="flex items-center py-5 select-none w-full">
                <div className="grow border-t border-neutral-600"></div>
                <span className="shrink-0 mx-4 text-neutral-400 font-bold text-sm">or</span>
                <div className="grow border-t border-neutral-600"></div>
            </div>

            <div className="w-full select-auto">
                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-3 w-full">
                        <input 
                            type="email" 
                            name="email"
                            autoComplete="email"
                            value={email} 
                            placeholder="name@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-4 py-3 border border-neutral-600 bg-neutral-900/50 text-white placeholder:text-neutral-500 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                        />
                        <button 
                            type="submit" 
                            disabled={loading || !isValidEmail} 
                            className="select-none touch-manipulation disabled:opacity-50 disabled:active:scale-100 active:scale-[0.98] cursor-pointer w-full p-3 bg-neutral-950 hover:bg-black rounded-lg font-bold text-white transition-all duration-200"
                        >
                            {loading ? "Sending Code..." : "Send Login Code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 w-full items-center">
                        <p className="text-sm font-normal text-neutral-300 text-center mb-2">Code sent to <span className="font-semibold text-white">{email}</span></p>
                        
                        <div className="flex gap-1 md:gap-1 justify-center w-full mb-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    className="w-8 h-10 md:w-10 md:h-12 text-center text-lg md:text-xl font-bold bg-neutral-900 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                />
                            ))}
                        </div>

                        <button 
                            type="button" 
                            onClick={() => submitOtp(otp.join(""))}
                            disabled={loading || otp.join("").length !== 8} 
                            className="select-none touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-[0.98] cursor-pointer w-full p-3 bg-neutral-950 hover:bg-black rounded-lg font-bold text-white transition-all duration-200"
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => {
                                setStep(1);
                                setOtp(new Array(8).fill(""));
                            }}
                            className="text-sm text-neutral-400 hover:text-white mt-2 font-normal underline transition-colors"
                        >
                            Use a different email
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}