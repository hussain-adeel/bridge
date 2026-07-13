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

const localUser = {
  username: 'Alice',
  id: 'socket_1'
}

const mockGameState = {
  // --- 1. GAME META ---
  roomCode: 'A23F',
  gamePhase: 'PLAYING',
  round: 1, 
  activePlayerIndex: 0, // It is Char's turn

  // --- 2. TEAMS (Objective Server Data) ---
  // No color data here! Just abstract team identifiers and optional display names.
  teams: {
    'team_1': { name: 'Alpha' },
    'team_2': { name: 'Bravo' }
  },

  // --- 3. ROSTER (Clockwise Order) ---
  players: [
    { id: 'socket_1', index: 0, username: 'Alice', teamId: 'team_1', cardCount: 12 }, 
    { id: 'socket_2', index: 1, username: 'Bob',   teamId: 'team_2', cardCount: 12 }, 
    { id: 'socket_3', index: 2, username: 'Char',  teamId: 'team_1', cardCount: 13 }, 
    { id: 'socket_4', index: 3, username: 'David', teamId: 'team_2', cardCount: 13 }  
  ],

  // --- 4. LOCAL PLAYER INFO ---
  // Assuming the local player is Alice (id: 'socket_1', teamId: 'team_1')
  hand: [
    { suit: 'hearts', rank: 'A' },
    { suit: 'hearts', rank: 'K' },
    { suit: 'spades', rank: '9' },
    { suit: 'diamonds', rank: '4' },
    { suit: 'clubs', rank: 'J' },
    { suit: 'clubs', rank: '7' },
    { suit: 'clubs', rank: '2' },
  ],

  // --- 5. BIDDING HISTORY ---
  biddingData: {
    history: [
      { bidderIndex: 0, bid: '7H' },
      { bidderIndex: 1, bid: 'Pass' },
      { bidderIndex: 2, bid: '8H' },
      { bidderIndex: 3, bid: 'Pass' },
      { bidderIndex: 0, bid: 'Pass' }
    ]
  },

  // --- 6. ACTIVE CONTRACT ---
  contract: {
    suit: 'Hearts',
    tricks: 8,
    declarerIndex: 2, 
    teamId: 'team_2' // Points to which team owns the bid
  },

  // --- 7. ACTIVE TABLE (The current trick) ---
  playingData: {
    ledSuit: 'hearts', 
    cardsOnTable: [
      { playerIndex: 0, suit: 'spades', rank: 'Q' }, 
      { playerIndex: 1, suit: 'spades', rank: '2' },
      { playerIndex: 2, suit: 'spades', rank: '8' },
      { playerIndex: 3, suit: 'spades', rank: 'A' }  
    ]
  },

  // --- 8. SCORING ---
  currentHandTricks: {
    team_1: 2,
    team_2: 1
  },

  matchScore: {
    team_1: 1,
    team_2: 0
  }
};

  // 1. We create a fake function to act as our walkie-talkie
  const handleTestPlay = (card) => {
    console.log("BOOM! You played:", card);
  };

  return (
    <BridgeGameBoard gameState={mockGameState} localUser={localUser}></BridgeGameBoard>
  );
}

export default App
