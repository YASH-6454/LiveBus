export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface Route {
  id: string;
  name: string;
  stops: BusStop[];
  color: string;
  totalDistance: number;
  estimatedDuration: number;
}

export interface Bus {
  id: string;
  routeId: string;
  currentLat: number;
  currentLng: number;
  heading: number;
  speed: number;
  capacity: number;
  occupancy: number;
  nextStop: string;
  eta: number;
  status: 'active' | 'delayed' | 'maintenance' | 'off-duty';
  lastUpdated: Date;
}

export interface ETAResponse {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  status: string;
}