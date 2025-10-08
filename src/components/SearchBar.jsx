import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  X, 
  Calendar,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Clock,
  ChevronDown,
  Check
} from 'lucide-react';

const SearchBar = ({ onFiltersChange, filters }) => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Enhanced location data with more details
  const locations = [
    { id: 1, name: 'Muscat Central', region: 'Muscat', lat: 23.6141, lng: 58.5922, aqi: 85, population: 1.5 },
    { id: 2, name: 'Nizwa', region: 'Ad Dakhiliyah', lat: 22.9333, lng: 57.5333, aqi: 72, population: 0.3 },
    { id: 3, name: 'Salalah', region: 'Dhofar', lat: 17.0151, lng: 54.0924, aqi: 95, population: 0.4 },
    { id: 4, name: 'Sohar', region: 'Al Batinah North', lat: 24.3644, lng: 56.7439, aqi: 78, population: 0.2 },
    { id: 5, name: 'Sur', region: 'Ash Sharqiyah South', lat: 22.5667, lng: 59.5289, aqi: 68, population: 0.1 },
    { id: 6, name: 'Ibri', region: 'Ad Dhahirah', lat: 23.2257, lng: 56.5156, aqi: 82, population: 0.15 },
    { id: 7, name: 'Buraimi', region: 'Al Buraimi', lat: 24.2500, lng: 55.8000, aqi: 75, population: 0.1 },
    { id: 8, name: 'Khasab', region: 'Musandam', lat: 26.1799, lng: 56.2477, aqi: 70, population: 0.05 },
    { id: 9, name: 'Rustaq', region: 'Al Batinah South', lat: 23.3908, lng: 57.4244, aqi: 88, population: 0.12 },
    { id: 10, name: 'Ibra', region: 'Ash Sharqiyah North', lat: 22.6900, lng: 58.5500, aqi: 79, population: 0.08 }
  ];

  const regions = [...new Set(locations.map(loc => loc.region))];

  // Handle search input and suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = locations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location) => {
    setSearchQuery(location.name);
    setShowSuggestions(false);
    onFiltersChange({
      ...filters,
      selectedLocation: location,
      selectedRegion: location.region
    });
  };

  const handleRegionSelect = (region) => {
    onFiltersChange({
      ...filters,
      selectedRegion: region,
      selectedLocation: null
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    onFiltersChange({
      selectedLocation: null,
      selectedRegion: null
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.selectedLocation || filters.selectedRegion) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8" ref={dropdownRef}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Search Location</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
          </span>
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Location Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-gray-800">{location.name}</div>
                      <div className="text-sm text-gray-500">{location.region}</div>
                    </div>
                    <div className="text-sm text-gray-400">AQI: {location.aqi}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Region Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Region
          </label>
          <button
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50"
          >
            <span className={filters.selectedRegion ? 'text-gray-800' : 'text-gray-500'}>
              {filters.selectedRegion || 'Select Region'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {isLocationDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <button
                onClick={() => handleRegionSelect(null)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="text-gray-500">All Regions</span>
                {!filters.selectedRegion && <Check className="w-4 h-4 text-blue-500" />}
              </button>
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionSelect(region)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{region}</span>
                  {filters.selectedRegion === region && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
