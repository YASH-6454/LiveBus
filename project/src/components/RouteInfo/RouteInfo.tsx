import React from 'react';
import { Route, Bus } from '../../types/bus';
import { MapPin, Clock, Route as RouteIcon } from 'lucide-react';

interface RouteInfoProps {
  route: Route;
  buses: Bus[];
}

export const RouteInfo: React.FC<RouteInfoProps> = ({ route, buses }) => {
  const routeBuses = buses.filter(bus => bus.routeId === route.id);
  const activeBuses = routeBuses.filter(bus => bus.status === 'active');
  const averageOccupancy = routeBuses.length > 0 
    ? Math.round(routeBuses.reduce((sum, bus) => sum + (bus.occupancy / bus.capacity), 0) / routeBuses.length * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: route.color }}
        ></div>
        <h3 className="text-xl font-semibold text-gray-900">{route.name}</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{routeBuses.length}</div>
          <div className="text-sm text-gray-600">Total Buses</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{activeBuses.length}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{averageOccupancy}%</div>
          <div className="text-sm text-gray-600">Avg Occupancy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{route.stops.length}</div>
          <div className="text-sm text-gray-600">Stops</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <RouteIcon className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Route Details</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Distance: {route.totalDistance} km</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Duration: {route.estimatedDuration} mins</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Bus Stops</h4>
          <div className="space-y-2">
            {route.stops.map((stop, index) => (
              <div key={stop.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{stop.name}</div>
                  <div className="text-sm text-gray-600">{stop.address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};