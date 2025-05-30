import React, { useEffect } from 'react';
import Header from '@components/Layout/Header';
import Footer from '@components/Layout/Footer';
import ConnectionStatus from '@components/UI/ConnectionStatus';
import GameBoard from '@components/Game/GameBoard'; // Import GameBoard
// import WaitingRoom from '@components/UI/WaitingRoom'; // Will uncomment later
// import GameOverScreen from '@components/UI/GameOver';

import { useSocket } from '@hooks/useSocket';
import { useGameState } from '@hooks/useGameState';
import { SOCKET_EVENTS } from '@utils/constants';

import './App.css';

function App() {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  if (!serverUrl) {
    return (
      <div>Error: VITE_SERVER_URL is not defined.</div>
    );
  }

  const { socket, isConnected, playerId: localPlayerId } = useSocket(serverUrl);
  const { gameState, playerRole } = useGameState(socket, localPlayerId);

  useEffect(() => {
    if (socket && isConnected && localPlayerId && gameState?.status === 'waiting') {
      if (!playerRole) {
        console.log(`Attempting to join game as player: ${localPlayerId}`);
        socket.emit(SOCKET_EVENTS.CLIENT_JOIN_GAME, { playerName: `Player_${localPlayerId.substring(0,4)}` });
      }
    }
  }, [socket, isConnected, localPlayerId, gameState, playerRole]);


  const renderMainContent = () => {
    if (!isConnected || !gameState) {
      return <p>Connecting to server and fetching game state...</p>;
    }

    // console.log("Current Game Status:", gameState.status, "Player Role:", playerRole);

    switch (gameState.status) {
      case 'waiting':
        // return <WaitingRoom socket={socket} localPlayerId={localPlayerId} playerRole={playerRole} />;
        return <p>Status: Waiting for game... (Role: {playerRole || 'N/A'})</p>;
      case 'countdown':
      case 'playing':
        return <GameBoard gameState={gameState} localPlayerId={localPlayerId} playerRole={playerRole} socket={socket} />;
      case 'paused':
        return <p>Status: Game Paused. (Role: {playerRole || 'N/A'})</p>;
      case 'gameOver':
        // return <GameOverScreen gameState={gameState} localPlayerId={localPlayerId} />;
        return <p>Status: Game Over! Winner: {gameState.winnerId || 'N/A'}. (Role: {playerRole || 'N/A'})</p>;
      default:
        return <p>Loading game or unknown status: {gameState.status}...</p>;
    }
  };

  return (
    <div className="app-layout">
      <Header />
      <main className="app-main-content">
        <ConnectionStatus isConnected={isConnected} playerId={localPlayerId} />
        {renderMainContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;