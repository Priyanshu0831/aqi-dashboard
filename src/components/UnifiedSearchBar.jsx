import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Filter, Clock, MapPin, TrendingUp } from 'lucide-react';

const UnifiedSearchBar = ({ onSearch, onLocationSelect, stations, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    time: 'now',
    pollutant: 'all',
    region: 'all'
  });
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Quick filter options
  const quickFilters = [
    { id: 'now', label: 'Now', icon: Clock },
    { id: '24h', label: '24h', icon: TrendingUp },
    { id: 'pm25', label: 'PM2.5', icon: Filter },
    { id: 'pm10', label: 'PM10', icon: Filter }
  ];

  // Handle input change and generate suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      const filtered = stations.filter(station => 
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.region.toLowerCase().includes(value.toLowerCase())
      );
      
      // Add quick insights for each station
      const suggestionsWithInsights = filtered.slice(0, 6).map(station => ({
        ...station,
        insight: `${station.name} — AQI ${station.aqi} — ${getAQICategory(station.aqi)}`
      }));
      
      setSuggestions(suggestionsWithInsights);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (station) => {
    onLocationSelect(station);
    setQuery(station.name);
    setShowSuggestions(false);
  };

  // Handle quick filter selection
  const handleQuickFilter = (filterId) => {
    setActiveFilters(prev => ({
      ...prev,
      time: filterId === 'now' || filterId === '24h' ? filterId : prev.time,
      pollutant: filterId === 'pm25' || filterId === 'pm10' ? filterId : prev.pollutant
    }));
    
    // Trigger search with filter
    const filterQuery = `${query} ${filterId}`;
    handleSearch(filterQuery);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // AQI category helper
  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Satisfactory';
    if (aqi <= 150) return 'Moderate';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // AQI color helper
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 150) return 'text-orange-600';
    if (aqi <= 200) return 'text-red-600';
    if (aqi <= 300) return 'text-purple-600';
    return 'text-red-900';
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4 sm:px-0">
      <div className="relative" ref={searchRef}>
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
            onFocus={() => query.length > 2 && setShowSuggestions(true)}
            placeholder="Search city, region, station — or type like 'AQI Muscat last 3 days'"
            className="w-full pl-12 pr-20 py-3 text-sm sm:text-base border border-[#E6EDF3] rounded-xl focus:border-[#28784A] focus:outline-none transition-colors bg-white shadow-sm h-12"
            aria-label="Search for air quality data by city, region, or station"
            role="searchbox"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <button
              onClick={() => handleSearch(query)}
              className="p-2 text-gray-400 hover:text-[#28784A] transition-colors rounded-lg hover:bg-gray-100"
            >
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-[#28784A] transition-colors rounded-lg hover:bg-gray-100">
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>


        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
            role="listbox"
            aria-label="Search suggestions"
          >
            {/* Locations Column */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Locations
              </h4>
              <div className="space-y-1">
                {suggestions.slice(0, 3).map((station) => (
                  <button
                    key={station.id}
                    onClick={() => handleLocationSelect(station)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    role="option"
                    aria-label={`Select ${station.name} in ${station.region} with AQI ${station.aqi}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{station.name}</p>
                        <p className="text-xs text-gray-500">{station.region}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getAQIColor(station.aqi)}`}>
                          AQI {station.aqi}
                        </p>
                        <p className="text-xs text-gray-500">{getAQICategory(station.aqi)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Insights Column */}
            <div className="p-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Quick Insights
              </h4>
              <div className="space-y-1">
                {suggestions.slice(0, 3).map((station) => (
                  <div
                    key={`insight-${station.id}`}
                    className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg"
                  >
                    {station.insight}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Location Display */}
      {currentLocation && (
        <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Currently viewing: {currentLocation.name}, {currentLocation.region}</span>
        </div>
      )}
    </div>
  );
};

export default UnifiedSearchBar;
