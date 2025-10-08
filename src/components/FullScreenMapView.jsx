import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Maximize2, 
  RotateCcw, 
  Filter, 
  RefreshCw, 
  TrendingUp,
  AlertTriangle,
  Clock,
  MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FullScreenMapView = ({ stations, selectedFilter, onFilterChange }) => {
  const [selectedStation, setSelectedStation] = useState(null);

  // Get AQI color classes
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#2E7D32';
    if (aqi <= 100) return '#F6C94C';
    if (aqi <= 150) return '#F59E0B';
    if (aqi <= 200) return '#EF4444';
    if (aqi <= 300) return '#8B5CF6';
    return '#7F1D1D';
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Satisfactory';
    if (aqi <= 150) return 'Moderate';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Generate sample trend data for a station
  const generateTrendData = (station) => {
    const baseValue = station.aqi;
    return [
      { time: '00:00', aqi: Math.round(baseValue * 0.9) },
      { time: '04:00', aqi: Math.round(baseValue * 0.85) },
      { time: '08:00', aqi: Math.round(baseValue * 0.95) },
      { time: '12:00', aqi: Math.round(baseValue * 1.1) },
      { time: '16:00', aqi: baseValue },
      { time: '20:00', aqi: Math.round(baseValue * 0.95) }
    ];
  };

  return (
    <div className="relative h-screen w-full">
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-800">Air Quality Map</h3>
          <select 
            value={selectedFilter} 
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28784A] focus:border-transparent"
          >
            <option value="aqi">AQI</option>
            <option value="pm25">PM2.5</option>
            <option value="pm10">PM10</option>
            <option value="no2">NO₂</option>
            <option value="o3">O₃</option>
            <option value="so2">SO₂</option>
          </select>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-xl shadow-lg p-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">AQI Levels</h4>
        <div className="space-y-2">
          {[
            { range: '0-50', label: 'Good', color: '#2E7D32' },
            { range: '51-100', label: 'Satisfactory', color: '#F6C94C' },
            { range: '101-150', label: 'Moderate', color: '#F59E0B' },
            { range: '151-200', label: 'Unhealthy', color: '#EF4444' },
            { range: '201-300', label: 'Very Unhealthy', color: '#8B5CF6' },
            { range: '300+', label: 'Hazardous', color: '#7F1D1D' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">{item.range} - {item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="h-full w-full">
        <MapContainer
          center={[23.6141, 58.5922]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {stations.map((station) => (
            <Marker 
              key={station.id} 
              position={[station.lat, station.lng]}
              eventHandlers={{
                click: () => setSelectedStation(station)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-4 min-w-[300px]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800 text-lg">{station.name}</h4>
                    <div 
                      className="px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{ backgroundColor: getAQIColor(station.aqi) }}
                    >
                      AQI {station.aqi}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-sm font-medium">{getAQICategory(station.aqi)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Region:</span>
                      <span className="text-sm font-medium">{station.region}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">PM2.5:</span>
                      <span className="text-sm font-medium">{station.pm25} μg/m³</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">PM10:</span>
                      <span className="text-sm font-medium">{station.pm10} μg/m³</span>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">24h Trend</h5>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateTrendData(station)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="time" stroke="#666" fontSize={10} />
                            <YAxis stroke="#666" fontSize={10} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '8px',
                                fontSize: '12px'
                              }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="aqi" 
                              stroke={getAQIColor(station.aqi)} 
                              strokeWidth={2}
                              dot={{ fill: getAQIColor(station.aqi), strokeWidth: 2, r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedStation(station)}
                      className="w-full mt-3 px-4 py-2 bg-[#28784A] text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Detailed Analysis
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Detailed Station Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-[#28784A]" />
                <h3 className="text-xl font-semibold text-gray-800">{selectedStation.name}</h3>
              </div>
              <button
                onClick={() => setSelectedStation(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AQI Overview */}
              <div className="space-y-4">
                <div 
                  className="p-4 rounded-xl text-white"
                  style={{ backgroundColor: getAQIColor(selectedStation.aqi) }}
                >
                  <div className="text-3xl font-bold">{selectedStation.aqi}</div>
                  <div className="text-lg font-medium">{getAQICategory(selectedStation.aqi)}</div>
                  <div className="text-sm opacity-90">Air Quality Index</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Pollutant Levels</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PM2.5:</span>
                      <span className="text-sm font-medium">{selectedStation.pm25} μg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PM10:</span>
                      <span className="text-sm font-medium">{selectedStation.pm10} μg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Region:</span>
                      <span className="text-sm font-medium">{selectedStation.region}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trend Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">24-Hour Trend</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateTrendData(selectedStation)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px',
                          fontSize: '12px'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="aqi" 
                        stroke={getAQIColor(selectedStation.aqi)} 
                        strokeWidth={3}
                        dot={{ fill: getAQIColor(selectedStation.aqi), strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedStation(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setSelectedStation(null)}
                className="px-6 py-2 bg-[#28784A] text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullScreenMapView;
