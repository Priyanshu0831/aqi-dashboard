import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Thermometer, Droplets, Wind, Sun, Eye, 
  Download, Share2, 
  Clock, Maximize2, RotateCcw, Search, Mic, 
  TrendingUp, TrendingDown, Minus, 
  MapPin, Globe, User, Moon, Sun as SunIcon,
  MessageCircle, Sparkles, AlertTriangle,
  ChevronRight, Filter, RefreshCw, Home,
  Settings, Bell, HelpCircle, BarChart3,
  Calendar, Clock as ClockIcon, Zap, CheckCircle, XCircle,
  ChevronDown, LogOut, Shield, UserCheck
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import new components
import AIRecommender from './components/AIRecommender';
import UnifiedSearchBar from './components/UnifiedSearchBar';
import WeatherWidget from './components/WeatherWidget';
import AQICard from './components/AQICard';
import PollutantTooltip from './components/PollutantTooltip';
import FullScreenMapView from './components/FullScreenMapView';
import CompareWidget from './components/CompareWidget';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Enhanced sample data with more comprehensive information
const sampleData = {
  // Location-specific data
  locations: {
    'Muscat Central': {
      currentAQI: { value: 85, category: 'Satisfactory', primaryPollutant: 'PM2.5', lastUpdate: '2025-01-27 14:30', trend: [65, 70, 75, 80, 78, 82, 85] },
      weather: { temperature: 28, humidity: 65, windSpeed: 12, windDirection: 'NE', uvIndex: 6 },
      pollutants: [
        { name: 'PM2.5', value: 35, percentage: 40 },
        { name: 'PM10', value: 28, percentage: 32 },
        { name: 'NO2', value: 15, percentage: 17 },
        { name: 'O3', value: 8, percentage: 9 },
        { name: 'SO2', value: 2, percentage: 2 }
      ],
      historicalData: [
        { time: '00:00', pm25: 30, pm10: 25, no2: 12, o3: 5 },
        { time: '04:00', pm25: 35, pm10: 28, no2: 15, o3: 6 },
        { time: '08:00', pm25: 40, pm10: 32, no2: 18, o3: 8 },
        { time: '12:00', pm25: 45, pm10: 35, no2: 20, o3: 10 },
        { time: '16:00', pm25: 42, pm10: 33, no2: 19, o3: 9 },
        { time: '20:00', pm25: 38, pm10: 30, no2: 16, o3: 7 }
      ],
      forecastData: [
        { hour: 'Now', aqi: 85, confidence: 95 },
        { hour: '+6h', aqi: 88, confidence: 90 },
        { hour: '+12h', aqi: 92, confidence: 85 },
        { hour: '+18h', aqi: 89, confidence: 88 },
        { hour: '+24h', aqi: 86, confidence: 92 },
        { hour: '+48h', aqi: 83, confidence: 85 },
        { hour: '+72h', aqi: 80, confidence: 80 }
      ]
    },
    'Nizwa': {
      currentAQI: { value: 72, category: 'Satisfactory', primaryPollutant: 'PM10', lastUpdate: '2025-01-27 14:25', trend: [60, 65, 68, 70, 72, 75, 72] },
      weather: { temperature: 26, humidity: 58, windSpeed: 8, windDirection: 'NW', uvIndex: 7 },
      pollutants: [
        { name: 'PM2.5', value: 28, percentage: 35 },
        { name: 'PM10', value: 32, percentage: 40 },
        { name: 'NO2', value: 12, percentage: 15 },
        { name: 'O3', value: 6, percentage: 7 },
        { name: 'SO2', value: 2, percentage: 3 }
      ],
      historicalData: [
        { time: '00:00', pm25: 25, pm10: 28, no2: 10, o3: 4 },
        { time: '04:00', pm25: 28, pm10: 30, no2: 12, o3: 5 },
        { time: '08:00', pm25: 32, pm10: 35, no2: 15, o3: 6 },
        { time: '12:00', pm25: 35, pm10: 38, no2: 18, o3: 8 },
        { time: '16:00', pm25: 33, pm10: 36, no2: 16, o3: 7 },
        { time: '20:00', pm25: 30, pm10: 32, no2: 13, o3: 5 }
      ],
      forecastData: [
        { hour: 'Now', aqi: 72, confidence: 92 },
        { hour: '+6h', aqi: 75, confidence: 88 },
        { hour: '+12h', aqi: 78, confidence: 85 },
        { hour: '+18h', aqi: 76, confidence: 90 },
        { hour: '+24h', aqi: 74, confidence: 93 },
        { hour: '+48h', aqi: 71, confidence: 87 },
        { hour: '+72h', aqi: 69, confidence: 82 }
      ]
    },
    'Salalah': {
      currentAQI: { value: 95, category: 'Moderate', primaryPollutant: 'PM2.5', lastUpdate: '2025-01-27 14:35', trend: [80, 85, 88, 92, 90, 93, 95] },
      weather: { temperature: 32, humidity: 72, windSpeed: 15, windDirection: 'SE', uvIndex: 8 },
      pollutants: [
        { name: 'PM2.5', value: 42, percentage: 45 },
        { name: 'PM10', value: 35, percentage: 38 },
        { name: 'NO2', value: 18, percentage: 12 },
        { name: 'O3', value: 10, percentage: 3 },
        { name: 'SO2', value: 2, percentage: 2 }
      ],
      historicalData: [
        { time: '00:00', pm25: 35, pm10: 30, no2: 15, o3: 8 },
        { time: '04:00', pm25: 38, pm10: 32, no2: 17, o3: 9 },
        { time: '08:00', pm25: 42, pm10: 35, no2: 20, o3: 10 },
        { time: '12:00', pm25: 45, pm10: 38, no2: 22, o3: 12 },
        { time: '16:00', pm25: 43, pm10: 36, no2: 21, o3: 11 },
        { time: '20:00', pm25: 40, pm10: 33, no2: 18, o3: 9 }
      ],
      forecastData: [
        { hour: 'Now', aqi: 95, confidence: 88 },
        { hour: '+6h', aqi: 98, confidence: 85 },
        { hour: '+12h', aqi: 102, confidence: 82 },
        { hour: '+18h', aqi: 100, confidence: 86 },
        { hour: '+24h', aqi: 97, confidence: 89 },
        { hour: '+48h', aqi: 94, confidence: 84 },
        { hour: '+72h', aqi: 91, confidence: 80 }
      ]
    },
    'Sohar': {
      currentAQI: { value: 78, category: 'Satisfactory', primaryPollutant: 'PM10', lastUpdate: '2025-01-27 14:28', trend: [70, 72, 75, 78, 76, 79, 78] },
      weather: { temperature: 30, humidity: 68, windSpeed: 10, windDirection: 'N', uvIndex: 7 },
      pollutants: [
        { name: 'PM2.5', value: 32, percentage: 38 },
        { name: 'PM10', value: 30, percentage: 36 },
        { name: 'NO2', value: 14, percentage: 17 },
        { name: 'O3', value: 7, percentage: 8 },
        { name: 'SO2', value: 1, percentage: 1 }
      ],
      historicalData: [
        { time: '00:00', pm25: 28, pm10: 26, no2: 12, o3: 6 },
        { time: '04:00', pm25: 30, pm10: 28, no2: 13, o3: 6 },
        { time: '08:00', pm25: 33, pm10: 31, no2: 15, o3: 7 },
        { time: '12:00', pm25: 36, pm10: 34, no2: 17, o3: 8 },
        { time: '16:00', pm25: 34, pm10: 32, no2: 16, o3: 7 },
        { time: '20:00', pm25: 31, pm10: 29, no2: 14, o3: 6 }
      ],
      forecastData: [
        { hour: 'Now', aqi: 78, confidence: 90 },
        { hour: '+6h', aqi: 81, confidence: 87 },
        { hour: '+12h', aqi: 84, confidence: 84 },
        { hour: '+18h', aqi: 82, confidence: 88 },
        { hour: '+24h', aqi: 80, confidence: 91 },
        { hour: '+48h', aqi: 77, confidence: 86 },
        { hour: '+72h', aqi: 75, confidence: 83 }
      ]
    },
    'Sur': {
      currentAQI: { value: 68, category: 'Satisfactory', primaryPollutant: 'O3', lastUpdate: '2025-01-27 14:32', trend: [60, 62, 65, 68, 66, 69, 68] },
      weather: { temperature: 29, humidity: 62, windSpeed: 14, windDirection: 'E', uvIndex: 6 },
      pollutants: [
        { name: 'PM2.5', value: 25, percentage: 32 },
        { name: 'PM10', value: 22, percentage: 28 },
        { name: 'NO2', value: 10, percentage: 13 },
        { name: 'O3', value: 18, percentage: 23 },
        { name: 'SO2', value: 3, percentage: 4 }
      ],
      historicalData: [
        { time: '00:00', pm25: 22, pm10: 20, no2: 8, o3: 15 },
        { time: '04:00', pm25: 24, pm10: 22, no2: 9, o3: 16 },
        { time: '08:00', pm25: 27, pm10: 25, no2: 11, o3: 17 },
        { time: '12:00', pm25: 30, pm10: 28, no2: 13, o3: 19 },
        { time: '16:00', pm25: 28, pm10: 26, no2: 12, o3: 18 },
        { time: '20:00', pm25: 25, pm10: 23, no2: 10, o3: 16 }
      ],
      forecastData: [
        { hour: 'Now', aqi: 68, confidence: 94 },
        { hour: '+6h', aqi: 71, confidence: 91 },
        { hour: '+12h', aqi: 74, confidence: 88 },
        { hour: '+18h', aqi: 72, confidence: 92 },
        { hour: '+24h', aqi: 70, confidence: 95 },
        { hour: '+48h', aqi: 67, confidence: 89 },
        { hour: '+72h', aqi: 65, confidence: 85 }
      ]
    }
  },
  stations: [
    { id: 1, name: 'Muscat Central', lat: 23.6141, lng: 58.5922, aqi: 85, pm25: 35, pm10: 28, region: 'Muscat' },
    { id: 2, name: 'Nizwa', lat: 22.9333, lng: 57.5333, aqi: 72, pm25: 28, pm10: 32, region: 'Ad Dakhiliyah' },
    { id: 3, name: 'Salalah', lat: 17.0151, lng: 54.0924, aqi: 95, pm25: 42, pm10: 35, region: 'Dhofar' },
    { id: 4, name: 'Sohar', lat: 24.3644, lng: 56.7439, aqi: 78, pm25: 32, pm10: 30, region: 'Al Batinah North' },
    { id: 5, name: 'Sur', lat: 22.5667, lng: 59.5289, aqi: 68, pm25: 25, pm10: 22, region: 'Ash Sharqiyah South' },
    { id: 6, name: 'Ibri', lat: 23.2257, lng: 56.5156, aqi: 82, pm25: 33, pm10: 29, region: 'Ad Dhahirah' },
    { id: 7, name: 'Buraimi', lat: 24.2500, lng: 55.8000, aqi: 75, pm25: 30, pm10: 27, region: 'Al Buraimi' },
    { id: 8, name: 'Khasab', lat: 26.1799, lng: 56.2477, aqi: 70, pm25: 26, pm10: 24, region: 'Musandam' },
    { id: 9, name: 'Rustaq', lat: 23.3908, lng: 57.4244, aqi: 88, pm25: 36, pm10: 31, region: 'Al Batinah South' },
    { id: 10, name: 'Ibra', lat: 22.6900, lng: 58.5500, aqi: 79, pm25: 31, pm10: 28, region: 'Ash Sharqiyah North' }
  ],
  news: [
    {
      id: 1,
      title: 'Air Quality Improves Across Oman Following Recent Weather Changes',
      snippet: 'Recent weather patterns have contributed to better air quality conditions...',
      source: 'EA News',
      date: '2025-01-27',
      category: 'Air Quality'
    },
    {
      id: 2,
      title: 'New Monitoring Station Opens in Dhofar Governorate',
      snippet: 'The Environment Authority announces the opening of a new air quality monitoring station...',
      source: 'EA News',
      date: '2025-01-26',
      category: 'EA News'
    },
    {
      id: 3,
      title: 'Health Advisory: High AQI Levels Expected This Week',
      snippet: 'Residents with respiratory conditions are advised to limit outdoor activities...',
      source: 'Health Ministry',
      date: '2025-01-25',
      category: 'Health Advisory'
    }
  ]
};

