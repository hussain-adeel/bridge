import { useState, useRef } from "react";
import { useRoom } from "../hooks/useRoom";

export default function JoinRoom() {
    const [code, setCode] = useState(new Array(4).fill(""));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const { onJoinRoom } = useRoom();

    const submitRoom = async (fullCode) => {
        if (fullCode.length !== 4) return;
        
        setError("");
        setLoading(true);

        try {
            await onJoinRoom(fullCode);
        } catch (err) {
            setError(err.message || "Failed to join room.");
        } finally {
            setLoading(false);
        }
    };

    const handleCodeChange = (e, index) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (!value && e.target.value !== "") return;

        const newCode = [...code];
        newCode[index] = value.substring(value.length - 1);
        setCode(newCode);

        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }

        const fullCode = newCode.join("");
        if (fullCode.length === 4) {
            submitRoom(fullCode);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
        if (e.key === "Enter" && code.join("").length === 4) {
            submitRoom(code.join(""));
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4);
        
        if (pasteData) {
            const newCode = [...code];
            for (let i = 0; i < pasteData.length; i++) {
                newCode[i] = pasteData[i];
            }
            setCode(newCode);
            
            if (pasteData.length === 4) {
                inputRefs.current[3].focus();
                submitRoom(pasteData);
            } else {
                inputRefs.current[pasteData.length]?.focus();
            }
        }
    };

    return (
        <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 md:p-8 flex flex-col items-center">
            <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-md">Join Room</h1>
            <p className="text-neutral-400 text-sm mb-6 text-center">Enter the 4-character room code</p>
            
            <div className="h-6 mb-2">
                {error && <p className="text-red-500 text-sm font-mono text-center">{error}</p>}
            </div>

            <div className="flex gap-3 md:gap-4 justify-center w-full mb-8">
                {code.map((char, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={char}
                        placeholder=""
                        onChange={(e) => handleCodeChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className="w-14 h-16 md:w-16 md:h-20 text-center text-3xl md:text-4xl font-black bg-neutral-950/80 border border-neutral-700 text-white placeholder:text-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all uppercase shadow-inner"
                    />
                ))}
            </div>

            <button 
                type="button" 
                onClick={() => submitRoom(code.join(""))}
                disabled={loading || code.join("").length !== 4} 
                className="select-none touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-[0.98] cursor-pointer w-full p-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-bold tracking-wide shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
            >
                {loading ? "Joining..." : "Join Game"}
            </button>
        </div>
    );
}