import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from '@/constants/config';

let socket: Socket | null = null;

export const rideSocket = {
  connect: async (): Promise<Socket> => {
    const token = await AsyncStorage.getItem('token');
    socket = io(SOCKET_URL, { auth: { token }, transports: ['websocket'] });
    return socket;
  },

  joinRide: (rideId: string) => socket?.emit('join-ride', { rideId }),

  onDriverAccepted:       (cb: (data: any) => void) => socket?.on('driver-accepted', cb),
  onDriverLocationUpdate: (cb: (data: any) => void) => socket?.on('driver-location-update', cb),
  onDriverArrived:        (cb: () => void)          => socket?.on('driver-arrived', cb),
  onTripStarted:          (cb: (data: any) => void) => socket?.on('trip-started', cb),
  onTripCompleted:        (cb: (data: any) => void) => socket?.on('trip-completed', cb),
  onNoDrivers:            (cb: () => void)          => socket?.on('no-drivers', cb),
  onEtaUpdate:            (cb: (data: any) => void) => socket?.on('eta-update', cb),

  disconnect: () => { socket?.disconnect(); socket = null; },
};
