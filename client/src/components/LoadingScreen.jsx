export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 overflow-hidden bg-board-bg flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/50 to-black/90" />
            <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-32 -right-24 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl animate-pulse" />

            <div className="relative w-full max-w-sm flex flex-col items-center rounded-3xl border border-white/10 bg-neutral-900/70 px-8 py-10 shadow-2xl backdrop-blur-xl">
                <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-amber-300/20" />
                    <div className="absolute inset-2 rounded-full border-2 border-t-amber-300 border-r-emerald-300 border-b-transparent border-l-transparent animate-spin" />
                    <div className="flex h-14 w-12 items-center justify-center rounded-lg border border-white/20 bg-linear-to-br from-neutral-700 to-neutral-950 text-2xl text-amber-300 shadow-lg">
                        {"\u2660"}
                    </div>
                </div>

                <h1 className="text-2xl font-black tracking-tight text-white">Setting the table</h1>
                <p className="mt-2 text-center text-sm font-medium text-neutral-400">Syncing the latest game state</p>

                <div className="mt-7 flex items-center gap-3 text-lg">
                    <span className="text-white/50 animate-pulse">{"\u2660"}</span>
                    <span className="text-red-400/70 animate-pulse [animation-delay:150ms]">{"\u2665"}</span>
                    <span className="text-red-400/70 animate-pulse [animation-delay:300ms]">{"\u2666"}</span>
                    <span className="text-white/50 animate-pulse [animation-delay:450ms]">{"\u2663"}</span>
                </div>
            </div>
        </div>
    );
}
