import { useAuth } from "../hooks/useAuth";
import BridgeGameHeader from "./BridgeGameHeader";
import PlayerAvatar from "./PlayerAvatar";
import PlayerHand from "./PlayerHand";
import Bidding from "./Bidding";
import MiddleStack from "./MiddleStack";
import End from "./End";
import { DEAL_CARD_COUNTS, GAME_PHASES, MAX_PLAYERS, TEAM_IDS } from "../../../shared/gameConstants.js";

export default function BridgeGameBoard({
    gameState,
    players,
}) {
    const { user } = useAuth();
    const safePlayers = players ?? [];
    const localPlayer = safePlayers.find((player) => player.id === user?.id) ?? null;
    const disconnectedPlayers = safePlayers.filter((player) => player.isConnected === false);
    const myIndex = localPlayer?.index ?? null;
    const myTeamId = localPlayer?.teamId ?? null;
    const enemyTeamId = myTeamId === TEAM_IDS.ONE ? TEAM_IDS.TWO : TEAM_IDS.ONE;

    const getRelativePlayer = (offset) => {
        if (myIndex === null) return null;
        const targetIndex = (myIndex + offset) % MAX_PLAYERS;
        return safePlayers.find((player) => player.index === targetIndex) ?? null;
    };

    const isTurn = (index) => index !== null && gameState.activePlayerIndex === index;
    const leftOpponent = getRelativePlayer(1);
    const partner = getRelativePlayer(2);
    const rightOpponent = getRelativePlayer(3);
    const myCards = gameState.hand ?? [];
    const leadSuit = gameState.playingData?.ledSuit ?? "";
    const isMyTurn = isTurn(myIndex);
    const isMyTeamBid = gameState.contract?.teamId === myTeamId;
    const tricksCalled = gameState.contract?.tricks ?? 0;
    const suitCalled = gameState.contract?.suit ?? "";
    const teamScore = gameState.currentHandTricks?.[myTeamId] ?? 0;
    const enemyScore = gameState.currentHandTricks?.[enemyTeamId] ?? 0;
    const tricksWon = myIndex === null ? 0 : gameState.playerTricks?.[myIndex] ?? 0;
    const isRoundOrMatchEnd = gameState.gamePhase === GAME_PHASES.ROUND_END || gameState.gamePhase === GAME_PHASES.MATCH_END;
    const matchOver = gameState.gamePhase === GAME_PHASES.MATCH_END;
    const teamMatchScore = gameState.matchScore?.[myTeamId] ?? 0;
    const enemyMatchScore = gameState.matchScore?.[enemyTeamId] ?? 0;
    const cardsInCurrentDeal = DEAL_CARD_COUNTS[gameState.dealNumber] ?? 0;
    const isGamePaused = disconnectedPlayers.length > 0;

    return (
        <div className="relative w-full h-screen box-border bg-board-bg flex flex-col overflow-hidden">
            <BridgeGameHeader
                gamePhase={gameState.gamePhase}
                isMyTeamBid={isMyTeamBid}
                tricksCalled={tricksCalled}
                suitCalled={suitCalled}
                teamScore={teamScore}
                enemyScore={enemyScore}
            />

            <div className="grow w-full overflow-auto flex flex-col">
                <div className="flex-1 flex min-w-max items-center justify-center p-2 md:p-4">
                    <div className="w-full min-h-125 grid grid-cols-[minmax(30px,150px)_1fr_minmax(30px,150px)] md:gap-4 max-w-7xl transition-all duration-500">
                        <div className="col-start-2 row-start-1 flex justify-center items-center">
                            <PlayerAvatar
                                player={partner}
                                isTurn={isTurn(partner?.index ?? null)}
                                gamePhase={gameState.gamePhase}
                                tricksWon={gameState.playerTricks?.[partner?.index] ?? 0}
                            />
                        </div>

                        <div className="col-start-1 row-start-2 flex justify-center items-center rotate-90 origin-center">
                            <PlayerAvatar
                                player={leftOpponent}
                                isTurn={isTurn(leftOpponent?.index ?? null)}
                                gamePhase={gameState.gamePhase}
                                tricksWon={gameState.playerTricks?.[leftOpponent?.index] ?? 0}
                            />
                        </div>

                        <div className="col-start-2 row-start-2 flex justify-center items-center">
                            {gameState.gamePhase === GAME_PHASES.BIDDING ? (
                                <Bidding
                                    key={`${gameState.gamePhase}-${gameState.auctionNumber}-${gameState.activePlayerIndex}`}
                                    currSuit={gameState.contract?.suit}
                                    currTricks={gameState.contract?.tricks}
                                    gamePhase={gameState.gamePhase}
                                    auctionNumber={gameState.auctionNumber}
                                    isMyTurn={isMyTurn && !isGamePaused}
                                />
                            ) : gameState.gamePhase === GAME_PHASES.PLAYING ? (
                                <MiddleStack cardsOnTable={gameState.playingData?.cardsOnTable ?? []} myIndex={myIndex} />
                            ) : gameState.gamePhase === GAME_PHASES.DEALING ? (
                                <div className="w-full max-w-md flex flex-col items-center gap-2 mx-auto bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-600 text-white select-none">
                                    <span className="font-extrabold text-3xl">DEALING CARDS...</span>
                                    <span className="text-slate-300">{cardsInCurrentDeal} cards per player</span>
                                </div>
                            ) : isRoundOrMatchEnd ? (
                                <End
                                    key={`${gameState.gamePhase}-${gameState.roundEndsAt ?? ""}`}
                                    myTeamId={myTeamId}
                                    roundWinnerTeamId={gameState.roundWinnerTeamId}
                                    matchWinnerTeamId={gameState.matchWinnerTeamId}
                                    roundEndsAt={gameState.roundEndsAt}
                                    teamRoundScore={teamScore}
                                    enemyRoundScore={enemyScore}
                                    matchOver={matchOver}
                                    teamMatchScore={teamMatchScore}
                                    enemyMatchScore={enemyMatchScore}
                                />
                            ) : null}
                        </div>

                        <div className="col-start-3 row-start-2 flex justify-center items-center -rotate-90 origin-center">
                            <PlayerAvatar
                                player={rightOpponent}
                                isTurn={isTurn(rightOpponent?.index ?? null)}
                                gamePhase={gameState.gamePhase}
                                tricksWon={gameState.playerTricks?.[rightOpponent?.index] ?? 0}
                            />
                        </div>

                        <div className="col-start-2 row-start-3 flex flex-col justify-end items-center pb-4">
                            <PlayerHand
                                cards={myCards}
                                leadSuit={leadSuit}
                                gamePhase={gameState.gamePhase}
                                isMyTurn={isMyTurn && !isGamePaused}
                                tricksWon={tricksWon}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isGamePaused && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-6 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-amber-300/30 bg-slate-900 p-8 text-center shadow-2xl">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-3xl text-amber-300">
                            {"\u23F8"}
                        </div>
                        <h1 className="mt-5 text-3xl font-extrabold text-white">Game Paused</h1>
                        <p className="mt-3 text-slate-300">
                            The match will continue once every disconnected player reconnects.
                        </p>
                        <div className="mt-5 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-left">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Disconnected players</span>
                            <ul className="mt-2 space-y-1 text-sm font-semibold text-red-300">
                                {disconnectedPlayers.map((player) => <li key={player.id}>{player.username}</li>)}
                            </ul>
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-amber-200">
                            <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
                            Waiting for reconnection
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