// Helper functions
const getAQIColor = (aqi) => {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  if (aqi <= 300) return 'bg-purple-500';
  return 'bg-red-900';
};

const getAQICategory = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 150) return 'Moderate';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const getAQITextColor = (aqi) => {
  if (aqi <= 50) return 'text-green-600';
  if (aqi <= 100) return 'text-yellow-600';
  if (aqi <= 150) return 'text-orange-600';
  if (aqi <= 200) return 'text-red-600';
  if (aqi <= 300) return 'text-purple-600';
  return 'text-red-900';
};

// Data filtering functions
const filterDataByLocation = (data, selectedLocation, selectedRegion) => {
  if (selectedLocation) {
    return data.locations[selectedLocation.name] || data.locations['Muscat Central'];
  } else if (selectedRegion) {
    // Return average data for the region
    const regionStations = data.stations.filter(station => station.region === selectedRegion);
    if (regionStations.length === 0) return data.locations['Muscat Central'];
    
    const regionData = regionStations.map(station => data.locations[station.name]).filter(Boolean);
    if (regionData.length === 0) return data.locations['Muscat Central'];
    
    // Calculate averages
    const avgData = {
      currentAQI: {
        value: Math.round(regionData.reduce((sum, loc) => sum + loc.currentAQI.value, 0) / regionData.length),
        category: getAQICategory(Math.round(regionData.reduce((sum, loc) => sum + loc.currentAQI.value, 0) / regionData.length)),
        primaryPollutant: regionData[0].currentAQI.primaryPollutant,
        lastUpdate: regionData[0].currentAQI.lastUpdate,
        trend: regionData[0].currentAQI.trend
      },
      weather: {
        temperature: Math.round(regionData.reduce((sum, loc) => sum + loc.weather.temperature, 0) / regionData.length),
        humidity: Math.round(regionData.reduce((sum, loc) => sum + loc.weather.humidity, 0) / regionData.length),
        windSpeed: Math.round(regionData.reduce((sum, loc) => sum + loc.weather.windSpeed, 0) / regionData.length),
        windDirection: regionData[0].weather.windDirection,
        uvIndex: Math.round(regionData.reduce((sum, loc) => sum + loc.weather.uvIndex, 0) / regionData.length)
      },
      pollutants: regionData[0].pollutants,
      historicalData: regionData[0].historicalData,
      forecastData: regionData[0].forecastData
    };
    return avgData;
  }
  return data.locations['Muscat Central'];
};

