import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Plus, X, Download, Share2, TrendingUp, TrendingDown, 
  MapPin, BarChart3, PieChart as PieChartIcon, Activity,
  AlertTriangle, CheckCircle, Clock, Filter, Search, ChevronDown
} from 'lucide-react';

const CompareWidget = ({ stations = [], locations = {} }) => {
  const [selectedLocations, setSelectedLocations] = useState(['Muscat Central', 'Nizwa']);
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');
  const [viewMode, setViewMode] = useState('chart'); // chart, radar, table
  const [timeRange, setTimeRange] = useState('24h'); // 24h, 7d, 30d
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Available cities/regions for comparison
  const availableLocations = [
    { name: 'Muscat Central', region: 'Muscat', type: 'city' },
    { name: 'Nizwa', region: 'Ad Dakhiliyah', type: 'city' },
    { name: 'Salalah', region: 'Dhofar', type: 'city' },
    { name: 'Sohar', region: 'Al Batinah North', type: 'city' },
    { name: 'Sur', region: 'Ash Sharqiyah South', type: 'city' },
    { name: 'Ibri', region: 'Ad Dhahirah', type: 'city' },
    { name: 'Buraimi', region: 'Al Buraimi', type: 'city' },
    { name: 'Khasab', region: 'Musandam', type: 'city' },
    { name: 'Rustaq', region: 'Al Batinah South', type: 'city' },
    { name: 'Ibra', region: 'Ash Sharqiyah North', type: 'city' }
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
      } else if (prev.length < 5) { // Limit to 5 locations
        return [...prev, locationName];
      }
      return prev;
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle location removal
  const handleLocationRemove = (locationName) => {
    setSelectedLocations(prev => prev.filter(loc => loc !== locationName));
  };

  // Generate comparison data
  const generateComparisonData = () => {
    const data = [];
    const pollutants = ['pm25', 'pm10', 'no2', 'o3', 'so2'];
    
    selectedLocations.forEach(locationName => {
      const locationData = locations[locationName];
      if (locationData) {
        const locationInfo = availableLocations.find(loc => loc.name === locationName);
        data.push({
          name: locationName,
          region: locationInfo?.region || 'Unknown',
          aqi: locationData.currentAQI.value,
          category: locationData.currentAQI.category,
          pm25: locationData.pollutants.find(p => p.name === 'PM2.5')?.value || 0,
          pm10: locationData.pollutants.find(p => p.name === 'PM10')?.value || 0,
          no2: locationData.pollutants.find(p => p.name === 'NO2')?.value || 0,
          o3: locationData.pollutants.find(p => p.name === 'O3')?.value || 0,
          so2: locationData.pollutants.find(p => p.name === 'SO2')?.value || 0,
          temperature: locationData.weather.temperature,
          humidity: locationData.weather.humidity,
          windSpeed: locationData.weather.windSpeed,
          trend: locationData.currentAQI.trend
        });
      }
    });
    
    return data;
  };

  // Generate historical comparison data
  const generateHistoricalData = () => {
    const data = [];
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    
    hours.forEach(hour => {
      const hourData = { time: hour };
      selectedLocations.forEach((locationName, index) => {
        const locationData = locations[locationName];
        let value = 0;
        
        if (locationData && locationData.historicalData) {
          const historicalPoint = locationData.historicalData.find(h => h.time === hour);
          if (historicalPoint) {
            value = historicalPoint[selectedPollutant] || 0;
          }
        }
        
        // If no data found or value is 0, generate realistic values based on location and time
        if (value === 0) {
          const baseValue = getBaseValueForLocation(locationName, selectedPollutant);
          const timeMultiplier = getTimeMultiplier(hour);
          const variation = (Math.random() - 0.5) * 10; // ±5 variation
          value = Math.max(0, Math.round(baseValue * timeMultiplier + variation));
        }
        
        hourData[locationName] = value;
      });
      data.push(hourData);
    });
    
    return data;
  };

  // Get base value for a location and pollutant
  const getBaseValueForLocation = (locationName, pollutant) => {
    const baseValues = {
      'Muscat Central': { pm25: 35, pm10: 28, no2: 15, o3: 8, so2: 2, aqi: 85 },
      'Nizwa': { pm25: 28, pm10: 32, no2: 12, o3: 6, so2: 2, aqi: 72 },
      'Salalah': { pm25: 42, pm10: 38, no2: 18, o3: 10, so2: 3, aqi: 95 },
      'Sohar': { pm25: 38, pm10: 35, no2: 16, o3: 9, so2: 2, aqi: 88 },
      'Sur': { pm25: 32, pm10: 30, no2: 14, o3: 7, so2: 2, aqi: 78 },
      'Ibri': { pm25: 40, pm10: 36, no2: 17, o3: 9, so2: 3, aqi: 92 },
      'Buraimi': { pm25: 36, pm10: 33, no2: 15, o3: 8, so2: 2, aqi: 86 },
      'Khasab': { pm25: 30, pm10: 28, no2: 13, o3: 6, so2: 2, aqi: 75 },
      'Rustaq': { pm25: 34, pm10: 31, no2: 14, o3: 7, so2: 2, aqi: 82 },
      'Ibra': { pm25: 33, pm10: 29, no2: 13, o3: 7, so2: 2, aqi: 80 }
    };
    
    return baseValues[locationName]?.[pollutant] || 30;
  };

  // Get time multiplier for realistic daily patterns
  const getTimeMultiplier = (hour) => {
    const hourNum = parseInt(hour.split(':')[0]);
    // Higher values during peak hours (morning and evening)
    if (hourNum >= 6 && hourNum <= 9) return 1.2; // Morning rush
    if (hourNum >= 17 && hourNum <= 19) return 1.3; // Evening rush
    if (hourNum >= 12 && hourNum <= 15) return 1.1; // Afternoon
    if (hourNum >= 22 || hourNum <= 5) return 0.8; // Night time
    return 1.0; // Other times
  };

  // Generate radar chart data
  const generateRadarData = () => {
    const pollutants = ['pm25', 'pm10', 'no2', 'o3', 'so2'];
    const data = [];
    
    selectedLocations.forEach(locationName => {
      const locationData = locations[locationName];
      if (locationData) {
        const radarData = {
          location: locationName,
          PM2_5: locationData.pollutants.find(p => p.name === 'PM2.5')?.value || 0,
          PM10: locationData.pollutants.find(p => p.name === 'PM10')?.value || 0,
          NO2: locationData.pollutants.find(p => p.name === 'NO2')?.value || 0,
          O3: locationData.pollutants.find(p => p.name === 'O3')?.value || 0,
          SO2: locationData.pollutants.find(p => p.name === 'SO2')?.value || 0
        };
        data.push(radarData);
      }
    });
    
    return data;
  };

  const comparisonData = generateComparisonData();
  const historicalData = generateHistoricalData();
  const radarData = generateRadarData();

  // Calculate comparison insights
  const getComparisonInsights = () => {
    if (comparisonData.length < 2) return [];
    
    const insights = [];
    const aqiValues = comparisonData.map(d => d.aqi);
    const bestLocation = comparisonData.find(d => d.aqi === Math.min(...aqiValues));
    const worstLocation = comparisonData.find(d => d.aqi === Math.max(...aqiValues));
    
    insights.push({
      type: 'best',
      message: `${bestLocation.name} has the best air quality (AQI: ${bestLocation.aqi})`,
      icon: CheckCircle,
      color: 'text-green-600'
    });
    
    if (worstLocation.aqi > bestLocation.aqi + 20) {
      insights.push({
        type: 'warning',
        message: `${worstLocation.name} has significantly worse air quality than ${bestLocation.name}`,
        icon: AlertTriangle,
        color: 'text-orange-600'
      });
    }
    
    const avgAQI = Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length);
    insights.push({
      type: 'average',
      message: `Average AQI across selected locations: ${avgAQI}`,
      icon: BarChart3,
      color: 'text-blue-600'
    });
    
    return insights;
  };

  const insights = getComparisonInsights();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Compare Locations</h3>
          <p className="text-sm text-gray-600">Compare air quality across different cities and regions</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-[#28784A] text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Location Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Select Locations to Compare</h4>
          <span className="text-xs text-gray-500">{selectedLocations.length}/5 selected</span>
        </div>
        
        {/* Selected Locations */}
        {selectedLocations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedLocations.map((locationName) => {
              const locationData = locations[locationName];
              const aqi = locationData?.currentAQI?.value || 0;
              const locationInfo = availableLocations.find(loc => loc.name === locationName);
              
              return (
                <div
                  key={locationName}
                  className="flex items-center space-x-2 bg-[#28784A] text-white px-3 py-2 rounded-lg text-sm"
                >
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: getAQIColor(aqi) }}
                  />
                  <span className="font-medium">{locationName}</span>
                  <button
                    onClick={() => handleLocationRemove(locationName)}
                    className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Multi-select Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28784A] focus:border-transparent transition-colors"
          >
            <span className="text-gray-700">
              {selectedLocations.length === 0 ? 'Select locations to compare...' : `${selectedLocations.length} location(s) selected`}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search locations..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28784A] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Location List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredLocations.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500 text-center">No locations found</div>
                ) : (
                  filteredLocations.map((location) => {
                    const isSelected = selectedLocations.includes(location.name);
                    const locationData = locations[location.name];
                    const aqi = locationData?.currentAQI?.value || 0;
                    const isDisabled = !isSelected && selectedLocations.length >= 5;
                    
                    return (
                      <button
                        key={location.name}
                        onClick={() => {
                          handleLocationToggle(location.name);
                          setSearchQuery('');
                        }}
                        disabled={isDisabled}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-[#28784A] text-white hover:bg-green-700' : ''
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: isSelected ? 'white' : getAQIColor(aqi) }}
                          />
                          <div>
                            <div className="font-medium text-sm">{location.name}</div>
                            <div className={`text-xs ${isSelected ? 'text-green-100' : 'text-gray-500'}`}>
                              {location.region}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            AQI {aqi}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-green-100' : 'text-gray-500'}`}>
                            {getAQICategory(aqi)}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedPollutant}
            onChange={(e) => setSelectedPollutant(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28784A]"
          >
            <option value="aqi">AQI</option>
            <option value="pm25">PM2.5</option>
            <option value="pm10">PM10</option>
            <option value="no2">NO₂</option>
            <option value="o3">O₃</option>
            <option value="so2">SO₂</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28784A]"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>

        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              viewMode === 'chart' ? 'bg-white text-[#28784A] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              viewMode === 'radar' ? 'bg-white text-[#28784A] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              viewMode === 'table' ? 'bg-white text-[#28784A] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comparison Insights */}
      {insights.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Key Insights</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Icon className={`w-5 h-5 ${insight.color}`} />
                  <span className="text-sm text-gray-700">{insight.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts */}
      {selectedLocations.length > 0 && (
        <div className="space-y-6">
          {/* Historical Trends */}
          {viewMode === 'chart' && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">Historical Trends</h4>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    {selectedLocations.map((location, index) => (
                      <Line
                        key={location}
                        type="monotone"
                        dataKey={location}
                        stroke={['#28784A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]}
                        strokeWidth={2}
                        dot={{ fill: ['#28784A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5], strokeWidth: 2, r: 4 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Current AQI Comparison */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Current AQI Comparison</h4>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => [value, 'AQI']}
                  />
                  <Bar 
                    dataKey="aqi" 
                    fill="#28784A"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart */}
          {viewMode === 'radar' && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">Pollutant Comparison</h4>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="location" />
                    <PolarRadiusAxis angle={30} domain={[0, 50]} />
                    <Radar
                      name="PM2.5"
                      dataKey="PM2_5"
                      stroke="#28784A"
                      fill="#28784A"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="PM10"
                      dataKey="PM10"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="NO2"
                      dataKey="NO2"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="O3"
                      dataKey="O3"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="SO2"
                      dataKey="SO2"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {viewMode === 'table' && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">Detailed Comparison</h4>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full border-collapse min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AQI</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">PM2.5</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">PM10</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">NO₂</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">O₃</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">SO₂</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Temp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comparisonData.map((location, index) => (
                      <tr key={location.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{location.name}</div>
                            <div className="text-sm text-gray-500">{location.region}</div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: getAQIColor(location.aqi) }}
                            />
                            <span className="text-sm font-medium text-gray-900">{location.aqi}</span>
                          </div>
                          <div className="text-xs text-gray-500">{location.category}</div>
                        </td>
                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{location.pm25} μg/m³</td>
                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{location.pm10} μg/m³</td>
                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">{location.no2} μg/m³</td>
                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">{location.o3} μg/m³</td>
                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">{location.so2} μg/m³</td>
                        <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{location.temperature}°C</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {selectedLocations.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No locations selected</h3>
          <p className="text-gray-500 mb-4">Select at least 2 locations to start comparing air quality data</p>
          <button
            onClick={() => setSelectedLocations(['Muscat Central', 'Nizwa'])}
            className="px-4 py-2 bg-[#28784A] text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Sample Locations
          </button>
        </div>
      )}
    </div>
  );
};

export default CompareWidget;
