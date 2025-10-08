import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Eye, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Gauge,
  Activity,
  Zap
} from 'lucide-react';

// Enhanced Current AQI Widget
export const EnhancedCurrentAQI = ({ data }) => {
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'from-green-400 to-green-600';
    if (aqi <= 100) return 'from-yellow-400 to-yellow-600';
    if (aqi <= 150) return 'from-orange-400 to-orange-600';
    if (aqi <= 200) return 'from-red-400 to-red-600';
    if (aqi <= 300) return 'from-purple-400 to-purple-600';
    return 'from-gray-400 to-gray-600';
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Satisfactory';
    if (aqi <= 150) return 'Moderate';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAQIIcon = (aqi) => {
    if (aqi <= 50) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (aqi <= 100) return <Info className="w-6 h-6 text-yellow-600" />;
    if (aqi <= 150) return <AlertTriangle className="w-6 h-6 text-orange-600" />;
    return <AlertTriangle className="w-6 h-6 text-red-600" />;
  };

  const getHealthAdvice = (aqi) => {
    if (aqi <= 50) return 'Air quality is satisfactory. Enjoy outdoor activities.';
    if (aqi <= 100) return 'Air quality is acceptable. Sensitive individuals may experience minor breathing discomfort.';
    if (aqi <= 150) return 'Sensitive groups should reduce prolonged outdoor exertion.';
    if (aqi <= 200) return 'Everyone should avoid prolonged outdoor exertion. Sensitive groups should stay indoors.';
    if (aqi <= 300) return 'Everyone should avoid outdoor activities. Sensitive groups should stay indoors.';
    return 'Everyone should stay indoors and avoid outdoor activities.';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={`w-full h-full bg-gradient-to-br ${getAQIColor(data.value)} rounded-full`}></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Gauge className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Current Air Quality</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {data.lastUpdate}
              </div>
            </div>
          </div>
          {getAQIIcon(data.value)}
        </div>

        {/* Main AQI Display */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getAQIColor(data.value)} text-white text-4xl font-bold shadow-lg`}>
            {data.value}
          </div>
          <div className="mt-4">
            <p className="text-xl font-semibold text-gray-800">{getAQICategory(data.value)}</p>
            <p className="text-sm text-gray-600 mt-1">Primary Pollutant: {data.primaryPollutant}</p>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">24h Trend</span>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              Improving
            </div>
          </div>
          <div className="h-8 flex items-end space-x-1">
            {data.trend.map((value, index) => (
              <div
                key={index}
                className={`w-3 rounded-t bg-gradient-to-t ${getAQIColor(value)}`}
                style={{ height: `${(value / 100) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Health Advice */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800 mb-1">Health Advice</p>
              <p className="text-sm text-gray-600">{getHealthAdvice(data.value)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Weather Widget
export const EnhancedWeatherInfo = ({ data }) => {
  const weatherMetrics = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${data.temperature}°C`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Feels like 32°C'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${data.humidity}%`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Comfortable'
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${data.windSpeed} km/h`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `From ${data.windDirection}`
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: data.uvIndex,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: getUVDescription(data.uvIndex)
    }
  ];

  function getUVDescription(uvIndex) {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Sun className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Weather Conditions</h3>
            <p className="text-sm text-gray-500">Real-time weather data</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-800">2 min ago</p>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {weatherMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className={`${metric.bgColor} rounded-xl p-4 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${metric.color}`} />
                <Zap className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</p>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weather Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">Weather Summary</p>
            <p className="text-sm text-gray-600">
              Clear skies with moderate winds. Perfect conditions for outdoor activities.
            </p>
          </div>
          <div className="text-right">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Air Quality Index Scale Widget
export const AQIScaleWidget = () => {
  const aqiLevels = [
    { range: '0-50', label: 'Good', color: 'bg-green-500', description: 'Air quality is satisfactory' },
    { range: '51-100', label: 'Satisfactory', color: 'bg-yellow-500', description: 'Air quality is acceptable' },
    { range: '101-150', label: 'Moderate', color: 'bg-orange-500', description: 'Sensitive groups affected' },
    { range: '151-200', label: 'Unhealthy', color: 'bg-red-500', description: 'Everyone may be affected' },
    { range: '201-300', label: 'Very Unhealthy', color: 'bg-purple-500', description: 'Health warnings issued' },
    { range: '301+', label: 'Hazardous', color: 'bg-gray-800', description: 'Emergency conditions' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Eye className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">AQI Scale</h3>
          <p className="text-sm text-gray-500">Understanding air quality levels</p>
        </div>
      </div>

      <div className="space-y-3">
        {aqiLevels.map((level, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-4 h-4 rounded-full ${level.color}`}></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{level.label}</span>
                <span className="text-sm text-gray-500">{level.range}</span>
              </div>
              <p className="text-sm text-gray-600">{level.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pollutant Levels Widget
export const PollutantLevelsWidget = ({ data }) => {
  const pollutants = data || [
    { name: 'PM2.5', value: 35, unit: 'μg/m³', level: 'Moderate', color: 'text-orange-600' },
    { name: 'PM10', value: 28, unit: 'μg/m³', level: 'Good', color: 'text-green-600' },
    { name: 'NO2', value: 15, unit: 'ppb', level: 'Good', color: 'text-green-600' },
    { name: 'O3', value: 8, unit: 'ppb', level: 'Good', color: 'text-green-600' },
    { name: 'SO2', value: 2, unit: 'ppb', level: 'Good', color: 'text-green-600' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Activity className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Pollutant Levels</h3>
          <p className="text-sm text-gray-500">Current pollutant concentrations</p>
        </div>
      </div>

      <div className="space-y-4">
        {pollutants.map((pollutant, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">{pollutant.name}</p>
              <p className="text-sm text-gray-500">{pollutant.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-800">{pollutant.value}</p>
              <p className={`text-sm font-medium ${pollutant.color}`}>{pollutant.level}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
