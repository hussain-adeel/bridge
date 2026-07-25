import { useState } from "react"

export default function JoinRoom({onJoinRoom}) {
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const success = await onJoinRoom(roomCode);

            if (!success) {
                setError("Invalid room code or game is full.")
            }
        }
        catch (err) {
            setError(err.message || "Failed to join room.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex flex-col gap-3 w-fit items-center'>
            <h1 className="text-text-main font-bold text-5xl mb-3 md:mb-6">Join Room</h1>
            {error && <p className="text-red-500 text-sm text-center font-mono">{error}</p>}
            <form onSubmit={onJoinRoom} className="flex flex-col gap-3 items-center">
                <input 
                    type="text" 
                    inputMode="text" 
                    autoCapitalize="characters" 
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    maxLength="4"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="ABCD"
                    className="w-50 md:w-md select-all px-4 py-2 border border-neutral-50 bg-neutral-300 text-neutral-950"
                />
                <button type="submit" disabled={loading || roomCode.length !== 4} className="text-white select-none touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 active:opacity-95 cursor-pointer w-full p-2 bg-neutral-950 hover:disabled:bg-neutral-950 hover:bg-black rounded font-medium transition">
                    {loading ? "Joining Room..." : "Join Room"}
                </button>
            </form>
        </div>
    )
}