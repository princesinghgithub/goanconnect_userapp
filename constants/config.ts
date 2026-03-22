// constants/config.ts
// ⚠️ Apna backend IP yahan daalo
// Development mein apna machine ka local IP use karo (localhost nahi chalega device pe)
// Example: http://192.168.1.5:5000

// export const API_BASE_URL = 'http://10.253.66.210:5000/api';
// export const SOCKET_URL = 'http://10.253.66.210:5000';

// Jo bhi IP mila woh yahan daalo
// export const API_BASE_URL = 'http://10.117.136.210:5000/api';
// export const SOCKET_URL   = 'http://10.117.136.210:5000';
// export const API_BASE_URL = 'http://10.117.136.210:5000/api';
// export const SOCKET_URL   = 'http://10.117.136.210:5000';

export const API_BASE_URL = "http://10.60.149.210:5000/api";
export const SOCKET_URL = "http://10.60.149.210:5000";

// App Config
export const APP_NAME = "Goan Connect";
export const APP_VERSION = "1.0.0";

// Vehicle Types
export const VEHICLE_TYPES = {
  BIKE: "bike",
  AUTO: "auto",
  CAB: "cab",
  TRACTOR: "tractor",
  JCB: "jcb",
} as const;

// Fare per KM (backend se override hoga)
export const BASE_FARES: Record<string, number> = {
  bike: 8,
  auto: 12,
  cab: 18,
  tractor: 25,
  jcb: 50,
};

// Map Config
export const DEFAULT_REGION = {
  // Goa center coordinates
  latitude: 15.4909,
  longitude: 73.8278,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};
