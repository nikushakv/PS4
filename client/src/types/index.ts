// --- Game Element Interfaces ---
export interface Paddle {
  // id: string; // If paddles are tied to players directly, player.id might be enough
  x: number; // X position (might be fixed for each player)
  y: number;
  width: number;
  height: number;
  // dy: number; // Current vertical speed, if you want smoother movement or acceleration
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
}

// --- Player & Game State Interfaces ---
export interface Player {
  id: string; // Socket ID or a custom unique ID from server
  score: number;
  name?: string; // Optional player name
  // Paddle is part of the player state if each player controls one
  // paddle: Paddle; // Decided to put paddles directly in GameState for easier access
  isReady?: boolean;
}

export type PlayerRole = 'player1' | 'player2' | 'spectator'; // Player1 might be left, Player2 right

export type GameStatus = 'waiting' | 'countdown' | 'playing' | 'paused' | 'gameOver';

export interface GameRoom { // Represents a single game session on the server
  roomId: string;
  players: Player[]; // Array of players in the room
  spectators?: Player[];
  gameState: GameState;
}

export interface GameState {
  // Room or Game ID might be part of a wrapper object if you have multiple games
  // For a single game instance, this might be the root state
  gameId: string; // ID for this specific game instance/room
  status: GameStatus;
  ball: Ball;
  paddles: { // Keyed by player ID or role (e.g., 'player1', 'player2')
    [playerId: string]: Paddle;
  };
  scores: {
    [playerId: string]: number;
  };
  winnerId?: string | null; // ID of the winning player
  // Game dimensions, crucial for rendering and physics
  canvasWidth: number;
  canvasHeight: number;
  // Maybe some game config constants also from server
  paddleSpeed?: number;
  maxScore?: number;
}


// --- Socket Event Payloads (Client to Server) ---
export interface C2S_JoinGamePayload {
  playerName?: string;
}

export interface C2S_PaddleMovePayload {
  direction: 'up' | 'down';
}

export interface C2S_PlayerReadyPayload {
  isReady: boolean;
}

// --- Socket Event Payloads (Server to Client) ---
export interface S2C_GameJoinedPayload {
  playerId: string; // The client's own ID
  role: PlayerRole; // 'player1' or 'player2'
  initialGameState: GameState;
  // You might also send the full room details if needed
}

export interface S2C_PlayerUpdatePayload { // When a player joins/leaves/readies
  player: Player;
  action: 'joined' | 'left' | 'readied' | 'unReadied';
}

export interface S2C_GameStateUpdatePayload {
  gameState: GameState; // The entire updated game state
}

export interface S2C_GameStartPayload {
  countdown?: number; // Optional: number of seconds for countdown
  initialGameState: GameState;
}

export interface S2C_GameOverPayload {
  winnerId: string;
  finalScores: { [playerId: string]: number };
}

export interface S2C_ErrorPayload {
  message: string;
  code?: number; // Optional error code
}

