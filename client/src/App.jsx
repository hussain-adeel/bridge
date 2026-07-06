import { useState } from 'react'
import PlayerHand from './components/PlayerHand';
import CardBack from './components/CardBack';
import OpponentHand from './components/OpponentHand';
import Bidding from './components/Bidding';
import Card from './components/Card';
import MiddleStack from './components/MiddleStack';
import BridgeGameBoard from './components/BridgeGameBoard';

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

const playedCards = {
    bottom: { suit: 'Hearts', rank: 'A' }, 
    left: { suit: 'Spades', rank: 'K' },  
    top: { suit: 'Spades', rank: '10' },                             
    right: { suit: 'Spades', rank: '2' }                            
}

const mockGameState = {
  // Toggle between 'BIDDING' and 'PLAYING' to test your components
  gameStage: 'PLAYING', 
  roomCode: 'A23F',

  // player's cards
  hand: ["A-hearts, K-spades, 9-diamonds, 2-clubs, 3-hearts, 4-hearts, 9-clubs, 10-diamonds"],
  
  // Info for the Center Control Tower
  contract: {
    suit: 'Hearts',
    tricks: 4,
    calledBy: 'team'
  },

  scores: {
    team: 1,
    enemy: 3
  },
  
  // Info for the Header
  players: {
    north: { id: 'p1', name: 'Alice' },
    south: { id: 'p2', name: 'Bob' },
    east: { id: 'p3', name: 'Charlie' },
    west: { id: 'p4', name: 'David' }
  },

  // Info for the Board
  playingData: {
    cardsOnTable: [
      { suit: 'hearts', rank: 'A', playedBy: 'north' },
      { suit: 'hearts', rank: 'K', playedBy: 'east' }
    ]
  },

  // Bidding state for when stage === 'BIDDING'
  biddingData: {
    history: ['1H', 'Pass', '2H', 'Pass', '4H', 'Pass', 'Pass', 'Pass'],
    currentPlayer: 'south'
  }
};

  // 1. We create a fake function to act as our walkie-talkie
  const handleTestPlay = (card) => {
    console.log("BOOM! You played:", card);
  };

  return (
    <BridgeGameBoard gameState={mockGameState}></BridgeGameBoard>
  );
}

export default App
