import CardBack from "./CardBack";

export default function OpponentHand({numCards, dir, color}) {


    return (
        <div className={
            `flex items-center justify-center w-full h-40
            ${dir === "North" ? "rotate-180" : ""}
            ${dir === "East" ? "-rotate-90" : ""}
            ${dir === "West" ? "rotate-90" : ""}`
            }>
            <div className="flex -space-x-18 md:-space-x-16">
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