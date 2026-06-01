import { useState } from "react";
import Card from "./Card";

export default function PlayerHand({cards, leadSuit, onPlayCard}) {

    const [selectedCard, setSelectedCard] = useState(null);

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
            case 'Spades':
                points += 400
                break
            case 'Hearts':
                points += 300
                break
            case 'Clubs':
                points += 200
                break
            case 'Diamonds':
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

    const sortedCards = [...cards].sort((cardA, cardB) => {
        const cardAPoints = calculatePoints(cardA)
        const cardBPoints = calculatePoints(cardB)

        return cardBPoints - cardAPoints
    })

    return (
        <div className="w-full min-h-[200px] flex flex-col items-center justify-end relative">
            <div className="flex flex-row justify-center items-end h-40">
                {sortedCards.map((singleCard, index) => {
                    const isNewSuit = index > 0 && singleCard.suit != sortedCards[index-1].suit

                    return (
                        <div 
                            key={index}
                            className={`
                                first:ml-0
                                ${isNewSuit ? '-ml-8' : '-ml-12'}
                            `}>
                        <Card
                            key={index}
                            suit={singleCard.suit}
                            rank={singleCard.rank}
                            isSelected={selectedCard === index}
                            onClick={() => handleCardClick(index)}
                        /> 
                        </div>
                    )
                })}
            </div>

            <button 
                onClick={handlePlay}
                disabled={selectedCard === null}
                className="m-10 px-10 py-3 text-white bg-black hover:text-black rounded-full font-bold hover:bg-amber-50 hover:cursor-pointer"
            >
                PLAY  
            </button>
        </div>
    )

}