import React, { useState, useEffect } from 'react';
import { Bus, Route } from '../../types/bus';
import { BusCard } from '../BusCard/BusCard';
import { MapComponent } from '../Map/MapComponent';
import { RouteInfo } from '../RouteInfo/RouteInfo';
import { MapPin, Clock, Search } from 'lucide-react';

interface CommuterViewProps {
  buses: Bus[];
  routes: Route[];
}

export const CommuterView: React.FC<CommuterViewProps> = ({ buses, routes }) => {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyStops, setNearbyStops] = useState<any[]>([]);

  useEffect(() => {
    // Simulate finding nearby stops
    const mockNearbyStops = routes.flatMap(route => 
      route.stops.slice(0, 3).map(stop => ({
        ...stop,
        routeName: route.name,
        routeColor: route.color,
        nextBus: Math.floor(Math.random() * 15) + 2
      }))
    );
    setNearbyStops(mockNearbyStops);
  }, [routes]);

  const filteredBuses = buses.filter(bus => {
    const route = routes.find(r => r.id === bus.routeId);
    const matchesRoute = selectedRoute === 'all' || bus.routeId === selectedRoute;
    const matchesSearch = searchQuery === '' || 
      bus.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.nextStop.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRoute && matchesSearch;
  });

  const selectedRouteData = routes.find(r => r.id === selectedRoute);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Live Bus Tracking</h2>
        <div className="text-sm text-gray-600">
          {filteredBuses.length} buses tracking live
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search buses, routes, or stops..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
          >
            <option value="all">All Routes</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Find Nearest Stop
          </button>
        </div>
      </div>

      {/* Nearby Stops */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Nearby Stops</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbyStops.slice(0, 3).map(stop => (
            <div key={stop.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{stop.name}</span>
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stop.routeColor }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mb-2">{stop.routeName}</div>
              <div className="flex items-center space-x-1 text-sm">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">Next bus: {stop.nextBus} mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map and Bus List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="h-96">
              <MapComponent 
                buses={filteredBuses}
                routes={routes}
                selectedBus={selectedBus}
                onBusSelect={setSelectedBus}
              />
            </div>
          </div>
        </div>

        {/* Bus List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Buses</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredBuses.map(bus => {
              const route = routes.find(r => r.id === bus.routeId)!;
              return (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  routeName={route.name}
                  routeColor={route.color}
                  onClick={() => setSelectedBus(bus)}
                  isSelected={selectedBus?.id === bus.id}
                />
              );
            })}
          </div>
          
          {filteredBuses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No buses found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Route Details */}
      {selectedRouteData && selectedRoute !== 'all' && (
        <RouteInfo route={selectedRouteData} buses={buses} />
      )}
    </div>
  );
};