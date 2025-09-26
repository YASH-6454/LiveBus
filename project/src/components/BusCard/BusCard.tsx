import React from 'react';
import { Bus } from '../../types/bus';
import { Navigation, Users, Clock, MapPin } from 'lucide-react';

interface BusCardProps {
  bus: Bus;
  routeName: string;
  routeColor: string;
  onClick: () => void;
  isSelected?: boolean;
}

export const BusCard: React.FC<BusCardProps> = ({ bus, routeName, routeColor, onClick, isSelected }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'off-duty': return 'bg-gray-100 text-gray-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const occupancyPercentage = (bus.occupancy / bus.capacity) * 100;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: routeColor }}
            ></div>
            <span className="font-semibold text-gray-900">{routeName}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bus.status)}`}>
            {bus.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Bus {bus.id}</span>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Navigation className="w-4 h-4" />
              <span>{bus.speed} km/h</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Next: {bus.nextStop}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>ETA: {bus.eta} minutes</span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-600" />
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Occupancy</span>
                <span>{bus.occupancy}/{bus.capacity}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getOccupancyColor(occupancyPercentage)}`}
                  style={{ width: `${occupancyPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Updated: {bus.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};