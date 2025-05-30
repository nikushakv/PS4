// client/src/services/socketService.ts
import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '@utils/constants';
import { C2S_PaddleMovePayload, C2S_PlayerReadyPayload } from '@types';

export const emitPaddleMove = (socket: Socket, payload: C2S_PaddleMovePayload) => {
  socket.emit(SOCKET_EVENTS.CLIENT_PADDLE_MOVE, payload);
};

export const emitPlayerReady = (socket: Socket, payload: C2S_PlayerReadyPayload) => {
  socket.emit(SOCKET_EVENTS.CLIENT_PLAYER_READY, payload);
};
// ... other emitters