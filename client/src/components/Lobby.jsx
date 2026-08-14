import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom.js"
import { useGameActions } from "../hooks/useGameActions.js";
import { DEFAULT_ROUNDS_TO_WIN, MATCH_ROUND_OPTIONS, MAX_PLAYERS } from "../../../shared/gameConstants.js";

export default function Lobby({ players, roomCode, hostId, roundsToWin }) {
    const { user } = useAuth();
    const { onLeaveRoom } = useRoom();
    const { onToggleReady, onRoundsChange, onStartMatch } = useGameActions(roomCode);
    const [copied, setCopied] = useState(false);
    const safePlayers = players ?? [];
    const safeRoomCode = roomCode ?? "Loading...";
    const safeRoundsToWin = roundsToWin ?? DEFAULT_ROUNDS_TO_WIN;
    const localPlayer = safePlayers.find((player) => player.id === user?.id);
    const isHost = hostId === user?.id;
    const isReady = localPlayer?.isReady ?? false;
    const canStartMatch = safePlayers.length === MAX_PLAYERS && safePlayers.every((player) => player.isReady);

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(safeRoomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-board-bg px-4 py-8 text-white sm:px-8 sm:py-12">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-950/30 via-slate-950/65 to-slate-950" />
            <div className="pointer-events-none absolute -left-28 top-16 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />

            <div className="relative mx-auto w-full max-w-5xl">
                <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            Table open
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">Game Lobby</h1>
                        <p className="mt-2 text-sm font-medium text-slate-400 sm:text-base">Invite your table, set the match length, then get everyone ready.</p>
                    </div>

                    <div className="flex self-start items-center gap-3 sm:self-auto">
                        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 shadow-xl backdrop-blur">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Room code</span>
                            <div className="mt-1 flex items-center gap-3">
                                <span className="font-mono text-2xl font-black tracking-[0.22em] text-amber-200">{safeRoomCode}</span>
                                <button
                                    className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${copied ? "bg-emerald-400/20 text-emerald-200" : "bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
                                    onClick={handleCopyCode}
                                >
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => onLeaveRoom(roomCode)}
                            className="rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-400 hover:bg-slate-800 hover:text-white"
                        >
                            Return Home
                        </button>
                    </div>
                </header>

                <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                    <div className="rounded-3xl border border-white/10 bg-slate-900/65 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-extrabold">Players</h2>
                                <p className="mt-1 text-sm text-slate-400">{safePlayers.length} of {MAX_PLAYERS} seats filled</p>
                            </div>
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">{safePlayers.filter((player) => player.isReady).length} ready</span>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {Array.from({ length: MAX_PLAYERS }, (_, index) => {
                                const player = safePlayers[index];

                                if (!player) {
                                    return (
                                        <div key={`empty-${index}`} className="flex min-h-24 items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/25 px-4 text-slate-500">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-xl">+</span>
                                            <span className="text-sm font-semibold">Waiting for player</span>
                                        </div>
                                    );
                                }

                                const isLocalPlayer = player.id === user?.id;
                                return (
                                    <div key={player.id} className={`flex min-h-24 items-center justify-between rounded-2xl border px-4 transition-colors ${player.isReady ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-slate-950/35"}`}>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate text-lg font-extrabold">{player.username}</span>
                                                {isLocalPlayer && <span className="rounded-full bg-amber-300/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200">You</span>}
                                            </div>
                                            <span className={`mt-1 block text-xs font-bold uppercase tracking-wider ${player.isReady ? "text-emerald-300" : "text-slate-500"}`}>{player.isReady ? "Ready" : "Not ready"}</span>
                                        </div>
                                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl font-black ${player.isReady ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-500"}`}>{player.isReady ? "✓" : index + 1}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <aside className="flex flex-col rounded-3xl border border-white/10 bg-slate-900/65 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Match setup</span>
                            <h2 className="mt-2 text-2xl font-extrabold">First to {safeRoundsToWin} round{safeRoundsToWin === 1 ? "" : "s"}</h2>
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                            {isHost ? (
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-200">Rounds needed to win</span>
                                    <select
                                        name="roundSettingSelect"
                                        id="num-rounds"
                                        value={safeRoundsToWin}
                                        onChange={(event) => onRoundsChange(Number(event.target.value))}
                                        className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-3 font-bold text-white outline-none transition focus:border-emerald-400"
                                    >
                                        {MATCH_ROUND_OPTIONS.map((roundCount) => <option key={roundCount} value={roundCount}>{roundCount} round{roundCount === 1 ? "" : "s"}</option>)}
                                    </select>
                                </label>
                            ) : (
                                <p className="text-sm leading-6 text-slate-300">The host has set this match to first to <strong className="text-amber-200">{safeRoundsToWin}</strong> round{safeRoundsToWin === 1 ? "" : "s"}.</p>
                            )}
                        </div>

                        <div className="mt-auto pt-6">
                            <button
                                className={`w-full rounded-xl px-4 py-3 font-extrabold transition-all ${isReady ? "border border-emerald-300 bg-emerald-400 text-slate-950 hover:bg-emerald-300" : "border border-slate-600 bg-slate-800 text-white hover:border-emerald-400 hover:bg-slate-700"}`}
                                onClick={onToggleReady}
                                disabled={!localPlayer}
                            >
                                {isReady ? "Ready — click to undo" : "Mark Ready"}
                            </button>

                            {isHost && (
                                <button
                                    className="mt-3 w-full rounded-xl border border-amber-300 bg-amber-300 px-4 py-3 font-extrabold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
                                    onClick={onStartMatch}
                                    disabled={!canStartMatch}
                                >
                                    Start Match
                                </button>
                            )}

                            <p className="mt-4 text-center text-xs font-medium leading-5 text-slate-500">The match can start once all four players have joined and marked themselves ready.</p>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    );
}
