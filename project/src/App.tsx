import React, { useState, useEffect } from 'react';
import { CommuterView } from './components/CommuterView/CommuterView';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { BusService } from './services/busService';
import { Bus, Route } from './types/bus';
import { Bus as BusIcon, BarChart3, Users, Settings } from 'lucide-react';

function App() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [currentView, setCurrentView] = useState<'commuter' | 'admin'>('commuter');
  const [isLoading, setIsLoading] = useState(true);
  const busService = BusService.getInstance();

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      setIsLoading(true);
      const routesData = busService.getRoutes();
      const busesData = busService.getBuses();
      
      setRoutes(routesData);
      setBuses(busesData);
      setIsLoading(false);
    };

    loadData();

    // Set up real-time updates
    const cleanup = busService.simulateRealTimeUpdates((updatedBuses) => {
      setBuses(updatedBuses);
    });

    return cleanup;
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-900 mb-2">Loading Bus Tracking System</p>
          <p className="text-gray-600">Connecting to GPS network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BusIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Live Bus</h1>
                <p className="text-sm text-gray-600">Live Bus Tracking System</p>
              </div>
            </div>

            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('commuter')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'commuter'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Commuter View</span>
              </button>
              
              <button
                onClick={() => setCurrentView('admin')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'admin'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'commuter' ? (
          <CommuterView buses={buses} routes={routes} />
        ) : (
          <AdminDashboard buses={buses} routes={routes} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BusIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">LIVE BUS</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Advanced bus tracking system with real-time GPS monitoring, 
                ETA predictions, and route optimization using Google Directions API.
              </p>
              <div className="text-xs text-gray-500">
                <p>✓ Real-time GPS tracking</p>
                <p>✓ ETA predictions with Google Directions API</p>
                <p>✓ Live occupancy monitoring</p>
                <p>✓ Route optimization & analytics</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Live Bus Tracking</li>
                <li>ETA Calculations</li>
                <li>Route Management</li>
                <li>Passenger Analytics</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Technology</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Google Directions API</li>
                <li>Real-time GPS Data</li>
                <li>AI/ML Predictions</li>
                <li>Cloud Infrastructure</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2025 SmartTransit. Advanced bus tracking system with comprehensive fleet management.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;