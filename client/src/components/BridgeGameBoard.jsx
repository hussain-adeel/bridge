import BridgeGameHeader from "./BridgeGameHeader";
import PlayerAvatar from "./PlayerAvatar";
import PlayerHand from "./PlayerHand";
import Bidding from "./Bidding";
import MiddleStack from "./MiddleStack";
import End from "./End";

export default function BridgeGameBoard({gameState, localUser}) {

    const rawIndex = gameState?.players?.findIndex(p => p.id === localUser.id);
    const myIndex = (rawIndex !== undefined && rawIndex !== -1) ? rawIndex : null;

    const getRelativePlayer = (offset) => {
        if (myIndex == null) return null;
        const targetIndex = (myIndex + offset) % 4;
        return gameState?.players?.find(p => p.index === targetIndex) ?? null;
    };

    const isTurn = (index) => { 
        if (index == null) return false;
        return gameState?.activePlayerIndex === index; 
    }
    
    const myTeamId = gameState?.players?.find(p => p.id === localUser.id)?.teamId ?? "";
    const enemyTeamId = myTeamId == "team_1" ? "team_2" : "team_1";

    const leftOpponent = getRelativePlayer(1);
    const partner = getRelativePlayer(2);
    const rightOpponent = getRelativePlayer(3);
    const self = gameState?.players?.find(p => p.index === myIndex) ?? "";

    const myCards = gameState?.hand ?? [];
    const leadSuit = gameState?.playingData?.ledSuit ?? "";

    const isMyTurn = isTurn(myIndex);
    const isMyTeamBid = gameState?.contract?.teamId === myTeamId;

    const tricksCalled = gameState?.contract?.tricks ?? 0;
    const suitCalled = gameState?.contract?.suit ?? "";
    const teamScore = gameState?.currentHandTricks?.[myTeamId] ?? 0;
    const enemyScore = gameState?.currentHandTricks?.[enemyTeamId] ?? 0;
    const tricksWon = gameState?.players?.find(p => p.index === myIndex)?.tricksWon ?? 0;
    const showEndScreen = (gameState?.gamePhase === "ROUND_END" || gameState?.gamePhase === "MATCH_END") ?? false;
    const teamWonRound = teamScore > enemyScore;
    const matchOver = gameState?.gamePhase === "MATCH_END" ?? false
    const teamMatchScore = gameState?.matchScore?.[myTeamId] ?? 0;
    const enemyMatchScore = gameState?.matchScore?.[enemyTeamId] ?? 0;
    const teamWonMatch = teamMatchScore > enemyMatchScore ?? false;




    return (
        <div className="relative w-full h-screen box-border bg-board-bg flex flex-col overflow-hidden">
            
            <BridgeGameHeader 
                gamePhase={gameState?.gamePhase}
                isMyTeamBid={isMyTeamBid}
                isMyTurn={isMyTurn}
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
                                isTurn={isTurn(partner?.index)}
                                gamePhase={gameState?.gamePhase}
                            />
                        </div>

                        <div className="col-start-1 row-start-2 flex justify-center items-center rotate-90 origin-center">
                            <PlayerAvatar 
                                player={leftOpponent} 
                                isTurn={isTurn(leftOpponent?.index)}
                                gamePhase={gameState?.gamePhase}
                            />
                        </div>

                        <div className="col-start-2 row-start-2 flex justify-center items-center">
                            {(gameState.gamePhase === "BIDDING" || gameState.gamePhase === "DEALING") ? ( 
                            <Bidding 
                                currSuit={gameState?.contract?.suit} 
                                currTricks={gameState?.contract?.tricks}  
                                gamePhase={gameState?.gamePhase}
                                round={gameState?.round}
                                isMyTurn={isMyTurn}
                                onBid={(bid) => console.log("Bid placed: ", bid)}
                                onPass={() => console.log("passed")}
                            /> 
                            ) : gameState.gamePhase === "PLAYING" ? (
                            <MiddleStack 
                                cardsOnTable={gameState.playingData?.cardsOnTable ?? []} 
                                myIndex={myIndex}
                            />
                            ) : (
                            <End
                                teamWonRound={teamWonRound}
                                teamRoundScore={teamScore}
                                enemyRoundScore={enemyScore}
                                matchOver={matchOver}
                                teamWonMatch={teamWonMatch}
                                teamMatchScore={teamMatchScore}
                                enemyMatchScore={enemyMatchScore}
                                onReturnToLobby={() => console.log("Return to lobby")}
                            />
                            )
                        }
                        </div>

                        <div className="col-start-3 row-start-2 flex justify-center items-center -rotate-90 origin-center">
                            <PlayerAvatar 
                                player={rightOpponent} 
                                isTurn={isTurn(rightOpponent?.index)}
                                gamePhase={gameState?.gamePhase}
                            />
                        </div>

                        <div className="col-start-2 row-start-3 flex flex-col justify-end items-center pb-4">
                            <PlayerHand 
                                cards={myCards} 
                                leadSuit={leadSuit} 
                                onPlayCard={(card) => console.log("Played", card)} 
                                gamePhase={gameState?.gamePhase}
                                isMyTurn={isMyTurn} 
                                tricksWon={tricksWon}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
