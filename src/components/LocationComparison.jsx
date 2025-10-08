import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Plus, X, MapPin, BarChart3, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, Clock, Search, ChevronDown, Lock,
  LogIn, Eye, EyeOff
} from 'lucide-react';

const LocationComparison = ({ isLoggedIn, onLogin, user }) => {
  const [selectedLocations, setSelectedLocations] = useState(['Muscat Central', 'Nizwa']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');

  // Available locations for comparison
  const availableLocations = [
    { name: 'Muscat Central', region: 'Muscat', type: 'city', aqi: 45, category: 'Good' },
    { name: 'Nizwa', region: 'Ad Dakhiliyah', type: 'city', aqi: 62, category: 'Satisfactory' },
    { name: 'Salalah', region: 'Dhofar', type: 'city', aqi: 38, category: 'Good' },
    { name: 'Sohar', region: 'Al Batinah North', type: 'city', aqi: 78, category: 'Satisfactory' },
    { name: 'Sur', region: 'Ash Sharqiyah South', type: 'city', aqi: 55, category: 'Satisfactory' },
    { name: 'Ibri', region: 'Ad Dhahirah', type: 'city', aqi: 68, category: 'Satisfactory' },
    { name: 'Buraimi', region: 'Al Buraimi', type: 'city', aqi: 72, category: 'Satisfactory' },
    { name: 'Khasab', region: 'Musandam', type: 'city', aqi: 41, category: 'Good' },
    { name: 'Rustaq', region: 'Al Batinah South', type: 'city', aqi: 59, category: 'Satisfactory' },
    { name: 'Ibra', region: 'Ash Sharqiyah North', type: 'city', aqi: 65, category: 'Satisfactory' }
  ];

  // Filter locations based on search query
  const filteredLocations = availableLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get AQI color and category
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#10B981';
    if (aqi <= 100) return '#F59E0B';
    if (aqi <= 150) return '#F97316';
    if (aqi <= 200) return '#EF4444';
    if (aqi <= 300) return '#8B5CF6';
    return '#DC2626';
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Satisfactory';
    if (aqi <= 150) return 'Moderate';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Handle location selection
  const handleLocationToggle = (locationName) => {
    setSelectedLocations(prev => {
      if (prev.includes(locationName)) {
        return prev.filter(loc => loc !== locationName);
      } else if (prev.length < 4) { // Limit to 4 locations for basic view
        return [...prev, locationName];
      }
      return prev;
    });
  };

  // Handle location removal
  const handleLocationRemove = (locationName) => {
    setSelectedLocations(prev => prev.filter(loc => loc !== locationName));
  };

  // Generate comparison data
  const generateComparisonData = () => {
    return selectedLocations.map(locationName => {
      const location = availableLocations.find(loc => loc.name === locationName);
      return {
        name: locationName,
        region: location?.region || 'Unknown',
        aqi: location?.aqi || 0,
        category: location?.category || 'Unknown',
        pm25: Math.floor(Math.random() * 30) + 10,
        pm10: Math.floor(Math.random() * 40) + 15,
        no2: Math.floor(Math.random() * 25) + 5,
        o3: Math.floor(Math.random() * 20) + 8,
        so2: Math.floor(Math.random() * 15) + 3
      };
    });
  };

  // Generate historical data for detailed view
  const generateHistoricalData = () => {
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    const data = [];
    
    hours.forEach(hour => {
      const hourData = { time: hour };
      selectedLocations.forEach(locationName => {
        const location = availableLocations.find(loc => loc.name === locationName);
        const baseValue = location?.aqi || 50;
        const variation = (Math.random() - 0.5) * 20;
        hourData[locationName] = Math.max(0, Math.floor(baseValue + variation));
      });
      data.push(hourData);
    });
    
    return data;
  };

  const comparisonData = generateComparisonData();
  const historicalData = generateHistoricalData();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Location Comparison</h3>
            <p className="text-sm text-gray-600">Compare air quality across different locations</p>
          </div>
        </div>
        
        {!isLoggedIn && (
          <button
            onClick={onLogin}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login for Details
          </button>
        )}
      </div>

      {/* Location Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Locations to Compare
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedLocations.map(locationName => (
            <div
              key={locationName}
              className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              <MapPin className="h-3 w-3 mr-1" />
              {locationName}
              <button
                onClick={() => handleLocationRemove(locationName)}
                className="ml-2 hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          {selectedLocations.length < 4 && (
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-3 py-1 border-2 border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Location
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredLocations
                      .filter(loc => !selectedLocations.includes(loc.name))
                      .map(location => (
                        <button
                          key={location.name}
                          onClick={() => handleLocationToggle(location.name)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium text-gray-900">{location.name}</div>
                            <div className="text-sm text-gray-500">{location.region}</div>
                          </div>
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getAQIColor(location.aqi) }}
                            ></div>
                            <span className="text-sm font-medium">{location.aqi}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Basic Comparison View */}
      {comparisonData.length > 0 && (
        <div className="space-y-6">
          {/* AQI Comparison Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Current AQI Levels</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'AQI']}
                    labelFormatter={(label) => `Location: ${label}`}
                  />
                  <Bar 
                    dataKey="aqi" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Location Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisonData.map((location, index) => (
              <div key={location.name} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">{location.name}</h5>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getAQIColor(location.aqi) }}
                  ></div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{location.aqi}</div>
                <div className="text-sm text-gray-600 mb-2">{location.category}</div>
                <div className="text-xs text-gray-500">{location.region}</div>
              </div>
            ))}
          </div>

          {/* Detailed View Toggle */}
          {isLoggedIn && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Detailed Analysis</h4>
                <button
                  onClick={() => setShowDetailedView(!showDetailedView)}
                  className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {showDetailedView ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showDetailedView ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {showDetailedView && (
                <div className="space-y-6">
                  {/* Historical Trend Chart */}
                  <div>
                    <h5 className="text-md font-semibold text-gray-900 mb-3">24-Hour Trend</h5>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          {selectedLocations.map((locationName, index) => (
                            <Line
                              key={locationName}
                              type="monotone"
                              dataKey={locationName}
                              stroke={getAQIColor(availableLocations.find(loc => loc.name === locationName)?.aqi || 50)}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pollutant Breakdown */}
                  <div>
                    <h5 className="text-md font-semibold text-gray-900 mb-3">Pollutant Breakdown</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {comparisonData.map(location => (
                        <div key={location.name} className="bg-gray-50 rounded-lg p-4">
                          <h6 className="font-semibold text-gray-900 mb-3">{location.name}</h6>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>PM2.5</span>
                              <span className="font-medium">{location.pm25} μg/m³</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>PM10</span>
                              <span className="font-medium">{location.pm10} μg/m³</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>NO₂</span>
                              <span className="font-medium">{location.no2} μg/m³</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>O₃</span>
                              <span className="font-medium">{location.o3} μg/m³</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>SO₂</span>
                              <span className="font-medium">{location.so2} μg/m³</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Login Prompt for Detailed View */}
          {!isLoggedIn && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <Lock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Unlock Detailed Analysis</h4>
                <p className="text-blue-700 mb-4">
                  Get access to historical trends, pollutant breakdowns, and advanced comparison features.
                </p>
                <button
                  onClick={onLogin}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login to View Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {comparisonData.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Locations Selected</h4>
          <p className="text-gray-600 mb-4">Add locations above to start comparing air quality data.</p>
        </div>
      )}
    </div>
  );
};

export default LocationComparison;
