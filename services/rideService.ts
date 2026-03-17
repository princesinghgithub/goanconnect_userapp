import api from './api';

export const rideService = {
  getFareEstimate: (pickupLat: number, pickupLng: number, dropLat: number, dropLng: number) =>
    api.get('/rides/fare-estimate', { params: { pickupLat, pickupLng, dropLat, dropLng } }),

  bookRide: (data: {
    pickup: { latitude: number; longitude: number; address: string };
    drop:   { latitude: number; longitude: number; address: string };
    vehicleType: string;
    fare: number;
    paymentMethod: string;
  }) => api.post('/rides/book', data),

  cancelRide:  (rideId: string) => api.post(`/rides/${rideId}/cancel`),
  getRide:     (rideId: string) => api.get(`/rides/${rideId}`),
  rateRide:    (rideId: string, rating: number) => api.post(`/rides/${rideId}/rate`, { rating }),
  getRideHistory: () => api.get('/rides/history'),
};
