import React from 'react';
import { Thermometer, Droplets, Wind, Sun, Eye, Clock } from 'lucide-react';

const WeatherWidget = ({ weatherData, location = 'Muscat' }) => {
  const { temperature, humidity, windSpeed, windDirection, uvIndex } = weatherData;

  // Get UV Index category and color
  const getUVCategory = (uv) => {
    if (uv <= 2) return { category: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (uv <= 5) return { category: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (uv <= 7) return { category: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (uv <= 10) return { category: 'Very High', color: 'text-red-600', bgColor: 'bg-red-100' };
    return { category: 'Extreme', color: 'text-purple-600', bgColor: 'bg-purple-100' };
  };

  const uvInfo = getUVCategory(uvIndex);

  // Get comfort level for humidity
  const getHumidityComfort = (humidity) => {
    if (humidity < 30) return 'Dry';
    if (humidity < 50) return 'Comfortable';
    if (humidity < 70) return 'Moderate';
    return 'Humid';
  };

  // Get wind description
  const getWindDescription = (speed) => {
    if (speed < 5) return 'Calm';
    if (speed < 15) return 'Light breeze';
    if (speed < 25) return 'Moderate breeze';
    return 'Strong wind';
  };

  // Get feels like temperature (simplified calculation)
  const getFeelsLike = (temp, humidity) => {
    // Simplified heat index calculation
    const feelsLike = temp + (humidity > 60 ? 2 : 0) + (temp > 30 ? 3 : 0);
    return Math.round(feelsLike);
  };

  const feelsLike = getFeelsLike(temperature, humidity);

  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-label font-semibold">Weather — {location} (Now)</h3>
        <button className="text-xs text-[#28784A] hover:text-green-700 transition-colors">
          View 24h weather
        </button>
      </div>

      {/* Weather Cards Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 flex-1">
        {/* Temperature */}
        <div className="bg-pastel-temp rounded-lg p-2">
          <div className="flex items-center space-x-1 mb-1">
            <Thermometer className="w-3 h-3 text-orange-600" />
            <span className="text-xs font-medium text-gray-700">Temperature</span>
          </div>
          <div className="text-xl font-bold text-gray-800 mb-1">{temperature}°C</div>
          <div className="text-xs text-gray-600 mb-1">Feels like {feelsLike}°C</div>
          <div className="text-xs text-gray-500">Min: {temperature - 3}°C</div>
          <div className="text-xs text-gray-500">Max: {temperature + 5}°C</div>
        </div>

        {/* Humidity */}
        <div className="bg-pastel-humidity rounded-lg p-2">
          <div className="flex items-center space-x-1 mb-1">
            <Droplets className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Humidity</span>
          </div>
          <div className="text-xl font-bold text-gray-800 mb-1">{humidity}%</div>
          <div className="text-xs text-gray-600 mb-1">{getHumidityComfort(humidity)}</div>
          <div className="text-xs text-gray-500">Dew Point: {Math.round(temperature - (100 - humidity) / 5)}°C</div>
          <div className="text-xs text-gray-500">Pressure: 1013 hPa</div>
        </div>

        {/* Wind */}
        <div className="bg-pastel-wind rounded-lg p-2">
          <div className="flex items-center space-x-1 mb-1">
            <Wind className="w-3 h-3 text-green-600" />
            <span className="text-xs font-medium text-gray-700">Wind</span>
          </div>
          <div className="text-xl font-bold text-gray-800 mb-1">{windSpeed} km/h</div>
          <div className="text-xs text-gray-600 mb-1">{windDirection} • {getWindDescription(windSpeed)}</div>
          <div className="text-xs text-gray-500">Gusts: {windSpeed + 5} km/h</div>
          <div className="text-xs text-gray-500">Direction: {windDirection}</div>
        </div>

        {/* UV Index */}
        <div className="bg-pastel-uv rounded-lg p-2">
          <div className="flex items-center space-x-1 mb-1">
            <Sun className="w-3 h-3 text-yellow-600" />
            <span className="text-xs font-medium text-gray-700">UV Index</span>
          </div>
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-xl font-bold text-gray-800">{uvIndex}</span>
            <span className={`px-1 py-0.5 rounded-full text-xs font-medium ${uvInfo.bgColor} ${uvInfo.color}`}>
              {uvInfo.category}
            </span>
          </div>
          <div className="text-xs text-gray-500">Sunrise: 06:45</div>
          <div className="text-xs text-gray-500">Sunset: 18:30</div>
        </div>
      </div>

      {/* Observation Time */}
      <div className="flex items-center space-x-2 text-meta mt-auto">
        <Clock className="w-3 h-3" />
        <span className="text-xs">Observation time: 09:00 AM</span>
      </div>
    </div>
  );
};

export default WeatherWidget;
