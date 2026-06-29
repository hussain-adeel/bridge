import { useState } from 'react'
import PlayerHand from './components/PlayerHand';
import CardBack from './components/CardBack';
import OpponentHand from './components/OpponentHand';
import Bidding from './components/Bidding';

function App() {
  
const dummyHand = [
  // Spades
  { suit: "Spades", rank: "A" },
  { suit: "Spades", rank: "K" },
  { suit: "Spades", rank: "J" },
  { suit: "Spades", rank: "5" },
  // Hearts
  { suit: "Hearts", rank: "Q" },
  { suit: "Hearts", rank: "9" },
  { suit: "Hearts", rank: "4" },
  // Diamonds
  { suit: "Diamonds", rank: "A" },
  { suit: "Diamonds", rank: "10" },
  { suit: "Diamonds", rank: "3" },
  // Clubs
  { suit: "Clubs", rank: "K" },
  { suit: "Clubs", rank: "8" },
  { suit: "Clubs", rank: "2" }
];

  // 1. We create a fake function to act as our walkie-talkie
  const handleTestPlay = (card) => {
    console.log("BOOM! You played:", card);
  };

  return (
    // 2. A dark green background that pushes everything to the bottom center
  
    <div className="min-h-screen bg-green-800 grid items-end justify-center pb-20">
      {/* <CardBack teamColor={"red"}/> */}
      {/* 3. Pass the props! (Notice no 'e' on leadSuit, and we pass the function in) */}
      {/* <PlayerHand 
        cards={dummyHand} 
        leadSuit="Spades" 
        onPlayCard={handleTestPlay} 
      /> */}
      <Bidding isMyTurn={true}>
        
      </Bidding>
      <PlayerHand 
        cards={dummyHand} 
        leadSuit="Spades" 
        onPlayCard={handleTestPlay} 
        isMyTurn={false}
      />

    </div>
  );
}

export default App
