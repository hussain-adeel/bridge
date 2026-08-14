import { SUIT_SYMBOLS, SUITS } from "../../../shared/gameConstants.js";

export default function Card({ rank, suit }) {
    const normalizedSuit = SUITS.find((value) => value.toLowerCase() === String(suit ?? "").toLowerCase());
    const isRed = normalizedSuit === "Hearts" || normalizedSuit === "Diamonds";
    const symbol = SUIT_SYMBOLS[normalizedSuit] ?? "";

    return (
        <div className={`w-20 h-32 rounded-lg shadow-xl border border-gray-300 flex flex-col justify-between p-1 select-none bg-white overflow-hidden relative ${isRed ? "text-red-600" : "text-gray-900"}`}>
            <div className="flex flex-col items-center leading-none self-start p-1">
                <span className="top-3 left-4 font-bold text-lg">{rank}</span>
                <span className="font-bold text-lg -mt-2">{symbol}</span>
            </div>

            <div className="flex flex-col items-center leading-none self-end rotate-180 p-1">
                <span className="font-bold text-lg">{rank}</span>
                <span className="font-bold text-lg -mt-2">{symbol}</span>
            </div>
        </div>
    );
}
