export default function Card({rank, suit, onClick, isPlayable = true, isSelected = false}) {
    const isRed = suit == 'Hearts' || suit == 'Diamonds';

    const suitSymbols = {
    'Spades': '♠',
    'Hearts': '♥',
    'Clubs': '♣',
    'Diamonds': '♦'
    }

    return (
        <div 
            onClick={onClick}
            className={`w-20 h-32 rounded-lg shadow-xl border border-gray-200
                flex flex-col justify-between p2 select-none
                transition-transform duration-200
                
                ${isSelected ? '-translate-y-8 shadow-2xl ring-4 ring-blue-500 z-30 bg-blue-50' : ''}
                
                ${!isSelected && isPlayable ? 'cursor-pointer bg-white hover:-translate-y-4 hover:shadow-2xl hover:z-20' : ''}

                ${!isPlayable ? 'bg-gray-300 opacity-50 cursor-not-allowed greyscale' : ''}

                ${isRed ? 'text-red-600' : 'text-gray-900'}
            `}
        >
            <div className="flex flex-col items-center leading-none self-start">
                <span className="font-bold text-lg">{rank}</span>
                <span className="font-bold text-lg">{suitSymbols[suit]}</span>
            </div>

            <div className="flex flex-col items-center leading-none self-end rotate-180">
                <span className="font-bold text-lg">{rank}</span>
                <span className="font-bold text-lg">{suitSymbols[suit]}</span>
            </div>
        </div>
    )
}