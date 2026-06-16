import CardBack from "./CardBack";

/*
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
*/

export default function OpponentHand({numCards, dir, color}) {


    return (
        <div className={
            `flex items-center justify-center h-40
            ${dir === "North" ? "rotate-180" : ""}
            ${dir === "East" ? "rotate-270" : ""}
            ${dir === "West" ? "rotate-90" : ""}`
            }>
            <div className="flex -space-x-15">
                {Array(numCards).fill(null).map((_, index) => (
                    <CardBack
                        key={index}
                        color={color}
                    />
                ))}
            </div>
        </div>
    )
}