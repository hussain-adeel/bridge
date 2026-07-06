import { useState } from "react";
import Card from "./Card";

export default function MiddleStack({playedCards}) {

    const getRandomRotation = () => Math.random() * (30) - 30;

    return (
        <div className="relative h-64 w-64 mx-auto">
            {playedCards.left && (
                <div className="absolute top-1/2 left-4 -translate-y-1/2 rotate-90 z-10 transform" style={{transform: `rotate(${getRandomRotation()}deg)`}}>
                    <Card suit={playedCards.left.suit} rank={playedCards.left.rank}>
                    </Card>
                </div>
            )}
            {playedCards.top && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 rotate-180 z-20 tansform" style={{transform: `rotate(${getRandomRotation()}deg)`}}>
                    <Card suit={playedCards.top.suit} rank={playedCards.top.rank}>
                    </Card>
                </div>
            )}
            {playedCards.right && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2 -rotate-90 z-30 transform" style={{transform: `rotate(${getRandomRotation()}deg)`}}>
                    <Card suit={playedCards.right.suit} rank={playedCards.right.rank}>
                    </Card>
                </div>
            )}
            {playedCards.bottom && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 transform" style={{transform: `rotate(${getRandomRotation()}deg)`}}>
                    <Card suit={playedCards.bottom.suit} rank={playedCards.bottom.rank} />
                </div>
            )}
        </div>
    )

}