import { useMemo } from "react";
import Card from "./Card";
import { MAX_PLAYERS } from "../../../shared/gameConstants.js";

export default function MiddleStack({ cardsOnTable, myIndex }) {
    const playedCards = useMemo(() => {
        const positions = { bottom: null, left: null, right: null, top: null };
        const safeCardsOnTable = cardsOnTable ?? [];

        if (myIndex === null || myIndex === undefined) return positions;

        safeCardsOnTable.forEach((card) => {
            const offset = (card.playerIndex - myIndex + MAX_PLAYERS) % MAX_PLAYERS;
            if (offset === 0) positions.bottom = card;
            if (offset === 1) positions.left = card;
            if (offset === 2) positions.top = card;
            if (offset === 3) positions.right = card;
        });

        return positions;
    }, [cardsOnTable, myIndex]);

    if (myIndex === null || myIndex === undefined) return null;

    const getStableRotation = (card) => {
        const hash = card.suit.length + card.rank.length + card.playerIndex;
        return (hash * 7) % 30 - 15;
    };

    return (
        <div className="relative h-64 w-64 mx-auto">
            {playedCards.left && (
                <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 transform" style={{ transform: `rotate(${90 + getStableRotation(playedCards.left)}deg)` }}>
                    <Card suit={playedCards.left.suit} rank={playedCards.left.rank} />
                </div>
            )}
            {playedCards.top && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 transform" style={{ transform: `rotate(${180 + getStableRotation(playedCards.top)}deg)` }}>
                    <Card suit={playedCards.top.suit} rank={playedCards.top.rank} />
                </div>
            )}
            {playedCards.right && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2 z-30 transform" style={{ transform: `rotate(${-90 + getStableRotation(playedCards.right)}deg)` }}>
                    <Card suit={playedCards.right.suit} rank={playedCards.right.rank} />
                </div>
            )}
            {playedCards.bottom && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 transform" style={{ transform: `rotate(${getStableRotation(playedCards.bottom)}deg)` }}>
                    <Card suit={playedCards.bottom.suit} rank={playedCards.bottom.rank} />
                </div>
            )}
        </div>
    );
}
