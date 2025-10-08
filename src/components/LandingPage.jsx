import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  TrendingUp, 
  Calculator, 
  Newspaper, 
  Brain, 
  Database, 
  ArrowRight, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  FolderOpen,
  Code,
  Users,
  BarChart3,
  FileText,
  Cloud,
  Activity,
  Globe,
  Calendar
} from 'lucide-react';
import ExposureRiskCalculator from './ExposureRiskCalculator';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LandingPage = ({ onLogin, onDirectLogin }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [calculatorData, setCalculatorData] = useState({
    activity: 'commute',
    duration: 30,
    age: 25,
    maskUsage: false
  });
  const [newsIndex, setNewsIndex] = useState(0);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Muscat, Oman');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Modal state management
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Modal handlers
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleShowRegistration = () => {
    setIsLoginModalOpen(false);
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationModalClose = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleRegistrationSuccess = (userData) => {
    setIsRegistrationModalOpen(false);
    // Call the original onLogin with the new user data
    onLogin(userData);
  };

  // Mock data for demonstration
  const mockAqiData = {
    value: 85,
    category: 'Satisfactory',
    primaryPollutant: 'PM2.5',
    lastUpdate: new Date().toISOString(),
    trend: [78, 82, 85, 88, 85, 83, 85]
  };

  const mockWeatherData = {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NE',
    uvIndex: 7
  };

  const mockNews = [
    {
      id: 1,
      title: "New Air Quality Monitoring Station Opens in Muscat",
      category: "Air Quality",
      snippet: "The Environment Authority announces the opening of a new monitoring station to improve air quality tracking across the capital.",
      date: "2024-01-15",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Health Advisory: High AQI Expected This Week",
      category: "Health",
      snippet: "Residents with respiratory conditions are advised to limit outdoor activities due to elevated pollution levels.",
      date: "2024-01-14",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "EA Launches New Mobile App for Real-time AQI",
      category: "EA News",
      snippet: "Download the official EA mobile app to receive personalized air quality alerts and recommendations.",
      date: "2024-01-13",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Open Data Initiative: Historical AQI Data Now Available",
      category: "Open Data",
      snippet: "Access 5 years of historical air quality data through our new open data portal for research and analysis.",
      date: "2024-01-12",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
    }
  ];

  const mockOpenData = [
    { name: "AQI by Location", count: "47 stations", icon: MapPin },
    { name: "Pollutant Concentrations", count: "6 pollutants", icon: AlertTriangle },
    { name: "Historical Trends", count: "5 years", icon: TrendingUp },
    { name: "Weather Data", count: "Real-time", icon: Sun }
  ];

  // Oman coordinates
  const omanCenter = [21.4735, 55.9754];
  const omanBounds = [
    [16.651, 51.999],
    [26.396, 59.836]
  ];

  // AQI monitoring stations in Oman
  const omanStations = [
    { id: 1, name: 'Muscat', position: [23.5880, 58.3829], aqi: 85, category: 'Satisfactory' },
    { id: 2, name: 'Salalah', position: [17.0151, 54.0924], aqi: 72, category: 'Good' },
    { id: 3, name: 'Sohar', position: [24.3644, 56.7438], aqi: 95, category: 'Satisfactory' },
    { id: 4, name: 'Nizwa', position: [22.9333, 57.5333], aqi: 68, category: 'Good' },
    { id: 5, name: 'Sur', position: [22.5667, 59.5289], aqi: 78, category: 'Satisfactory' },
    { id: 6, name: 'Ibri', position: [23.2254, 56.5152], aqi: 88, category: 'Satisfactory' },
    { id: 7, name: 'Rustaq', position: [23.3908, 57.4244], aqi: 65, category: 'Good' },
    { id: 8, name: 'Khasab', position: [26.1799, 56.2477], aqi: 82, category: 'Satisfactory' }
  ];

  // Available locations for dropdown
  const availableLocations = [
    { id: 1, name: 'Muscat, Oman', position: [23.5880, 58.3829], aqi: 85, category: 'Satisfactory' },
    { id: 2, name: 'Salalah, Oman', position: [17.0151, 54.0924], aqi: 72, category: 'Good' },
    { id: 3, name: 'Sohar, Oman', position: [24.3644, 56.7438], aqi: 95, category: 'Satisfactory' },
    { id: 4, name: 'Nizwa, Oman', position: [22.9333, 57.5333], aqi: 68, category: 'Good' },
    { id: 5, name: 'Sur, Oman', position: [22.5667, 59.5289], aqi: 78, category: 'Satisfactory' },
    { id: 6, name: 'Ibri, Oman', position: [23.2254, 56.5152], aqi: 88, category: 'Satisfactory' },
    { id: 7, name: 'Rustaq, Oman', position: [23.3908, 57.4244], aqi: 65, category: 'Good' },
    { id: 8, name: 'Khasab, Oman', position: [26.1799, 56.2477], aqi: 82, category: 'Satisfactory' },
    { id: 9, name: 'Duqm, Oman', position: [19.6667, 57.7000], aqi: 75, category: 'Satisfactory' },
    { id: 10, name: 'Buraimi, Oman', position: [24.2500, 55.8000], aqi: 90, category: 'Satisfactory' }
  ];

  useEffect(() => {
    // Simulate location detection
    setCurrentLocation(omanCenter);
    setAqiData(mockAqiData);
    setWeatherData(mockWeatherData);
    
    // Generate AI recommendations
    setAiRecommendations({
      confidence: 87,
      tips: [
        "Consider wearing a mask during outdoor activities",
        "Avoid strenuous exercise during peak pollution hours",
        "Keep windows closed and use air purifiers indoors"
      ],
      guidance: "Moderate air quality detected. Sensitive individuals should take precautions."
    });
    
    // Set map ready after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const getAqiColor = (value) => {
    if (value <= 50) return 'text-green-600 bg-green-100';
    if (value <= 100) return 'text-yellow-600 bg-yellow-100';
    if (value <= 150) return 'text-orange-600 bg-orange-100';
    if (value <= 200) return 'text-red-600 bg-red-100';
    return 'text-purple-600 bg-purple-100';
  };

  const getAqiEmoji = (value) => {
    if (value <= 50) return '😊';
    if (value <= 100) return '😐';
    if (value <= 150) return '😷';
    if (value <= 200) return '😰';
    return '🚫';
  };

  const getAqiMarkerColor = (value) => {
    if (value <= 50) return '#22c55e'; // green
    if (value <= 100) return '#eab308'; // yellow
    if (value <= 150) return '#f97316'; // orange
    if (value <= 200) return '#ef4444'; // red
    return '#8b5cf6'; // purple
  };

  const calculateExposureRisk = () => {
    const { activity, duration, age, maskUsage } = calculatorData;
    const aqi = aqiData?.value || 0;
    
    let riskScore = 0;
    
    // AQI factor
    if (aqi <= 50) riskScore += 1;
    else if (aqi <= 100) riskScore += 2;
    else if (aqi <= 150) riskScore += 3;
    else if (aqi <= 200) riskScore += 4;
    else riskScore += 5;
    
    // Activity factor
    const activityFactors = {
      'commute': 1,
      'outdoor_exercise': 3,
      'work': 1.5,
      'leisure': 2
    };
    riskScore *= activityFactors[activity] || 1;
    
    // Duration factor
    riskScore *= (duration / 60);
    
    // Age factor
    if (age < 12 || age > 65) riskScore *= 1.5;
    
    // Mask factor
    if (maskUsage) riskScore *= 0.5;
    
    if (riskScore <= 2) return { level: 'Low', color: 'text-green-600 bg-green-100' };
    if (riskScore <= 4) return { level: 'Moderate', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'High', color: 'text-red-600 bg-red-100' };
  };

  const MapBackground = () => {
    const map = useMap();
    
    useEffect(() => {
      if (!map) return;
      
      try {
        // Set max bounds first
        map.setMaxBounds(omanBounds);
        
        // Fit the map to show Oman region properly
        setTimeout(() => {
          if (map && map.fitBounds) {
            map.fitBounds([
              [16.651, 51.999], // Southwest corner
              [26.396, 59.836]  // Northeast corner
            ], {
              padding: [20, 20] // Add some padding around the bounds
            });
          }
        }, 100);
      } catch (error) {
        console.warn('Map initialization error:', error);
      }
    }, [map]);
    
    return null;
  };

  const nextNews = () => {
    setNewsIndex((prev) => (prev + 1) % mockNews.length);
  };

  const prevNews = () => {
    setNewsIndex((prev) => (prev - 1 + mockNews.length) % mockNews.length);
  };

  // Location dropdown handlers
  const handleLocationSelect = (location) => {
    setSelectedLocation(location.name);
    setIsLocationDropdownOpen(false);
    setLocationSearchQuery('');
    
    // Update AQI data based on selected location
    const selectedLocationData = availableLocations.find(loc => loc.name === location.name);
    if (selectedLocationData) {
      setAqiData({
        value: selectedLocationData.aqi,
        category: selectedLocationData.category,
        primaryPollutant: 'PM2.5',
        lastUpdate: new Date().toISOString(),
        trend: [selectedLocationData.aqi - 10, selectedLocationData.aqi - 5, selectedLocationData.aqi + 2, selectedLocationData.aqi - 3, selectedLocationData.aqi + 5, selectedLocationData.aqi - 2, selectedLocationData.aqi]
      });
      setCurrentLocation(selectedLocationData.position);
    }
  };

  const filteredLocations = availableLocations.filter(location =>
    location.name.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  // Navigation menu data
  const navigationItems = [
    {
      id: 'datasets',
      label: 'Open Datasets',
      icon: FolderOpen,
      dropdown: [
        { label: 'Air Quality Data', icon: Cloud, href: '#' },
        { label: 'Weather Data', icon: Sun, href: '#' },
        { label: 'Historical Trends', icon: TrendingUp, href: '#' },
        { label: 'Pollutant Analysis', icon: AlertTriangle, href: '#' },
        { label: 'Station Information', icon: MapPin, href: '#' }
      ]
    },
    {
      id: 'api',
      label: 'API Integration',
      icon: Code,
      href: '#'
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      href: '#'
    },
    {
      id: 'trends',
      label: 'Trends & Forecast',
      icon: BarChart3,
      dropdown: [
        { label: 'Real-time Trends', icon: Activity, href: '#' },
        { label: '7-Day Forecast', icon: Calendar, href: '#' },
        { label: 'Monthly Analysis', icon: FileText, href: '#' },
        { label: 'Annual Reports', icon: Globe, href: '#' }
      ]
    }
  ];

  const handleDropdownToggle = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const risk = calculateExposureRisk();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Hero Map Background - Always visible 500px from top */}
      <div className="absolute inset-0 h-[500px] z-0">
        {isMapReady && (
          <MapContainer
            center={[21.4735, 55.9754]}
            zoom={7}
            className="w-full h-full"
            zoomControl={false}
            attributionControl={false}
            bounds={[
              [16.651, 51.999],
              [26.396, 59.836]
            ]}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.4}
            />
            <MapBackground />
          </MapContainer>
        )}
        
        {/* Hero Map Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-800/20 to-transparent"></div>
        
        {/* Location Dropdown - Top Right */}
        <div className="absolute top-20 right-6 z-30">
          <div className="relative">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-3 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-200 border-2 border-gray-300 shadow-2xl"
            >
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">{selectedLocation}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLocationDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsLocationDropdownOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-40">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search locations..."
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  
                  {/* Location List */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedLocation === location.name ? 'bg-blue-50 text-blue-700' : 'text-gray-900 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getAqiMarkerColor(location.aqi)}`}></div>
                          <div>
                            <div className="font-medium text-sm">{location.name}</div>
                            <div className="text-xs text-gray-500">{location.category}</div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold">{location.aqi} AQI</div>
                      </button>
                    ))}
                    
                    {filteredLocations.length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No locations found
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Hero Title Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="bg-slate-800/70 backdrop-blur-lg rounded-2xl px-8 py-6 border-2 border-slate-300/50 shadow-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
                EA Air Quality Portal
              </h1>
              <p className="text-xl md:text-2xl text-white drop-shadow-xl mb-6">
                Real-time Air Quality Monitoring for Oman
              </p>
              
              {/* Full Map View Button - Integrated into hero */}
              {!isMapFullScreen && (
                <button
                  onClick={() => setIsMapFullScreen(true)}
                  className="px-8 py-4 bg-slate-100/90 backdrop-blur-sm text-slate-800 font-bold rounded-xl hover:bg-slate-200/90 hover:shadow-2xl transition-all duration-200 flex items-center space-x-3 border-2 border-slate-300/50 mx-auto shadow-lg"
                >
                  <Eye className="w-6 h-6" />
                  <span>Explore Full Map</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Map - Only show in full screen mode */}
      {isMapFullScreen && isMapReady && (
        <div className="absolute inset-0 z-50 transition-all duration-500">
          <MapContainer
            center={[21.4735, 55.9754]}
            zoom={7}
            className="w-full h-full"
            zoomControl={true}
            attributionControl={false}
            bounds={[
              [16.651, 51.999],
              [26.396, 59.836]
            ]}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={1}
            />
            <MapBackground />
            {currentLocation && (
              <Marker position={currentLocation}>
                <Popup>
                  <div className="text-center">
                    <div className="font-semibold">Current Location</div>
                    <div className="text-sm text-gray-600">{selectedLocation}</div>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* AQI Monitoring Stations in Oman */}
            {omanStations.map((station) => (
              <Marker 
                key={station.id} 
                position={station.position}
                icon={L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div style="
                    background-color: ${getAqiMarkerColor(station.aqi)};
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: bold;
                    color: white;
                  ">${station.aqi}</div>`,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10]
                })}
              >
                <Popup>
                  <div className="text-center min-w-[120px]">
                    <div className="font-semibold text-lg">{station.name}</div>
                    <div className={`text-2xl font-bold ${getAqiColor(station.aqi).split(' ')[0]}`}>
                      {station.aqi} AQI
              </div>
                    <div className="text-sm text-gray-600">{station.category}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
        

        {/* Close Full View Button */}
        {isMapFullScreen && (
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setIsMapFullScreen(false)}
              className="px-6 py-3 bg-slate-100/95 backdrop-blur-sm text-slate-800 font-semibold rounded-xl shadow-xl hover:bg-slate-200/95 hover:shadow-2xl transition-all duration-200 flex items-center space-x-2 border border-slate-300"
            >
              <XCircle className="w-5 h-5" />
              <span>Close Map View</span>
            </button>
        </div>
        )}

        {/* Navigation Bar */}
      {!isMapFullScreen && (
        <nav className="relative z-20 bg-slate-50/90 backdrop-blur-md border-b border-slate-300/60 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">EA Air Quality Portal</h1>
                  <p className="text-sm text-gray-600">Environment Authority</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isDropdownOpen = activeDropdown === item.id;
                  
                  return (
                    <div key={item.id} className="relative dropdown-container">
                      <button
                        onClick={() => item.dropdown ? handleDropdownToggle(item.id) : window.open(item.href, '_blank')}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                        {item.dropdown && (
                          <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {item.dropdown && isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                          <div className="py-2">
                            {item.dropdown.map((dropdownItem, index) => {
                              const DropdownIcon = dropdownItem.icon;
                              return (
                                <a
                                  key={index}
                                  href={dropdownItem.href}
                                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <DropdownIcon className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium">{dropdownItem.label}</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleLoginClick}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* AQI Info Section - Half above hero map */}
      {!isMapFullScreen && (
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '350px' }}>
          <div className="bg-blue-50/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-blue-200/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex-1 mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{getAqiEmoji(aqiData?.value)}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Current Air Quality</h2>
                    <p className="text-gray-600">{selectedLocation}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 mb-4">
                  <div className={`px-4 py-2 rounded-xl font-bold text-2xl ${getAqiColor(aqiData?.value)}`}>
                    {aqiData?.value} AQI
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    {aqiData?.category}
          </div>
        </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  Primary Pollutant: <span className="font-semibold">{aqiData?.primaryPollutant}</span>
          </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  Last updated: {aqiData?.lastUpdate ? new Date(aqiData.lastUpdate).toLocaleString() : 'N/A'}
                </div>
                  </div>
              
              <div className="flex-1 lg:ml-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Trend</h3>
                <div className="h-24 relative bg-gray-50/50 rounded-lg p-3 border border-gray-200/50">
                  <svg className="w-full h-full" viewBox="0 0 240 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="24" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.4"/>
                      </pattern>
                      {/* Gradient for area under curve */}
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
                      </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Area under curve */}
                    {aqiData?.trend && aqiData.trend.length > 1 && (
                      <polygon
                        fill="url(#areaGradient)"
                        points={`0,100 ${aqiData.trend.map((value, index) => {
                          const x = (index / (aqiData.trend.length - 1)) * 240;
                          const y = 100 - (value / 200) * 100;
                          return `${x},${y}`;
                        }).join(' ')} 240,100`}
                      />
                    )}
                    
                    {/* Line chart */}
                    {aqiData?.trend && aqiData.trend.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={aqiData.trend.map((value, index) => {
                          const x = (index / (aqiData.trend.length - 1)) * 240;
                          const y = 100 - (value / 200) * 100;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    )}
                    
                    {/* Data points */}
                    {aqiData?.trend && aqiData.trend.map((value, index) => {
                      const x = (index / (aqiData.trend.length - 1)) * 240;
                      const y = 100 - (value / 200) * 100;
                      const color = getAqiMarkerColor(value);
                      return (
                        <g key={index}>
                          {/* Outer ring for better visibility */}
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            fill="white"
                            stroke={color}
                            strokeWidth="2"
                          />
                          {/* Inner circle */}
                          <circle
                            cx={x}
                            cy={y}
                            r="3"
                            fill={color}
                          />
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* Y-axis labels with better positioning */}
                  <div className="absolute left-1 top-1 h-full flex flex-col justify-between text-xs text-gray-600 font-medium">
                    <span className="bg-white/80 px-1 rounded">200</span>
                    <span className="bg-white/80 px-1 rounded">150</span>
                    <span className="bg-white/80 px-1 rounded">100</span>
                    <span className="bg-white/80 px-1 rounded">50</span>
                    <span className="bg-white/80 px-1 rounded">0</span>
                  </div>
                  
                  {/* X-axis labels with better styling */}
                  <div className="absolute -bottom-1 left-0 w-full flex justify-between text-xs text-gray-600 font-medium">
                    <span className="bg-white/80 px-1 rounded">12:00</span>
                    <span className="bg-white/80 px-1 rounded">18:00</span>
                    <span className="bg-white/80 px-1 rounded">00:00</span>
                    <span className="bg-white/80 px-1 rounded">06:00</span>
                  </div>
                  
                  {/* Current value indicator */}
                  {aqiData?.value && (
                    <div className="absolute top-1 right-1 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full border border-blue-200">
                      {aqiData.value} AQI
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <button
                  onClick={handleLoginClick}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Rest of the widgets */}
      {!isMapFullScreen && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ marginTop: '40px' }}>
          
          {/* Quick Stats Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Current Conditions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-blue-100/60 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg hover:bg-blue-200/80 transition-all duration-300 border border-blue-200/50 group">
              <div className="flex items-center justify-between mb-4">
                <Thermometer className="w-8 h-8 text-blue-600" />
                <div className="text-2xl font-bold text-blue-800">{weatherData?.temperature}°C</div>
              </div>
              <div className="text-sm text-blue-700">Temperature</div>
            </div>
            
            <div className="bg-cyan-100/60 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg hover:bg-cyan-200/80 transition-all duration-300 border border-cyan-200/50 group">
              <div className="flex items-center justify-between mb-4">
                <Droplets className="w-8 h-8 text-cyan-600" />
                <div className="text-2xl font-bold text-cyan-800">{weatherData?.humidity}%</div>
              </div>
              <div className="text-sm text-cyan-700">Humidity</div>
            </div>
            
            <div className="bg-green-100/60 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg hover:bg-green-200/80 transition-all duration-300 border border-green-200/50 group">
              <div className="flex items-center justify-between mb-4">
                <Wind className="w-8 h-8 text-green-600" />
                <div className="text-2xl font-bold text-green-800">{weatherData?.windSpeed} km/h</div>
              </div>
              <div className="text-sm text-green-700">Wind Speed</div>
            </div>
            
            <div className="bg-orange-100/60 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg hover:bg-orange-200/80 transition-all duration-300 border border-orange-200/50 group">
              <div className="flex items-center justify-between mb-4">
                <Sun className="w-8 h-8 text-orange-600" />
                <div className="text-2xl font-bold text-orange-800">{weatherData?.uvIndex}</div>
              </div>
              <div className="text-sm text-orange-700">UV Index</div>
            </div>
            
            <div className="bg-emerald-100/60 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg hover:bg-emerald-200/80 transition-all duration-300 border border-emerald-200/50 group">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                <div className="text-2xl font-bold text-emerald-800">+2.3%</div>
              </div>
              <div className="text-sm text-emerald-700">AQI Trend</div>
            </div>
          </div>
        </div>

        {/* Interactive Exposure Risk Calculator */}
        <div className="mb-12">
          <div className="bg-slate-50/70 backdrop-blur-lg rounded-3xl shadow-lg p-8 border border-slate-200/40 hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-8">
              <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Estimate Your Exposure Risk Today</h2>
              <p className="text-slate-600">Get personalized recommendations based on your planned activity and health profile</p>
            </div>
            
            <ExposureRiskCalculator 
              onRedirectToDashboard={onLogin} 
              onDirectLogin={onDirectLogin} 
              selectedLocation={selectedLocation}
            />
          </div>
        </div>

        {/* News & Announcements */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Latest News & Announcements</h2>
          <div className="relative">
            <div className="bg-rose-50/70 backdrop-blur-lg rounded-3xl shadow-lg overflow-hidden border border-rose-200/40 hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Newspaper className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                      {mockNews[newsIndex]?.category}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevNews}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={nextNews}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    <img
                      src={mockNews[newsIndex]?.image}
                      alt={mockNews[newsIndex]?.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                  <div className="lg:w-2/3">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {mockNews[newsIndex]?.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {mockNews[newsIndex]?.snippet}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {mockNews[newsIndex]?.date}
                      </span>
            <button
              onClick={onLogin}
                        className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
            >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
            </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommender */}
        <div className="mb-12">
          <div className="bg-purple-50/70 backdrop-blur-lg rounded-3xl shadow-lg p-8 border border-purple-200/40 hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-8">
              <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">AI Health Recommendations</h2>
              <p className="text-slate-600">Personalized advice based on current conditions</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Guidance</h3>
                  <p className="text-gray-700 mb-4">{aiRecommendations?.guidance}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${aiRecommendations?.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{aiRecommendations?.confidence}%</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actionable Tips</h3>
                  <ul className="space-y-3">
                    {aiRecommendations?.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col justify-center space-y-4">
                <button
                  onClick={handleLoginClick}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Save as PDF</span>
                </button>
                
                <button
                  onClick={handleLoginClick}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Recommendations</span>
                </button>
                
                <div className="text-center text-sm text-gray-500">
                  <p>Get personalized recommendations by logging in</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Open Data Highlight */}
        <div className="mb-12">
          <div className="bg-indigo-50/70 backdrop-blur-lg rounded-3xl shadow-lg p-8 border border-indigo-200/40 hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-8">
              <Database className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Open Data Portal</h2>
              <p className="text-slate-600">Access comprehensive air quality datasets for research and analysis</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {mockOpenData.map((dataset, index) => {
                const colors = [
                  { bg: 'bg-blue-100/50', border: 'border-blue-200/30', hover: 'hover:bg-blue-200/70', icon: 'text-blue-600', text: 'text-blue-800', subtext: 'text-blue-700' },
                  { bg: 'bg-green-100/50', border: 'border-green-200/30', hover: 'hover:bg-green-200/70', icon: 'text-green-600', text: 'text-green-800', subtext: 'text-green-700' },
                  { bg: 'bg-orange-100/50', border: 'border-orange-200/30', hover: 'hover:bg-orange-200/70', icon: 'text-orange-600', text: 'text-orange-800', subtext: 'text-orange-700' },
                  { bg: 'bg-cyan-100/50', border: 'border-cyan-200/30', hover: 'hover:bg-cyan-200/70', icon: 'text-cyan-600', text: 'text-cyan-800', subtext: 'text-cyan-700' }
                ];
                const colorScheme = colors[index % colors.length];
                return (
                  <div key={index} className={`${colorScheme.bg} rounded-2xl p-6 text-center ${colorScheme.hover} transition-all duration-300 border ${colorScheme.border}`}>
                    <dataset.icon className={`w-8 h-8 ${colorScheme.icon} mx-auto mb-3`} />
                    <h3 className={`font-semibold ${colorScheme.text} mb-2`}>{dataset.name}</h3>
                    <p className={`text-sm ${colorScheme.subtext}`}>{dataset.count}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <button
                onClick={handleLoginClick}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
              >
                <Database className="w-5 h-5" />
                <span>Explore Open Data</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {!isMapFullScreen && (
        <footer className="relative z-10 bg-slate-50/60 backdrop-blur-md border-t border-slate-300/60 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800">Environment Authority</span>
              </div>
              <p className="text-slate-600 mb-4">
                Providing real-time air quality data and environmental insights for Oman
              </p>
              <div className="flex justify-center space-x-6 text-sm text-slate-500">
                <a href="#" className="hover:text-slate-700">Privacy Policy</a>
                <a href="#" className="hover:text-slate-700">Terms of Service</a>
                <a href="#" className="hover:text-slate-700">Contact Us</a>
              </div>
          </div>
        </div>
      </footer>
      )}

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onLogin={onLogin}
        onShowRegistration={handleShowRegistration}
      />
      
      <RegistrationModal 
        isOpen={isRegistrationModalOpen}
        onClose={handleRegistrationModalClose}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default LandingPage;