import React, { useState, useEffect } from 'react';
import { Bus, Route } from '../../types/bus';
import { BarChart3, Users, MapPin, AlertTriangle, Activity } from 'lucide-react';

interface AdminDashboardProps {
  buses: Bus[];
  routes: Route[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ buses, routes }) => {
  const [analytics, setAnalytics] = useState({
    totalBuses: 0,
    activeBuses: 0,
    delayedBuses: 0,
    totalPassengers: 0,
    averageOccupancy: 0,
    routePerformance: [] as any[]
  });

  useEffect(() => {
    const totalBuses = buses.length;
    const activeBuses = buses.filter(bus => bus.status === 'active').length;
    const delayedBuses = buses.filter(bus => bus.status === 'delayed').length;
    const totalPassengers = buses.reduce((sum, bus) => sum + bus.occupancy, 0);
    const averageOccupancy = totalBuses > 0 
      ? Math.round(buses.reduce((sum, bus) => sum + (bus.occupancy / bus.capacity), 0) / totalBuses * 100)
      : 0;

    const routePerformance = routes.map(route => {
      const routeBuses = buses.filter(bus => bus.routeId === route.id);
      const avgOccupancy = routeBuses.length > 0 
        ? Math.round(routeBuses.reduce((sum, bus) => sum + (bus.occupancy / bus.capacity), 0) / routeBuses.length * 100)
        : 0;
      
      return {
        routeName: route.name,
        busCount: routeBuses.length,
        avgOccupancy,
        onTime: routeBuses.filter(bus => bus.status === 'active').length,
        delayed: routeBuses.filter(bus => bus.status === 'delayed').length
      };
    });

    setAnalytics({
      totalBuses,
      activeBuses,
      delayedBuses,
      totalPassengers,
      averageOccupancy,
      routePerformance
    });
  }, [buses, routes]);

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = 
    ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Fleet Management Dashboard</h2>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Fleet"
          value={analytics.totalBuses}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Buses"
          value={analytics.activeBuses}
          icon={<MapPin className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Delayed"
          value={analytics.delayedBuses}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Passengers"
          value={analytics.totalPassengers}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Route Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Route Performance</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Route</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Buses</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">On Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Delayed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {analytics.routePerformance.map((route, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{route.routeName}</td>
                  <td className="py-3 px-4 text-gray-600">{route.busCount}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {route.onTime}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {route.delayed}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${route.avgOccupancy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{route.avgOccupancy}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Bus Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Bus Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.slice(0, 6).map(bus => {
            const route = routes.find(r => r.id === bus.routeId);
            return (
              <div key={bus.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Bus {bus.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bus.status === 'active' ? 'bg-green-100 text-green-800' :
                    bus.status === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {bus.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Route: {route?.name}</div>
                  <div>Next Stop: {bus.nextStop}</div>
                  <div>ETA: {bus.eta} mins</div>
                  <div>Occupancy: {bus.occupancy}/{bus.capacity}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};