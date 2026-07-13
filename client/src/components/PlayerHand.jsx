import { useState } from "react";
import Card from "./Card";

export default function PlayerHand({cards, leadSuit, onPlayCard, gamePhase, isMyTurn, tricksWon}) {

    const [selectedCard, setSelectedCard] = useState(null);

    const safeCards = cards ?? [];
    const safeLeadSuit = leadSuit ?? "";
    const safeGamePhase = gamePhase ?? "LOADING";
    const safeIsMyTurn = isMyTurn ?? false;
    const safeTricksWon = tricksWon ?? 0;

    // handle 'play' button click using onPlayCard function
    const handlePlay = () => {
        const playedCard = sortedCards[selectedCard];
        onPlayCard(playedCard);
        setSelectedCard(null);
    }

    const handleCardClick = (index) => {
        if (selectedCard == index) setSelectedCard(null)
        else setSelectedCard(index)
    }

    const calculatePoints = (card) => {
        let points = 0
        
        switch (card.suit) {
            case 'spades':
                points += 400
                break
            case 'hearts':
                points += 300
                break
            case 'clubs':
                points += 200
                break
            case 'diamonds':
                points += 100
                break
        }

        switch (card.rank) {
            case 'A':
                points += 13
                break
            case 'K':
                points += 12
                break
            case 'Q':
                points += 11
                break
            case 'J':
                points += 10
                break
            case '10':
                points += 9
                break
            case '9':
                points += 8
                break
            case '8':
                points += 7
                break
            case '7':
                points += 6
                break
            case '6':
                points += 5
                break
            case '5':
                points += 4
                break
            case '4':
                points += 3
                break
            case '3':
                points += 2
                break
            case '2':
                points += 1
                break
        }

        return points
    }

    const isCardPlayable = (card) => {
        if (!safeIsMyTurn || safeGamePhase !== "PLAYING") return false;
        const hasLeadSuit = cards.some(card => card.suit ==  safeLeadSuit)

        if (hasLeadSuit) {
            if (card.suit == safeLeadSuit) return true;
        }
        else return true;
    }

    const sortedCards = [...safeCards].sort((cardA, cardB) => {
        const cardAPoints = calculatePoints(cardA)
        const cardBPoints = calculatePoints(cardB)

        return cardBPoints - cardAPoints
    })

    const handText = () => {
        if (safeGamePhase === "PLAYING") {
            if (safeIsMyTurn) return "Your turn!"
            else return `You've made ${safeTricksWon} hands.`;
        }
        return ""
    }



    return (
        <div className="w-full min-h-50 flex flex-col items-center justify-end relative">
            <h1 className={`flex ${isMyTurn ? 'text-text-main' : 'text-white'} font-extrabold font-mono select-none`}>{handText()}</h1>
            <div className="flex flex-row justify-center items-end h-40">
                {sortedCards.map((singleCard, index) => {
                    const isNewSuit = index > 0 && singleCard.suit != sortedCards[index-1].suit
                    const isSelected = selectedCard === index;
                    const isPlayable = isCardPlayable(singleCard);
                    return (
                        <div 
                            key={index}
                            className={`
                                first:ml-0 delay-100 transition-transform duration-300 rounded-lg

                                ${isNewSuit ? '-ml-8' : '-ml-12'}
                                ${isSelected ? '-translate-y-8 shadow-2xl ring-3 ring-red-500' : ''}
                                ${!isPlayable ? 'brightness-80 cursor-not-allowed pointer-events-none' : ''}
                                ${!isSelected && isPlayable ? 'cursor-pointer bg-white hover:-translate-y-6 hover:shadow-2xl hover:z-0' : ''}

                            `}
                            onClick={() => handleCardClick(index)}
                        >
                        <Card
                            key={index}
                            suit={singleCard.suit}
                            rank={singleCard.rank}
                        /> 
                        </div>
                    )
                })}
            </div>

            <button 
                onClick={handlePlay}
                disabled={selectedCard === null || !isMyTurn}
                className={`
                            m-10 px-10 py-3 text-white bg-black rounded-full font-bold select-none
                            hover:text-black hover:bg-amber-50 hover:cursor-pointer
                            disabled:opacity-50 disabled:bg-black disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white
                            ${safeGamePhase !== "PLAYING" ? "hidden" : ""}
                `}
            >
                PLAY  
            </button>
        </div>
    )

}