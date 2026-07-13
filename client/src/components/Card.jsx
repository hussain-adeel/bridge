export default function Card({rank, suit}) {
    const isRed = suit == 'hearts' || suit == 'diamonds';

    const suitSymbols = {
    'spades': '♠',
    'hearts': '♥',
    'clubs': '♣',
    'diamonds': '♦'
    }

                // ${isSelected ? 'hover:-translate-y-8 shadow-2xl ring-3 ring-red-500' : ''}
                
                // ${!isSelected && isPlayable ? 'cursor-pointer bg-white hover:-translate-y-6 hover:shadow-2xl hover:z-0' : ''}

                // ${!isPlayable ? 'bg-gray-300 opacity-50 cursor-not-allowed greyscale' : ''}

    return (
        <div 
            className={`w-20 h-32 rounded-lg shadow-xl border border-gray-300
                flex flex-col justify-between p-1 select-none bg-white overflow-hidden relative
                
                ${isRed ? 'text-red-600' : 'text-gray-900'}

            `}
        >
            <div className="flex flex-col items-center leading-none self-start p-1">
                <span className="top-3 left-4 font-bold text-lg">{rank}</span>
                <span className="font-bold text-lg -mt-2">{suitSymbols[suit]}</span>
            </div>

            <div className="flex flex-col  items-center leading-none self-end rotate-180 p-1">
                <span className="font-bold text-lg">{rank}</span>
                <span className="font-bold text-lg -mt-2">{suitSymbols[suit]}</span>
            </div>
        </div>
    );
}