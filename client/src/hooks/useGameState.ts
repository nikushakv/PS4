// client/src/hooks/useGameState.ts
import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
// Correctly using the @types alias:
import {
  GameState,
  PlayerRole,
  S2C_GameJoinedPayload,
  S2C_GameStateUpdatePayload,
  S2C_GameStartPayload,
  S2C_GameOverPayload
} from '../types/index';  // This will resolve to src/types/index.ts (or wherever these types are exported from within src/types/)

import { SOCKET_EVENTS } from '@utils/constants';
// ... rest of the useGameState hook
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_PADDLE_HEIGHT,
  DEFAULT_PADDLE_WIDTH,
  DEFAULT_BALL_RADIUS,
} from '@utils/constants';

// Define a default initial state for when no data has been received yet
const createInitialDefaultGameState = (gameId: string = 'default_game'): GameState => ({
  gameId: gameId,
  status: 'waiting',
  ball: {
    x: DEFAULT_CANVAS_WIDTH / 2,
    y: DEFAULT_CANVAS_HEIGHT / 2,
    radius: DEFAULT_BALL_RADIUS,
    velocityX: 0, // Server will set actual initial velocity
    velocityY: 0,
  },
  paddles: {}, // Will be populated by server
  scores: {}, // Will be populated by server
  canvasWidth: DEFAULT_CANVAS_WIDTH,
  canvasHeight: DEFAULT_CANVAS_HEIGHT,
  winnerId: null,
});

interface UseGameStateReturn {
  gameState: GameState | null;
  playerRole: PlayerRole | null;
  setGameState: (newGameState: GameState | null) => void; // Allow manual override if needed
}

export const useGameState = (socket: Socket | null, localPlayerId: string | null): UseGameStateReturn => {
  const [gameState, setGameStateInternal] = useState<GameState | null>(null);
  const [playerRole, setPlayerRole] = useState<PlayerRole | null>(null);

  // Callback to update state, memoized for stability if passed as prop
  const setGameState = useCallback((newGameState: GameState | null) => {
    setGameStateInternal(newGameState);
  }, []);

  useEffect(() => {
    if (!socket) {
      setGameStateInternal(createInitialDefaultGameState('no_socket_game'));
      setPlayerRole(null);
      return;
    }

    const handleGameJoined = (data: S2C_GameJoinedPayload) => {
      console.log(SOCKET_EVENTS.SERVER_GAME_JOINED, data);
      setPlayerRole(data.role);
      setGameStateInternal(data.initialGameState);
    };

    const handleGameStateUpdate = (data: S2C_GameStateUpdatePayload) => {
      setGameStateInternal(data.gameState);
    };

    const handleGameStart = (data: S2C_GameStartPayload) => {
      console.log(SOCKET_EVENTS.SERVER_GAME_START, data);
      if (data.initialGameState) {
        setGameStateInternal(data.initialGameState);
      }
      setGameStateInternal((prevState: GameState | null) =>
        prevState ? { ...prevState, status: 'playing' } : data.initialGameState
      );
    };

    const handleGameOver = (data: S2C_GameOverPayload) => {
      console.log(SOCKET_EVENTS.SERVER_GAME_OVER, data);
      setGameStateInternal((prevState: GameState | null) => {
        if (!prevState) return null;
        return {
          ...prevState,
          status: 'gameOver',
          winnerId: data.winnerId,
          scores: data.finalScores,
        };
      });
    };

    socket.on(SOCKET_EVENTS.SERVER_GAME_JOINED, handleGameJoined);
    socket.on(SOCKET_EVENTS.SERVER_GAME_STATE_UPDATE, handleGameStateUpdate);
    socket.on(SOCKET_EVENTS.SERVER_GAME_START, handleGameStart);
    socket.on(SOCKET_EVENTS.SERVER_GAME_OVER, handleGameOver);

    return () => {
      socket.off(SOCKET_EVENTS.SERVER_GAME_JOINED, handleGameJoined);
      socket.off(SOCKET_EVENTS.SERVER_GAME_STATE_UPDATE, handleGameStateUpdate);
      socket.off(SOCKET_EVENTS.SERVER_GAME_START, handleGameStart);
      socket.off(SOCKET_EVENTS.SERVER_GAME_OVER, handleGameOver);
    };
  }, [socket, localPlayerId]);

  const currentGameState =
    gameState === null ? createInitialDefaultGameState(localPlayerId || 'init_game') : gameState;

  return { gameState: currentGameState, playerRole, setGameState };
};
