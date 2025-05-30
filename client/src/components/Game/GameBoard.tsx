import React, { useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { GameState, PlayerRole, C2S_PaddleMovePayload } from '@types'; // Ensure PlayerRole is imported if used
import { useKeyboard } from '@hooks/useKeyboard';
import { SOCKET_EVENTS } from '@utils/constants';
// We might not need separate BallComponent and PaddleComponent if drawing directly on canvas

interface GameBoardProps {
  gameState: GameState; // Now assuming gameState is never null when GameBoard is rendered
  localPlayerId: string | null;
  playerRole: PlayerRole | null; // To know which paddle this client might control
  socket: Socket | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, localPlayerId, playerRole, socket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Keyboard Input for Paddle Movement ---
  useKeyboard((key) => {
    if (!socket || !localPlayerId || !playerRole || playerRole === 'spectator' || gameState.status !== 'playing') {
      return; // Only allow input if connected, has a role, is not a spectator, and game is playing
    }

    let direction: 'up' | 'down' | null = null;
    if (key === 'w' || key === 'ArrowUp') {
      direction = 'up';
    } else if (key === 's' || key === 'ArrowDown') {
      direction = 'down';
    }

    if (direction) {
      const payload: C2S_PaddleMovePayload = { direction };
      console.log(`Sending paddleMove: ${direction} for player ${localPlayerId} (Role: ${playerRole})`);
      socket.emit(SOCKET_EVENTS.CLIENT_PADDLE_MOVE, payload);
    }
  });

  // --- Canvas Drawing Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const { canvasWidth, canvasHeight, ball, paddles, scores } = gameState;

    // Ensure canvas dimensions are set (they come from gameState now)
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 1. Clear canvas
    context.fillStyle = '#0D0D0D'; // Dark background
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Draw middle line (optional decorative element)
    context.strokeStyle = '#333';
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(canvasWidth / 2, 0);
    context.lineTo(canvasWidth / 2, canvasHeight);
    context.stroke();

    // 3. Draw Paddles
    context.fillStyle = '#FFF'; // White paddles
    Object.entries(paddles).forEach(([playerId, paddle]) => {
      // The server should send paddle.x. If not, we need a way to determine it.
      // For a typical Pong, one paddle is on the left, one on the right.
      // We need a consistent way to map playerId to left/right.
      // Let's assume the server provides paddle.x correctly.
      // Or, if playerRole is 'player1' it's left, 'player2' it's right.
      // The 'paddles' object in GameState is keyed by playerId.
      context.fillRect(paddle.x, paddle.y - paddle.height / 2, paddle.width, paddle.height);
    });

    // 4. Draw Ball
    if (ball) {
      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      context.fillStyle = '#FFF'; // White ball
      context.fill();
      context.closePath();
    }

    // 5. Draw Scores (simple text rendering for now)
    context.fillStyle = '#DDD';
    context.font = '32px "Courier New", Courier, monospace';
    context.textAlign = 'center';

    // Need a way to identify player1 and player2 scores from the 'scores' object
    // This part needs server to clearly define player1Id and player2Id or send scores in order
    const playerIds = Object.keys(scores);
    if (playerIds.length >= 1) {
        context.fillText(scores[playerIds[0]]?.toString() || '0', canvasWidth * 0.25, 50);
    }
    if (playerIds.length >= 2) {
        context.fillText(scores[playerIds[1]]?.toString() || '0', canvasWidth * 0.75, 50);
    }


  }, [gameState]); // Re-draw whenever gameState changes

  if (gameState.status === 'countdown') {
    return (
      <div className="game-countdown" style={{ textAlign: 'center', fontSize: '48px', color: 'white' }}>
        Game starting soon... {/* Server should ideally send countdown number */}
        <canvas
            ref={canvasRef}
            style={{ display: 'block', margin: '20px auto', border: '2px solid #00d8ff' }}
            // Width and height will be set by gameState in useEffect
        />
      </div>
    );
  }

  return (
    <div className="game-board-container">
      {/* ScoreBoard component could be used here if we prefer DOM elements for scores */}
      <canvas
        ref={canvasRef}
        style={{ display: 'block', margin: '20px auto', border: '2px solid #00d8ff' }}
        // Width and height will be set by gameState in useEffect
      />
    </div>
  );
};

export default GameBoard;