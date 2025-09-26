import React, { useEffect, useRef, useState } from 'react';
import { Bus, Route } from '../../types/bus';
import { MapPin, Navigation } from 'lucide-react';

interface MapComponentProps {
  buses: Bus[];
  routes: Route[];
  selectedBus?: Bus | null;
  onBusSelect: (bus: Bus) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ buses, routes, selectedBus, onBusSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setMapLoaded(true), 1000);
  }, []);

  const getRouteColor = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route?.color || '#1E40AF';
  };

  const getBusStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'delayed': return '#F59E0B';
      case 'maintenance': return '#EF4444';
      case 'off-duty': return '#6B7280';
      default: return '#10B981';
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full relative">
        {!mapLoaded ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Simulated map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Grid pattern to simulate map */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 5}%` }} />
                ))}
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 5}%` }} />
                ))}
              </div>
            </div>

            {/* Route lines */}
            {routes.map(route => (
              <svg key={route.id} className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d={`M ${route.stops.map((_stop, index) => 
                    `${20 + index * 200} ${100 + index * 80}`
                  ).join(' L ')}`}
                  stroke={route.color}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  className="opacity-60"
                />
              </svg>
            ))}

            {/* Bus stops */}
            {routes.flatMap(route => 
              route.stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ 
                    left: `${20 + index * 200}px`, 
                    top: `${100 + index * 80}px` 
                  }}
                >
                  <div className="bg-white border-2 border-gray-300 rounded-full p-2 shadow-lg group-hover:shadow-xl transition-shadow">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {stop.name}
                  </div>
                </div>
              ))
            )}

            {/* Buses */}
            {buses.map((bus, index) => {
              const route = routes.find(r => r.id === bus.routeId);
              const routeIndex = routes.indexOf(route!);
              const busPositionX = 50 + index * 150 + (routeIndex * 100);
              const busPositionY = 120 + index * 60 + (routeIndex * 50);

              return (
                <div
                  key={bus.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    selectedBus?.id === bus.id ? 'scale-125 z-10' : 'hover:scale-110'
                  }`}
                  style={{ 
                    left: `${busPositionX}px`, 
                    top: `${busPositionY}px`,
                    animation: 'pulse 2s infinite'
                  }}
                  onClick={() => onBusSelect(bus)}
                >
                  <div 
                    className="bg-white border-3 rounded-lg p-2 shadow-lg"
                    style={{ borderColor: getRouteColor(bus.routeId) }}
                  >
                    <Navigation 
                      className="w-6 h-6" 
                      style={{ 
                        color: getBusStatusColor(bus.status),
                        transform: `rotate(${bus.heading}deg)` 
                      }} 
                    />
                  </div>
                  
                  {selectedBus?.id === bus.id && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 whitespace-nowrap z-20">
                      <div className="text-sm font-semibold text-gray-900">Bus {bus.id}</div>
                      <div className="text-xs text-gray-600">Next: {bus.nextStop}</div>
                      <div className="text-xs text-gray-600">ETA: {bus.eta} mins</div>
                      <div className="text-xs">
                        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: getBusStatusColor(bus.status) }}></span>
                        {bus.status}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg">
        <div className="p-2 space-y-2">
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded">+</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded">-</button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="text-xs font-semibold text-gray-900 mb-2">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Active
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            Delayed
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="w-3 h-3 text-gray-600 mr-2" />
            Bus Stop
          </div>
        </div>
      </div>
    </div>
  );
};