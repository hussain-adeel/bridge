
export default function GameRules() {
    return (
        <div className="w-full max-h-[70vh] overflow-y-auto overscroll-contain pr-2 pb-8">
            <div className="flex flex-col items-center p-4 md:p-6 text-center text-neutral-300">
                <h1 className="text-white font-bold text-4xl md:text-5xl mb-6 drop-shadow-md">Game Rules</h1>  
                
                <p className="max-w-5xl mx-auto mb-10 text-lg leading-relaxed">
                    Bridge is a card game played by four players divided into two partnerships. Partners sit directly across from one another. The objective is to win the right to name the <strong className="text-white">"trump"</strong> suit by bidding, and then to successfully capture the number of tricks promised in that bid.
                </p>

                <h2 className="text-white font-semibold text-2xl mb-4 mt-4">
                    Phase 1: The Deal & The Auction
                </h2>
                <p className="max-w-5xl mx-auto mb-6">
                    The game begins with a multi-step dealing and bidding process to determine the <strong className="text-white">"contract."</strong> A contract consists of a target number of tricks and a designated trump suit.
                </p>
                
                <ul className="list-decimal list-inside space-y-3 mb-12 text-left max-w-5xl mx-auto bg-neutral-900/60 p-6 rounded-2xl border border-neutral-700/50 shadow-lg">
                    <li><strong className="text-white">The First Deal:</strong> Each player is dealt 5 cards.</li>
                    <li><strong className="text-white">The Opening Auction:</strong> A player is selected at random to open the bidding. 
                        <ul className="list-disc list-inside ml-8 mt-2 space-y-2 text-sm text-neutral-400">
                            <li>A bid must declare a trump suit and a total number of tricks the team commits to winning.</li>
                            <li>The minimum allowed opening bid is <strong className="text-white">6 tricks</strong>.</li>
                            <li>Play proceeds clockwise. Each subsequent player may either pass or make a higher bid.</li>
                        </ul>
                    </li>
                    <li><strong className="text-white">The Second Deal:</strong> Once the first auction concludes, each player is dealt 4 additional cards (bringing their total to 9 cards).</li>
                    <li><strong className="text-white">The Second Auction:</strong> A new auction commences, initiated by the player who held the highest bid in the first auction.</li>
                    <li><strong className="text-white">The Final Deal:</strong> Upon the conclusion of the second auction, the highest bid becomes the official contract. The player who made this bid is declared the <strong className="text-white">Declarer</strong>. Each player is then dealt their final 4 cards, resulting in a complete set of 13 cards per player.</li>
                </ul>

                <h2 className="text-white font-semibold text-2xl mb-4 mt-8">
                    Phase 2: The Play (Taking Tricks)
                </h2>
                <p className="max-w-5xl mx-auto mb-6">
                    The game is played in a series of tricks, where each player contributes one card face-up to the center of the table.
                </p>
                
                <ul className="list-decimal list-inside space-y-3 mb-12 text-left max-w-5xl mx-auto bg-neutral-900/60 p-6 rounded-2xl border border-neutral-700/50 shadow-lg">
                    <li><strong className="text-white">The Lead:</strong> The Declarer (the player who won the final bid) plays the first card. They may lead with any of their cards. The suit of this card becomes the <strong className="text-white">"lead suit"</strong> for that trick.</li>
                    <li><strong className="text-white">Following Suit:</strong> Play continues clockwise. If a player holds a card in the lead suit, they <strong className="text-white">must</strong> play it. This is called "following suit."</li>
                    <li><strong className="text-white">Discarding and Trumping:</strong> If a player does not have any cards in the lead suit (they are "void"), they may play any of their remaining cards.
                        <ul className="list-disc list-inside ml-8 mt-2 space-y-2 text-sm text-neutral-400">
                            <li>If they play a card from the designated <strong className="text-white">trump suit</strong>, this is called "trumping."</li>
                            <li>If they play a card from any other suit, it is considered a "discard" and cannot win the trick.</li>
                        </ul>
                    </li>
                    <li><strong className="text-white">Winning the Trick:</strong> Once all four players have played a card, the trick is evaluated:
                        <ul className="list-disc list-inside ml-8 mt-2 space-y-2 text-sm text-neutral-400">
                            <li>If no trump cards were played, the highest-ranking card of the <strong className="text-white">lead suit</strong> wins the trick.</li>
                            <li>If one or more trump cards were played, the highest-ranking <strong className="text-white">trump card</strong> wins the trick, regardless of the lead suit.</li>
                        </ul>
                    </li>
                    <li><strong className="text-white">Subsequent Tricks:</strong> The player who wins the trick gathers the cards for their team and leads the first card for the next trick.</li>
                </ul>

                <h2 className="text-white font-semibold text-2xl mb-4 mt-8">
                    Phase 3: Match Resolution
                </h2>
                <p className="max-w-5xl mx-auto mb-6">
                    This variant utilizes a sudden-death resolution. The game ends immediately the moment one of two conditions is met:
                </p>

                <ul className="space-y-4 mb-4 text-left max-w-5xl mx-auto">
                    <li className="bg-green-950/40 border border-green-700/50 p-5 rounded-2xl shadow-lg">
                        <strong className="text-green-400 block mb-2 text-lg">The Declarer's Team Wins:</strong> 
                        The Declarer and their partner successfully win enough tricks to equal their bid. The game ends instantly in their victory.
                    </li>
                    <li className="bg-red-950/40 border border-red-700/50 p-5 rounded-2xl shadow-lg">
                        <strong className="text-red-400 block mb-2 text-lg">The Defending Team Wins:</strong> 
                        The defending partnership wins enough tricks to make it mathematically impossible for the Declarer to reach their required bid amount. The game ends instantly in the defenders' victory.
                    </li>
                </ul>
            </div>
        </div>
    )
}
