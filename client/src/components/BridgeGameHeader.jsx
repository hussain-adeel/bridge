import bridgeLogo from "../assets/bridge_logo.svg";
import { GAME_PHASES, SUIT_SYMBOLS, TRICKS_PER_ROUND } from "../../../shared/gameConstants.js";

export default function BridgeGameHeader({ gamePhase, isMyTeamBid, tricksCalled, suitCalled, teamScore, enemyScore }) {
    const safeTricksCalled = tricksCalled ?? 0;
    const safeSuitCalled = suitCalled ?? "";
    const safeTeamScore = teamScore ?? 0;
    const safeEnemyScore = enemyScore ?? 0;
    const safeIsMyTeamBid = isMyTeamBid ?? false;
    const suitSymbol = SUIT_SYMBOLS[safeSuitCalled] ?? "";
    const headerVisibility = gamePhase === GAME_PHASES.BIDDING || gamePhase === GAME_PHASES.DEALING
        ? "opacity-0 pointer-events-none"
        : "opacity-100";

    const tricksNeededToWin = safeIsMyTeamBid
        ? safeTricksCalled
        : TRICKS_PER_ROUND + 1 - safeTricksCalled;
    const tricksLeft = tricksNeededToWin - safeTeamScore;
    const scoreText = `${tricksLeft} Tricks to Win`;

    const bidCallText = () => {
        if (safeTricksCalled === 0) return "No bid yet";
        return safeIsMyTeamBid ? "Your team called" : "Enemy team called";
    };

    return (
        <header className="w-full flex justify-center items-center pt-8 pb-6 xl:pb-0 px-8 xl:px-24 select-none">
            <div className="flex-1 text-left max-[400px]:text-center">
                <div className={`flex-col ${headerVisibility}`}>
                    <h2 className="text-[20px] lg:text-[30px] font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        SCORE:
                    </h2>
                    <h1 className="text-white text-5xl lg:text-[60px] font-extrabold tracking-tighter drop-shadow-md whitespace-nowrap">
                        <span className="text-friendly">{safeTeamScore}</span>
                        <span className="text-text-main mx-2">-</span>
                        <span className="text-enemy">{safeEnemyScore}</span>
                    </h1>
                    <h2 className="text-[20px] lg:text-[30px] max-[400px]:hidden font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        {scoreText}
                    </h2>
                </div>
            </div>

            <div className="flex flex-1 max-[700px]:hidden justify-center">
                <img src={bridgeLogo} alt="Bridge Game Logo" className="h-20 w-auto object-contain select-none drop-shadow-[0_0_8px_rgba(211,175,55,0.8)]" />
            </div>

            <div className="flex-1 text-right max-[400px]:text-center">
                <div className="flex-col">
                    <h2 className="text-[20px] lg:text-[30px] font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        BID:
                    </h2>
                    <h1 className="text-[#D3AF37] text-5xl lg:text-[60px] font-extrabold tracking-tighter drop-shadow-md whitespace-nowrap">
                        <span>{safeTricksCalled}</span> <span className="ml-1">{suitSymbol}</span>
                    </h1>
                    <h2 className="text-[20px] lg:text-[30px] font-extrabold tracking-tighter drop-shadow-md text-white whitespace-nowrap">
                        {bidCallText()}
                    </h2>
                </div>
            </div>
        </header>
    );
}
