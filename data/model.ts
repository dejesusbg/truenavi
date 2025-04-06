interface Admin {
  // Administradores
  _id: string; // Unique identifier (UUID or ObjectId)
  name: string;
  email: string; // Unique per admin
  password: string; // Hashed password
}

interface Node {
  // Nodos (deben ser indexados por coordenadas)
  _id: string;
  name?: string;
  coordinates: [number, number];
  next: string[]; // Collection of next nodes (IDs)
  timestamp: string; // ISO 8601 timestamp
}

interface Edges {
  a_id: string;
  b_id: string;
  coordinates: [number, number][];
  distance: number; // Distance in meters
  timestamp: string; // ISO 8601 timestamp
}

interface Preferences {
  // Configuraciones
  language: 'es' | 'en';
  showWeather: boolean;
  notifications: boolean;
  vibration: boolean;
}
