import { useState } from "react";
import BridgeGameHeader from "./BridgeGameHeader";
import OpponentHand from "./OpponentHand";
import PlayerAvatar from "./PlayerAvatar";
import PlayerHand from "./PlayerHand";
import Bidding from "./Bidding";
import MiddleStack from "./MiddleStack";

export default function BridgeGameBoard({gameState, localUser}) {

    const myIndex = gameState.players.findIndex(p => p.id === localUser.id);

    const getRelativePlayer = (offset) => {
        const targetIndex = (myIndex + offset) % 4;
        return gameState.players.find(p => p.index === targetIndex);
    };

    const leftOpponent = getRelativePlayer(1);
    const partner = getRelativePlayer(2);
    const rightOpponent = getRelativePlayer(3);
    const self = gameState.players.find(p => p.index === myIndex);

    const isTurn = (index) => gameState.activePlayerIndex === index;

    const myCards = gameState.hand;
    const leadSuit = gameState.playingData.ledSuit;

    const isMyTurn = isTurn(myIndex);


    return (
        <div className="w-full h-screen box-border bg-board-bg flex flex-col overflow-hidden">
            
            <BridgeGameHeader gameState={gameState} localUser={localUser} myIndex={myIndex} />
            
            <div className="grow w-full overflow-auto flex flex-col">
                
                <div className="flex-1 flex min-w-max items-center justify-center p-2 md:p-4">
                    
                    <div className="w-full min-h-125 grid grid-cols-[minmax(30px,150px)_1fr_minmax(30px,150px)] md:gap-4 max-w-7xl transition-all duration-500">

                        <div className="col-start-2 row-start-1 flex justify-center items-center">
                            <PlayerAvatar player={partner} isTurn={isTurn(partner?.index)} />
                        </div>

                        <div className="col-start-1 row-start-2 flex justify-center items-center rotate-90 origin-center">
                            <PlayerAvatar player={leftOpponent} isTurn={isTurn(leftOpponent?.index)} />
                        </div>

                        <div className="col-start-2 row-start-2 flex justify-center items-center">
                            <MiddleStack cardsOnTable={gameState.playingData.cardsOnTable} myIndex={myIndex}></MiddleStack>
                        </div>

                        <div className="col-start-3 row-start-2 flex justify-center items-center -rotate-90 origin-center">
                            <PlayerAvatar player={rightOpponent} isTurn={isTurn(rightOpponent?.index)} />
                        </div>

                        <div className="col-start-2 row-start-3 flex flex-col justify-end items-center pb-4">
                            <PlayerHand 
                                cards={myCards} 
                                leadSuit={leadSuit} 
                                isMyTurn={isMyTurn} 
                                tricksWon={10}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
