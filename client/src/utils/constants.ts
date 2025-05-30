// Game Visual Defaults (can be overridden by server state if needed)
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;
export const DEFAULT_PADDLE_WIDTH = 15;
export const DEFAULT_PADDLE_HEIGHT = 100;
export const DEFAULT_BALL_RADIUS = 10;

export const PADDLE_OFFSET_X = 20; // How far paddles are from the side edges

// Socket Event Names (ensure these match exactly with your server-side definitions)
export const SOCKET_EVENTS = {
  // Client to Server
  CLIENT_JOIN_GAME: 'client:joinGame',
  CLIENT_PADDLE_MOVE: 'client:paddleMove',
  CLIENT_PLAYER_READY: 'client:playerReady',

  // Server to Client
  SERVER_GAME_JOINED: 'server:gameJoined',      // Confirmation with player ID, role, initial state
  SERVER_PLAYER_UPDATE: 'server:playerUpdate',  // Another player joined/left/readied
  SERVER_GAME_START: 'server:gameStart',        // Signals game (or countdown) begins
  SERVER_GAME_STATE_UPDATE: 'server:gameStateUpdate', // Regular updates of ball, paddles, scores
  SERVER_SCORE_UPDATE: 'server:scoreUpdate',    // If you send score updates separately
  SERVER_GAME_OVER: 'server:gameOver',
  SERVER_ERROR: 'server:error',                 // For sending error messages to client

  // Standard Socket.IO events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
} as const; // 'as const' makes the values readonly and specific strings for better type safety