const filterStationsByRegion = (stations, selectedRegion) => {
  if (selectedRegion) {
    return stations.filter(station => station.region === selectedRegion);
  }
  return stations;
};

// Widget Components (Legacy - keeping for compatibility)

const MapView = ({ stations, selectedIndex, onIndexChange }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Air Quality Map</h3>
      <div className="flex items-center space-x-2">
        <select 
          value={selectedIndex} 
          onChange={(e) => onIndexChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="aqi">AQI</option>
          <option value="pm25">PM2.5</option>
          <option value="pm10">PM10</option>
          <option value="weather">Weather</option>
          <option value="humidity">Humidity</option>
        </select>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div className="h-96 rounded-xl overflow-hidden relative z-10">
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
          <Marker key={station.id} position={[station.lat, station.lng]}>
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-gray-800">{station.name}</h4>
                <p className="text-sm text-gray-600">Region: {station.region}</p>
                <p className="text-sm text-gray-600">AQI: {station.aqi}</p>
                <p className="text-sm text-gray-600">PM2.5: {station.pm25} μg/m³</p>
                <p className="text-sm text-gray-600">PM10: {station.pm10} μg/m³</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  </div>
);

const PollutantBreakdown = ({ data }) => {
  const [viewMode, setViewMode] = useState('pie'); // pie, bar, donut
  const [sortBy, setSortBy] = useState('value'); // value, percentage, name
  const [showHealthImpact, setShowHealthImpact] = useState(true);
  const [selectedPollutant, setSelectedPollutant] = useState(null);

  const COLORS = ['#28784A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#10B981', '#F97316', '#8B5CF6'];
  
  // Enhanced data processing
  const processedData = [...(data || [])].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.value - a.value;
      case 'percentage':
        return b.percentage - a.percentage;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getHealthImpact = (pollutant, value) => {
    const thresholds = {
      'PM2.5': { good: 12, moderate: 35, unhealthy: 55 },
      'PM10': { good: 20, moderate: 50, unhealthy: 100 },
      'NO2': { good: 40, moderate: 100, unhealthy: 200 },
      'O3': { good: 50, moderate: 100, unhealthy: 150 },
      'SO2': { good: 20, moderate: 50, unhealthy: 100 }
    };
    
    const threshold = thresholds[pollutant] || { good: 50, moderate: 100, unhealthy: 150 };
    
    if (value <= threshold.good) return { level: 'Good', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (value <= threshold.moderate) return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (value <= threshold.unhealthy) return { level: 'Unhealthy', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { level: 'Very Unhealthy', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const getPollutantUnit = (pollutant) => {
    const units = {
      'PM2.5': 'μg/m³',
      'PM10': 'μg/m³',
      'NO2': 'ppb',
      'O3': 'ppb',
      'SO2': 'ppb'
    };
    return units[pollutant] || 'μg/m³';
  };

  const getPollutantDescription = (pollutant) => {
    const descriptions = {
      'PM2.5': 'Fine particulate matter that can penetrate deep into lungs',
      'PM10': 'Coarse particulate matter that can irritate airways',
      'NO2': 'Nitrogen dioxide from vehicle emissions and industrial sources',
      'O3': 'Ground-level ozone formed by chemical reactions in sunlight',
      'SO2': 'Sulfur dioxide from burning fossil fuels'
    };
    return descriptions[pollutant] || 'Air pollutant';
  };

  const totalValue = processedData.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...processedData.map(item => item.value));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Pollutant Breakdown Analysis</h3>
          <p className="text-sm text-gray-600">Detailed analysis of air pollutant composition and health impacts</p>
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

      {/* Enhanced Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28784A] w-full"
          >
            <option value="pie">Pie Chart</option>
            <option value="donut">Donut Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28784A] w-full"
          >
            <option value="value">Sort by Value</option>
            <option value="percentage">Sort by Percentage</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="healthImpact"
              checked={showHealthImpact}
              onChange={(e) => setShowHealthImpact(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="healthImpact" className="text-sm text-gray-700">Show Health Impact</label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedPollutant(null)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedPollutant === null 
                ? 'bg-[#28784A] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Show All
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{processedData.length}</div>
          <div className="text-sm text-gray-600">Pollutants</div>
          <div className="text-xs text-gray-500">Monitored</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{totalValue.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Total Value</div>
          <div className="text-xs text-gray-500">μg/m³</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{maxValue.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Highest Value</div>
          <div className="text-xs text-gray-500">μg/m³</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {processedData.find(p => p.percentage === Math.max(...processedData.map(p => p.percentage)))?.name || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Dominant</div>
          <div className="text-xs text-gray-500">Pollutant</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Visualization</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'bar' ? (
                <BarChart data={processedData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#666" fontSize={12} width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name, props) => [
                      `${value} ${getPollutantUnit(props.payload.name)}`, 
                      props.payload.name
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {processedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={processedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={viewMode === 'donut' ? 60 : 0}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {processedData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke={selectedPollutant === entry.name ? '#1f2937' : 'white'}
                        strokeWidth={selectedPollutant === entry.name ? 3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name, props) => [
                      `${value} ${getPollutantUnit(props.payload.name)}`, 
                      props.payload.name
                    ]}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed List */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Detailed Analysis</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {processedData.map((pollutant, index) => {
              const healthImpact = getHealthImpact(pollutant.name, pollutant.value);
              const isSelected = selectedPollutant === pollutant.name;
              
              return (
                <div 
                  key={pollutant.name}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-[#28784A] bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPollutant(isSelected ? null : pollutant.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <h5 className="font-semibold text-gray-900">{pollutant.name}</h5>
                        <p className="text-xs text-gray-500">{getPollutantDescription(pollutant.name)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {pollutant.value} {getPollutantUnit(pollutant.name)}
                      </div>
                      <div className="text-sm text-gray-600">{pollutant.percentage}%</div>
                    </div>
                  </div>
                  
                  {showHealthImpact && (
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${healthImpact.bgColor} ${healthImpact.color}`}>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {healthImpact.level}
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(pollutant.value / maxValue) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Health Recommendations */}
      {showHealthImpact && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Health Recommendations</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Good Air Quality</div>
                <div className="text-xs text-gray-600">Safe for outdoor activities</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Moderate Concern</div>
                <div className="text-xs text-gray-600">Sensitive groups should limit outdoor activity</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Unhealthy Levels</div>
                <div className="text-xs text-gray-600">Avoid outdoor activities, use air purifiers</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HistoricalTrends = ({ data, selectedPollutant = 'pm25' }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [pollutant, setPollutant] = useState(selectedPollutant);
  const [chartType, setChartType] = useState('line');
  const [showForecast, setShowForecast] = useState(false);
  const [aggregation, setAggregation] = useState('hourly');

  // Enhanced data generation based on filters
  const generateEnhancedData = () => {
    const baseData = data || [];
    let enhancedData = [...baseData];
    
    // Add more data points for different time ranges
    if (timeRange === '7d') {
      enhancedData = generateWeekData();
    } else if (timeRange === '30d') {
      enhancedData = generateMonthData();
    }
    
    return enhancedData;
  };

  const generateWeekData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      time: day,
      pm25: Math.floor(Math.random() * 40) + 20,
      pm10: Math.floor(Math.random() * 35) + 15,
      no2: Math.floor(Math.random() * 25) + 10,
      o3: Math.floor(Math.random() * 15) + 5,
      so2: Math.floor(Math.random() * 8) + 2,
      aqi: Math.floor(Math.random() * 50) + 50
    }));
  };

  const generateMonthData = () => {
    const days = Array.from({length: 30}, (_, i) => i + 1);
    return days.map(day => ({
      time: `${day}`,
      pm25: Math.floor(Math.random() * 50) + 15,
      pm10: Math.floor(Math.random() * 45) + 10,
      no2: Math.floor(Math.random() * 30) + 5,
      o3: Math.floor(Math.random() * 20) + 3,
      so2: Math.floor(Math.random() * 10) + 1,
      aqi: Math.floor(Math.random() * 60) + 40
    }));
  };

  const enhancedData = generateEnhancedData();

  const getPollutantColor = (pollutant) => {
    const colors = {
      pm25: '#28784A',
      pm10: '#3B82F6',
      no2: '#F59E0B',
      o3: '#EF4444',
      so2: '#8B5CF6',
      aqi: '#10B981'
    };
    return colors[pollutant] || '#28784A';
  };

  const getPollutantUnit = (pollutant) => {
    const units = {
      pm25: 'μg/m³',
      pm10: 'μg/m³',
      no2: 'ppb',
      o3: 'ppb',
      so2: 'ppb',
      aqi: 'AQI'
    };
    return units[pollutant] || 'μg/m³';
  };

  const getPollutantName = (pollutant) => {
    const names = {
      pm25: 'PM2.5',
      pm10: 'PM10',
      no2: 'NO₂',
      o3: 'O₃',
      so2: 'SO₂',
      aqi: 'AQI'
    };
    return names[pollutant] || 'PM2.5';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Historical Trends Analysis</h3>
          <p className="text-sm text-gray-600">Comprehensive air quality data over time</p>
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

      {/* Enhanced Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28784A] w-full"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={pollutant}
            onChange={(e) => setPollutant(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28784A] w-full"
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
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28784A] w-full"
          >
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="forecast"
              checked={showForecast}
              onChange={(e) => setShowForecast(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="forecast" className="text-sm text-gray-700">Show Forecast</label>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(enhancedData.reduce((sum, d) => sum + (d[pollutant] || 0), 0) / enhancedData.length)}
          </div>
          <div className="text-sm text-gray-600">Average {getPollutantName(pollutant)}</div>
          <div className="text-xs text-gray-500">{getPollutantUnit(pollutant)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {Math.max(...enhancedData.map(d => d[pollutant] || 0))}
          </div>
          <div className="text-sm text-gray-600">Peak {getPollutantName(pollutant)}</div>
          <div className="text-xs text-gray-500">{getPollutantUnit(pollutant)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {Math.min(...enhancedData.map(d => d[pollutant] || 0))}
          </div>
          <div className="text-sm text-gray-600">Minimum {getPollutantName(pollutant)}</div>
          <div className="text-xs text-gray-500">{getPollutantUnit(pollutant)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {enhancedData.length}
          </div>
          <div className="text-sm text-gray-600">Data Points</div>
          <div className="text-xs text-gray-500">{timeRange}</div>
        </div>
      </div>

      {/* Enhanced Chart */}
      <div className="h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={enhancedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                stroke="#666" 
                fontSize={12}
                tick={{ fill: '#666' }}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12}
                tick={{ fill: '#666' }}
                label={{ value: getPollutantUnit(pollutant), angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }}
                formatter={(value) => [value, getPollutantName(pollutant)]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={pollutant} 
                stroke={getPollutantColor(pollutant)} 
                strokeWidth={3}
                dot={{ fill: getPollutantColor(pollutant), strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: getPollutantColor(pollutant), strokeWidth: 2 }}
              />
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart data={enhancedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [value, getPollutantName(pollutant)]}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={pollutant} 
                stroke={getPollutantColor(pollutant)} 
                fill={getPollutantColor(pollutant)}
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          ) : (
            <BarChart data={enhancedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [value, getPollutantName(pollutant)]}
              />
              <Legend />
              <Bar 
                dataKey={pollutant} 
                fill={getPollutantColor(pollutant)}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Trend Analysis */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Trend Analysis</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Overall Trend</div>
              <div className="text-xs text-gray-600">Slightly improving over time</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Peak Hours</div>
              <div className="text-xs text-gray-600">12:00 - 16:00</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Health Impact</div>
              <div className="text-xs text-gray-600">Moderate concern</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Forecast = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Air Quality Forecast</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="aqi" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Compare = ({ selectedStations = ['Muscat Central', 'Nizwa'], selectedPollutant = 'aqi' }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Compare Locations</h3>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
            Save Comparison
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData.historicalData}>
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
            {selectedStations.map((station, index) => (
              <Line 
                key={station}
                type="monotone" 
                dataKey="pm25" 
                stroke={['#3b82f6', '#10b981', '#f59e0b'][index]} 
                strokeWidth={2}
                name={station}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const NewsAndArticles = ({ data }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-label font-semibold text-lg">News & Articles</h3>
        <button className="text-[#28784A] hover:text-green-700 text-sm font-medium flex items-center space-x-1">
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.slice(0, 3).map((article, index) => (
          <div key={article.id} className="group border border-[#E6EDF3] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#28784A] transition-all duration-300">
            {/* Placeholder Image */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#28784A]/20 to-green-500/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">
                      {article.category === 'Air Quality' ? '🌬️' : 
                       article.category === 'Health Advisory' ? '🏥' : '📰'}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white/90">{article.category}</div>
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  article.category === 'Air Quality' 
                    ? 'bg-green-100 text-green-800'
                    : article.category === 'Health Advisory'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {article.category}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#6B7280]">{article.date}</span>
                <span className="text-xs text-[#6B7280]">{article.source}</span>
              </div>
              <h4 className="font-semibold text-[#111827] mb-3 group-hover:text-[#28784A] transition-colors line-clamp-2">{article.title}</h4>
              <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{article.snippet}</p>
              <div className="flex items-center justify-between">
                <button className="text-[#28784A] hover:text-green-700 text-sm font-medium group-hover:underline">
                  Read More
                </button>
                <button className="p-1 text-gray-400 hover:text-[#6B7280] transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* AI Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#E6F6EE] to-blue-50 rounded-xl border border-[#28784A]">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#28784A]" />
          <span className="text-sm font-medium text-[#111827]">AI Summary:</span>
        </div>
        <p className="text-sm text-[#6B7280]">
          Recent articles focus on PM2.5 rise and new monitoring stations. Health advisories recommend limiting outdoor activities in affected areas.
        </p>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-[#E6EDF3] mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Left: Copyright */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm text-[#6B7280]">
            © Environment Authority, Sultanate of Oman — 2025
          </p>
        </div>
        
        {/* Center: Quick Links */}
        <div className="flex flex-wrap justify-center space-x-6 mb-4 md:mb-0">
          <button className="text-sm text-[#6B7280] hover:text-[#28784A] transition-colors">FAQs</button>
          <button className="text-sm text-[#6B7280] hover:text-[#28784A] transition-colors">Open Data API</button>
          <button className="text-sm text-[#6B7280] hover:text-[#28784A] transition-colors">Terms</button>
          <button className="text-sm text-[#6B7280] hover:text-[#28784A] transition-colors">Contact</button>
        </div>
        
        {/* Right: Social & Contact */}
        <div className="flex items-center space-x-4">
          <div className="flex space-x-3">
            <button className="text-gray-400 hover:text-[#28784A] transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-[#28784A] transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-[#6B7280]">
            <p>+968 2449 0000</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// AI Insight Generator
const generateAIInsight = (data) => {
  const insights = [
    "Air quality is improving across most regions today. PM2.5 levels have decreased by 15% since morning.",
    "Dust levels are rising in northern regions due to wind patterns from the desert. Consider limiting outdoor activities.",
    "Ozone levels are within safe limits. Perfect weather for outdoor activities in coastal areas.",
    "Traffic-related pollutants are higher during peak hours. AQI expected to improve after 6 PM.",
    "Weather conditions are favorable for air quality. Light winds helping disperse pollutants effectively."
  ];
  return insights[Math.floor(Math.random() * insights.length)];
};

// Health Advisory Generator
const generateHealthAdvisory = (aqi) => {
  if (aqi <= 50) {
    return {
      message: "Air quality is good. Enjoy outdoor activities.",
      icon: "😊",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    };
  } else if (aqi <= 100) {
    return {
      message: "Air quality is satisfactory. Sensitive individuals should limit outdoor exercise.",
      icon: "🙂",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    };
  } else if (aqi <= 150) {
    return {
      message: "Air quality is moderate. Children and elderly should avoid prolonged outdoor activities.",
      icon: "😷",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    };
  } else {
    return {
      message: "Air quality is unhealthy. Avoid outdoor activities, especially exercise.",
      icon: "🚫",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    };
  }
};

// Smart Search Component
const SmartSearchBar = ({ onSearch, onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      const filtered = sampleData.stations.filter(station => 
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.region.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

        return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Ask about air quality... 'Show me AQI in Muscat' or 'Which region has best air today?'"
          className="w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
          <button
            onClick={() => handleSearch(query)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
          {suggestions.map((station) => (
            <button
              key={station.id}
              onClick={() => {
                onLocationSelect(station);
                setQuery(station.name);
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{station.name}</p>
                  <p className="text-sm text-gray-500">{station.region}</p>
              </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">AQI {station.aqi}</p>
                  <p className="text-xs text-gray-500">{getAQICategory(station.aqi)}</p>
              </div>
            </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Top Navigation Component
const TopNavigation = ({ currentPage, onPageChange, onLanguageChange, onThemeToggle, isDarkMode }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map View', icon: MapPin },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'forecast', label: 'Forecast', icon: Sun }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">EA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Air Quality Index Portal</h1>
              <p className="text-xs text-gray-500">Sultanate of Oman</p>
            </div>
            </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onPageChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                    currentPage === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
            </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onLanguageChange}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">EN</span>
            </button>
            
            <button
              onClick={onThemeToggle}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isDarkMode ? <SunIcon className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Hero Section Components (Legacy - keeping for compatibility)

// Enhanced Map View Component
const EnhancedMapView = ({ stations, selectedFilter, onFilterChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">Air Quality Map</h3>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedFilter} 
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
            >
              <option value="aqi">AQI</option>
              <option value="pm25">PM2.5</option>
              <option value="pm10">PM10</option>
              <option value="no2">NO₂</option>
              <option value="o3">O₃</option>
              <option value="so2">SO₂</option>
              <option value="weather">Weather</option>
            </select>
            
            <div className="flex items-center space-x-1">
              <button className="px-3 py-2 text-sm bg-[#2E7D32] text-white rounded-lg">Now</button>
              <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg">24h</button>
              <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg">7d</button>
            </div>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-96 relative z-10">
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
            <Marker key={station.id} position={[station.lat, station.lng]}>
              <Popup>
                <div className="p-4 min-w-[250px]">
                  <h4 className="font-semibold text-gray-800 mb-3">{station.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">AQI:</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAQIColor(station.aqi)} text-white`}>
                          {station.aqi}
                        </span>
                        <span className="font-medium">{getAQICategory(station.aqi)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PM2.5:</span>
                      <span className="font-medium">{station.pm25} μg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PM10:</span>
                      <span className="font-medium">{station.pm10} μg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Region:</span>
                      <span className="font-medium">{station.region}</span>
                    </div>
                    <button className="w-full mt-3 px-3 py-2 bg-[#2E7D32] text-white text-xs rounded-lg hover:bg-green-700 transition-colors">
                      View Detailed Trends
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* AI Overlay Options */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">AI Overlays:</span>
            <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
              Highlight worst 5 regions
            </button>
            <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
              Show improving stations
            </button>
            <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
              Predict AQI for tomorrow
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#2E7D32]" />
            <span className="text-sm text-gray-600">
              Dust levels increasing in Nizwa — likely due to wind shift from south
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Dropdown Component
const ProfileDropdown = ({ user, onLogout, onSwitchToAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const handleSwitchToAdmin = () => {
    setIsOpen(false);
    onSwitchToAdmin();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium text-[#111827]">
          {user?.name || 'User'}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              
              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleSwitchToAdmin}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Switch to Admin</span>
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Header Component
const Header = ({ currentPage, onPageChange, onLanguageChange, user, onLogout, onSwitchToAdmin }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'forecast', label: 'Forecast', icon: Sun }
  ];

  return (
    <header className="bg-white border-b border-[#E6EDF3] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#28784A] rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">EA</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#111827]">Air Quality Index Portal</h1>
              <p className="text-sm text-[#6B7280]">Environment Authority</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onPageChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                    currentPage === tab.id
                      ? 'bg-[#E6F6EE] text-[#28784A] border border-[#28784A]'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onLanguageChange}
              className="flex items-center space-x-1 px-3 py-2 text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">EN</span>
            </button>
            
            {/* User Profile Dropdown */}
            <ProfileDropdown 
              user={user} 
              onLogout={onLogout} 
              onSwitchToAdmin={onSwitchToAdmin}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// Smart Search Component
const SmartSearchSection = ({ onSearch, onLocationSelect, selectedLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      const filtered = sampleData.stations.filter(station => 
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.region.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search by city, region, or station — or ask in plain language..."
            className="w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-[#2E7D32] focus:outline-none transition-colors bg-gray-50"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button
              onClick={() => handleSearch(query)}
              className="p-2 text-gray-400 hover:text-[#2E7D32] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-[#2E7D32] transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
            {suggestions.map((station) => (
              <button
                key={station.id}
                onClick={() => {
                  onLocationSelect(station);
                  setQuery(station.name);
                  setShowSuggestions(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{station.name}</p>
                    <p className="text-sm text-gray-500">{station.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">AQI {station.aqi}</p>
                    <p className="text-xs text-gray-500">{getAQICategory(station.aqi)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Smart Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Quick filters:</span>
          <button className="px-3 py-1 bg-[#2E7D32] text-white text-sm rounded-full">Dust alert</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">PM2.5 spike</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Last 3 days</button>
        </div>
      </div>
    </div>
  );
};

// AI Summary Banner
const AISummaryBanner = ({ insight }) => {
  return (
    <div className="bg-gradient-to-r from-[#2E7D32] to-green-600 text-white rounded-2xl p-6 mb-8">
      <div className="flex items-center space-x-3">
        <Sparkles className="w-6 h-6" />
        <div>
          <h3 className="text-lg font-semibold">Today's Air Quality Summary</h3>
          <p className="text-green-100">{insight}</p>
        </div>
      </div>
    </div>
  );
};

// Summary Cards
const CurrentAQICard = ({ data }) => {
  const getTrendIcon = () => {
    const trend = data.trend;
    const current = trend[trend.length - 1];
    const previous = trend[trend.length - 2];
    
    if (current > previous) return <TrendingUp className="w-5 h-5 text-red-500" />;
    if (current < previous) return <TrendingDown className="w-5 h-5 text-green-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className={`${getAQIColor(data.value)} rounded-2xl p-6 text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current AQI</h3>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className="text-sm opacity-90">24h trend</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-5xl font-bold mb-2">{data.value}</div>
            <div className="text-lg font-medium opacity-90">{getAQICategory(data.value)}</div>
            <div className="text-sm opacity-75">Primary: {data.primaryPollutant}</div>
          </div>
          
          <div className="text-right">
            <div className="text-sm opacity-75 mb-2">Last updated</div>
            <div className="text-xs opacity-60">{data.lastUpdate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeatherConditionsCard = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Weather Conditions</h3>
        <Sun className="w-6 h-6 text-yellow-500" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{data.temperature}°C</div>
          <div className="text-sm text-gray-500">Temperature</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{data.humidity}%</div>
          <div className="text-sm text-gray-500">Humidity</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{data.windSpeed} km/h</div>
          <div className="text-sm text-gray-500">Wind Speed</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{data.uvIndex}</div>
          <div className="text-sm text-gray-500">UV Index</div>
        </div>
      </div>
    </div>
  );
};

const HealthAdvisoryCard = ({ aqi }) => {
  const advisory = generateHealthAdvisory(aqi);
  
  return (
    <div className={`${advisory.bgColor} ${advisory.borderColor} border rounded-2xl p-6`}>
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">{advisory.icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">Health Advisory</h3>
      </div>
      <p className={`${advisory.color} font-medium`}>{advisory.message}</p>
    </div>
  );
};

const AISummaryCard = ({ insight }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 bg-opacity-20 rounded-full -translate-y-12 translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Summary</h3>
        </div>
        
        <p className="text-gray-700 leading-relaxed mb-4">{insight}</p>
        
        <button className="text-[#2E7D32] hover:text-green-700 text-sm font-medium flex items-center space-x-1">
          <span>Explain this trend</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ user, onLogout, onSwitchToAdmin, fromExposureCalc = false }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMapFilter, setSelectedMapFilter] = useState('aqi');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [exposureResult, setExposureResult] = useState(null);
  const [showExposureModal, setShowExposureModal] = useState(false);

  // Load exposure calculator results if coming from calculator
  useEffect(() => {
    if (fromExposureCalc && user?.fromExposureCalc) {
      const resultData = sessionStorage.getItem('exposure_calc_result');
      if (resultData) {
        try {
          const parsed = JSON.parse(resultData);
          setExposureResult(parsed);
          setShowExposureModal(true);
        } catch (error) {
          console.error('Error parsing exposure result:', error);
        }
      }
    }
  }, [fromExposureCalc, user]);

  // Get data for selected location or default
  const currentData = selectedLocation 
    ? sampleData.locations[selectedLocation.name] || sampleData.locations['Muscat Central']
    : sampleData.locations['Muscat Central'];

  // Generate AI insight on component mount
  useEffect(() => {
    setAiInsight(generateAIInsight(currentData));
  }, [currentData]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('AI Search:', query);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleLanguageChange = () => {
    console.log('Language changed');
  };

  // Render different pages based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Unified Search Bar */}
            <UnifiedSearchBar 
              onSearch={handleSearch}
              onLocationSelect={handleLocationSelect}
              stations={sampleData.stations}
              currentLocation={selectedLocation}
            />

            {/* Primary KPI Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
              <div className="lg:col-span-4">
                <AQICard aqiData={currentData.currentAQI} location={selectedLocation?.name || 'Muscat'} />
              </div>
              <div className="lg:col-span-4">
                <WeatherWidget weatherData={currentData.weather} location={selectedLocation?.name || 'Muscat'} />
              </div>
              <div className="lg:col-span-4">
                <AIRecommender currentData={currentData} location={selectedLocation?.name || 'Muscat'} />
              </div>
            </div>

            {/* Map Section */}
            <div className="mb-6">
              <EnhancedMapView 
                stations={sampleData.stations}
                selectedFilter={selectedMapFilter}
                onFilterChange={setSelectedMapFilter}
              />
            </div>

            {/* Compare Widget Section */}
            <div className="mb-6">
              <CompareWidget 
                stations={sampleData.stations}
                locations={sampleData.locations}
              />
            </div>

            {/* Enhanced Insights Row - Full Width for Better Visibility */}
            <div className="space-y-6 mb-6">
              {/* Historical Trends - Full Width */}
              <div>
                <HistoricalTrends data={currentData.historicalData} selectedPollutant={'pm25'} />
              </div>
              
              {/* Pollutant Breakdown - Full Width */}
              <div>
                <PollutantBreakdown data={currentData.pollutants} />
              </div>
              
              {/* Alerts and Additional Info - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-label font-semibold">Active Alerts</h3>
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm font-medium text-orange-800">Dust Advisory</p>
                      <p className="text-xs text-orange-600">High dust levels expected in northern regions</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Weather Alert</p>
                      <p className="text-xs text-blue-600">Strong winds may affect air quality</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Air Quality Good</p>
                      <p className="text-xs text-green-600">Current levels are within safe limits</p>
                    </div>
                  </div>
                </div>
                
                <div className="card h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-label font-semibold">Quick Stats</h3>
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Data Quality</span>
                      <span className="text-sm font-semibold text-green-600">98%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Update</span>
                      <span className="text-sm font-semibold text-gray-900">2 min ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monitoring Stations</span>
                      <span className="text-sm font-semibold text-gray-900">12 Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Health Index</span>
                      <span className="text-sm font-semibold text-yellow-600">Moderate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* News Section */}
            <div className="mb-6">
              <NewsAndArticles data={sampleData.news} />
            </div>
          </main>
        );
      case 'map':
        return (
          <main className="h-screen w-full">
            <FullScreenMapView 
              stations={sampleData.stations}
              selectedFilter={selectedMapFilter}
              onFilterChange={setSelectedMapFilter}
            />
          </main>
        );
      case 'compare':
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Compare Air Quality</h1>
              <p className="text-gray-600">Compare air quality data across different cities and regions in Oman</p>
            </div>
            <CompareWidget 
              stations={sampleData.stations}
              locations={sampleData.locations}
            />
          </main>
        );
      case 'trends':
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Historical Trends Analysis</h1>
              <p className="text-gray-600">Comprehensive air quality data analysis and insights</p>
            </div>
            <div className="space-y-8">
              {/* Historical Trends - Full Width */}
              <div>
                <HistoricalTrends data={currentData.historicalData} selectedPollutant={'pm25'} />
              </div>
              
              {/* Pollutant Breakdown - Full Width */}
              <div>
                <PollutantBreakdown data={currentData.pollutants} />
              </div>
              
              {/* Additional Analysis Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Quality Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completeness</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Accuracy</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '98%'}}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">98%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Timeliness</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">92%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Impact Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Good: 65% of time</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Moderate: 25% of time</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Unhealthy: 8% of time</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Hazardous: 2% of time</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Trend Indicators</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">7-day trend</span>
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">-5.2%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">30-day trend</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-semibold text-red-600">+2.1%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Seasonal pattern</span>
                      <div className="flex items-center space-x-1">
                        <Minus className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-600">Stable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        );
      case 'forecast':
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Air Quality Forecast</h1>
              <p className="text-gray-600">Predictive analysis and future air quality projections</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Forecast data={currentData.forecastData} />
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Extended Forecast</h3>
                <p className="text-gray-600">Extended 7-day forecast coming soon...</p>
              </div>
            </div>
          </main>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#FAFBFC] font-poppins">
      {/* Header */}
      <Header 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onLanguageChange={handleLanguageChange}
        user={user}
        onLogout={onLogout}
        onSwitchToAdmin={onSwitchToAdmin}
      />

      {/* Page Content */}
      {renderPage()}

      {/* Footer - Only show on home page */}
      {currentPage === 'home' && <Footer />}

      {/* Floating AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-[#28784A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Exposure Calculator Result Modal */}
      {showExposureModal && exposureResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Exposure Risk Assessment</h2>
                <button
                  onClick={() => setShowExposureModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Risk Summary */}
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <h3 className="text-xl font-bold text-red-800">{exposureResult.riskCategory} Risk</h3>
                    <p className="text-red-600">Score: {exposureResult.riskScore}/100</p>
                  </div>
                </div>
                <p className="text-gray-700"><strong>Primary concern:</strong> {exposureResult.primary_reason}</p>
              </div>

              {/* User Inputs */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Your Activity Profile</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Activity:</strong> {exposureResult.inputs.activity}</div>
                  <div><strong>Duration:</strong> {exposureResult.inputs.duration_min} minutes</div>
                  <div><strong>Location:</strong> {exposureResult.inputs.location}</div>
                  <div><strong>Age Group:</strong> {exposureResult.inputs.age_group}</div>
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Current Environmental Conditions</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">{exposureResult.environment.aqi}</div>
                    <div className="text-gray-600">AQI</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-bold text-lg">{exposureResult.environment.pm25} μg/m³</div>
                    <div className="text-gray-600">PM2.5</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-bold text-lg">{exposureResult.environment.temperature}°C</div>
                    <div className="text-gray-600">Temperature</div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Personalized Recommendations</h3>
                <ul className="space-y-2">
                  {exposureResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExposureModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Full Dashboard
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
