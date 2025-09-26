import { Bus, Route, ETAResponse } from '../types/bus';
import { GoogleMapsService } from './googleMapsService';

export class BusService {
  private static instance: BusService;
  private googleMapsService: GoogleMapsService;

  private constructor() {
    this.googleMapsService = GoogleMapsService.getInstance();
  }

  public static getInstance(): BusService {
    if (!BusService.instance) {
      BusService.instance = new BusService();
    }
    return BusService.instance;
  }

  // Mock data for demonstration
  getRoutes(): Route[] {
    return [
      {
        id: 'route-1',
        name: 'Downtown Express',
        color: '#1E40AF',
        totalDistance: 15.2,
        estimatedDuration: 45,
        stops: [
          { id: 'stop-1', name: 'Central Station', latitude: 40.7128, longitude: -74.0060, address: '123 Main St' },
          { id: 'stop-2', name: 'Business District', latitude: 40.7589, longitude: -73.9851, address: '456 Business Ave' },
          { id: 'stop-3', name: 'University Campus', latitude: 40.7831, longitude: -73.9712, address: '789 College Rd' },
          { id: 'stop-4', name: 'Shopping Mall', latitude: 40.7505, longitude: -73.9934, address: '321 Mall Dr' }
        ]
      },
      {
        id: 'route-2',
        name: 'Suburban Loop',
        color: '#059669',
        totalDistance: 22.8,
        estimatedDuration: 60,
        stops: [
          { id: 'stop-5', name: 'Residential Hub', latitude: 40.7282, longitude: -74.0776, address: '159 Suburb St' },
          { id: 'stop-6', name: 'Community Center', latitude: 40.7418, longitude: -74.0021, address: '753 Community Blvd' },
          { id: 'stop-7', name: 'Industrial Park', latitude: 40.7664, longitude: -73.9441, address: '951 Industrial Way' },
          { id: 'stop-8', name: 'Airport Terminal', latitude: 40.7769, longitude: -73.8740, address: '147 Airport Rd' }
        ]
      }
    ];
  }

  getBuses(): Bus[] {
    const routes = this.getRoutes();
    const buses: Bus[] = [];

    routes.forEach((route, routeIndex) => {
      // Generate 2-3 buses per route
      const busCount = 2 + Math.floor(Math.random() * 2);

      for (let i = 0; i < busCount; i++) {
        const randomStopIndex = Math.floor(Math.random() * route.stops.length);
        const currentStop = route.stops[randomStopIndex];
        const nextStopIndex = (randomStopIndex + 1) % route.stops.length;

        // Add some random offset to simulate bus movement
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;

        buses.push({
          id: `bus-${routeIndex + 1}-${i + 1}`,
          routeId: route.id, // ✅ links correctly to Route.id
          currentLat: currentStop.latitude + latOffset,
          currentLng: currentStop.longitude + lngOffset,
          heading: Math.floor(Math.random() * 360),
          speed: Math.floor(Math.random() * 30) + 10,
          capacity: 40,
          occupancy: Math.floor(Math.random() * 35) + 5,
          nextStop: route.stops[nextStopIndex].name,
          eta: Math.floor(Math.random() * 20) + 3,
          status: ['active', 'active', 'active', 'delayed'][Math.floor(Math.random() * 4)] as any,
          lastUpdated: new Date()
        });
      }
    });

    return buses;
  }

  async calculateETAToStop(bus: Bus, stopId: string): Promise<ETAResponse | null> {
    const routes = this.getRoutes();

    // ✅ FIX: match Route.id to Bus.routeId
    const route = routes.find(r => r.id === bus.routeId);
    const stop = route?.stops.find(s => s.id === stopId);

    if (!stop) return null;

    try {
      const eta = await this.googleMapsService.calculateETA(
        { lat: bus.currentLat, lng: bus.currentLng },
        { lat: stop.latitude, lng: stop.longitude }
      );
      return eta as ETAResponse;
    } catch (error) {
      console.error('Failed to calculate ETA:', error);
      return null;
    }
  }

  // Simulate real-time bus updates
  simulateRealTimeUpdates(onUpdate: (buses: Bus[]) => void) {
    const updateBusPositions = () => {
      const buses = this.getBuses();
      const routes = this.getRoutes();

      const updatedBuses = buses.map(bus => {
        const route = routes.find(r => r.id === bus.routeId);
        if (!route) return bus;

        // Simulate bus movement along the route
        const moveDistance = 0.001; // Small movement for demo
        const newLat = bus.currentLat + (Math.random() - 0.5) * moveDistance;
        const newLng = bus.currentLng + (Math.random() - 0.5) * moveDistance;

        return {
          ...bus,
          currentLat: newLat,
          currentLng: newLng,
          eta: Math.max(1, bus.eta + (Math.random() > 0.5 ? -1 : 1)),
          occupancy: Math.min(bus.capacity, Math.max(0, bus.occupancy + Math.floor((Math.random() - 0.5) * 6))),
          lastUpdated: new Date()
        };
      });

      onUpdate(updatedBuses);
    };

    // Update every 5 seconds
    const intervalId = setInterval(updateBusPositions, 5000);

    // Initial update
    updateBusPositions();

    return () => clearInterval(intervalId);
  }
}
