import { useState } from "react";
import { useParams } from "react-router-dom";
import { GAME_PHASES, RANKS, SUITS } from "../../../shared/gameConstants.js";
import Card from "./Card";
import { useGameActions } from "../hooks/useGameActions.js";

export default function PlayerHand({ cards, leadSuit, gamePhase, isMyTurn, tricksWon }) {
    const [selectedCard, setSelectedCard] = useState(null);
    const { code: roomCode } = useParams();
    const { onPlayCard } = useGameActions(roomCode);
    const safeCards = cards ?? [];
    const safeLeadSuit = leadSuit ?? "";
    const safeIsMyTurn = isMyTurn ?? false;
    const safeTricksWon = tricksWon ?? 0;

    const normalizeSuit = (suit) => String(suit ?? "").toLowerCase();
    const getCardValue = (card) => {
        const suitValue = SUITS.length - SUITS.findIndex((suit) => normalizeSuit(suit) === normalizeSuit(card.suit));
        const rankValue = RANKS.indexOf(card.rank) + 1;
        return suitValue * RANKS.length + rankValue;
    };

    const sortedCards = [...safeCards].sort((cardA, cardB) => getCardValue(cardB) - getCardValue(cardA));

    const isCardPlayable = (card) => {
        if (!safeIsMyTurn || gamePhase !== GAME_PHASES.PLAYING) return false;
        const hasLeadSuit = safeLeadSuit && safeCards.some((playerCard) => normalizeSuit(playerCard.suit) === normalizeSuit(safeLeadSuit));
        if (hasLeadSuit) return normalizeSuit(card.suit) === normalizeSuit(safeLeadSuit);

        // Once another player has led the trick, a player who is void in the
        // lead suit may discard any card, including an unbroken trump card.
        return true;
    };

    const handlePlay = () => {
        if (selectedCard === null) return;
        const selectedCardId = sortedCards[selectedCard]?.id;
        if (!selectedCardId) return;
        onPlayCard(selectedCardId);
        setSelectedCard(null);
    };

    const handText = () => {
        if (gamePhase !== GAME_PHASES.PLAYING) return "";
        return safeIsMyTurn ? "Your turn!" : `You've made ${safeTricksWon} tricks.`;
    };

    return (
        <div className="relative flex min-h-50 w-full flex-col items-center justify-end">
            <div className="mb-3 flex h-7 items-center justify-center">
                <h1 className={`flex ${safeIsMyTurn ? "text-text-main" : "text-white"} font-extrabold font-mono select-none`}>
                    {handText()}
                </h1>
            </div>
            <div className="flex flex-row justify-center items-end h-40">
                {sortedCards.map((singleCard, index) => {
                    const isNewSuit = index > 0 && normalizeSuit(singleCard.suit) !== normalizeSuit(sortedCards[index - 1].suit);
                    const isSelected = selectedCard === index;
                    const isPlayable = isCardPlayable(singleCard);
                    return (
                        <div
                            key={singleCard.id ?? `${singleCard.suit}-${singleCard.rank}-${index}`}
                            className={`first:ml-0 delay-100 transition-transform duration-300 rounded-lg ${isNewSuit ? "-ml-8" : "-ml-12"} ${isSelected ? "-translate-y-8 shadow-2xl ring-3 ring-red-500" : ""} ${!isPlayable ? "brightness-80 cursor-not-allowed pointer-events-none" : ""} ${!isSelected && isPlayable ? "cursor-pointer bg-white hover:-translate-y-6 hover:shadow-2xl hover:z-0" : ""}`}
                            onClick={() => setSelectedCard(isSelected ? null : index)}
                        >
                            <Card suit={singleCard.suit} rank={singleCard.rank} />
                        </div>
                    );
                })}
            </div>

            <button
                onClick={handlePlay}
                disabled={selectedCard === null || !safeIsMyTurn}
                className={`m-10 px-10 py-3 text-white bg-black rounded-full font-bold select-none hover:text-black hover:bg-amber-50 hover:cursor-pointer disabled:opacity-50 disabled:bg-black disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white ${gamePhase !== GAME_PHASES.PLAYING ? "hidden" : ""}`}
            >
                PLAY
            </button>
        </div>
    );
}
