import { SOCKET_URL } from '@/constants/config';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (userId: string): Socket => {
  if (socket?.connected) return socket;
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    query: { userId },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });
  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
    socket?.emit('join', { userId, role: 'customer' });
  });
  socket.on('disconnect', () => console.log('Socket disconnected'));
  socket.on('connect_error', (err) => console.log('Socket error:', err.message));
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};

export const subscribeToRideEvents = (callbacks: {
  onRideAccepted?:   (data: any) => void;
  onRideArrived?:    (data: any) => void;
  onRideStarted?:    (data: any) => void;
  onRideCompleted?:  (data: any) => void;
  onRideCancelled?:  (data: any) => void;
  onDriverLocation?: (data: any) => void;
}) => {
  if (!socket) return;
  if (callbacks.onRideAccepted)   socket.on('rideAccepted',   callbacks.onRideAccepted);
  if (callbacks.onRideArrived)    socket.on('rideArrived',    callbacks.onRideArrived);
  if (callbacks.onRideStarted)    socket.on('rideStarted',    callbacks.onRideStarted);
  if (callbacks.onRideCompleted)  socket.on('rideCompleted',  callbacks.onRideCompleted);
  if (callbacks.onRideCancelled)  socket.on('rideCancelled',  callbacks.onRideCancelled);
  if (callbacks.onDriverLocation) socket.on('driverLocation', callbacks.onDriverLocation);
};

export const unsubscribeRideEvents = () => {
  if (!socket) return;
  socket.off('rideAccepted');
  socket.off('rideArrived');
  socket.off('rideStarted');
  socket.off('rideCompleted');
  socket.off('rideCancelled');
  socket.off('driverLocation');
};
