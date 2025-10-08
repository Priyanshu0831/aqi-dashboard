import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Clock } from 'lucide-react';

const AQICard = ({ aqiData, location = 'Muscat' }) => {
  const { value, category, primaryPollutant, lastUpdate, trend } = aqiData;

  // Get AQI color classes
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'bg-gradient-to-br from-green-600 to-green-700';
    if (aqi <= 100) return 'bg-gradient-to-br from-yellow-600 to-yellow-700';
    if (aqi <= 150) return 'bg-gradient-to-br from-orange-600 to-orange-700';
    if (aqi <= 200) return 'bg-gradient-to-br from-red-600 to-red-700';
    if (aqi <= 300) return 'bg-gradient-to-br from-purple-600 to-purple-700';
    return 'bg-gradient-to-br from-red-800 to-red-900';
  };

  const getAQITextColor = (aqi) => {
    if (aqi <= 50) return 'text-aqi-good';
    if (aqi <= 100) return 'text-aqi-satisfactory';
    if (aqi <= 150) return 'text-aqi-moderate';
    if (aqi <= 200) return 'text-aqi-unhealthy';
    if (aqi <= 300) return 'text-aqi-very-unhealthy';
    return 'text-aqi-hazardous';
  };

  // Get trend icon and direction
  const getTrendInfo = () => {
    if (!trend || trend.length < 2) return { icon: Minus, direction: 'stable', change: 0 };
    
    const current = trend[trend.length - 1];
    const previous = trend[trend.length - 2];
    const change = current - previous;
    
    if (change > 0) return { icon: TrendingUp, direction: 'up', change: Math.abs(change) };
    if (change < 0) return { icon: TrendingDown, direction: 'down', change: Math.abs(change) };
    return { icon: Minus, direction: 'stable', change: 0 };
  };

  const trendInfo = getTrendInfo();

  // Get health advisory based on AQI
  const getHealthAdvisory = (aqi) => {
    if (aqi <= 50) {
      return {
        message: 'Air quality is good. Enjoy outdoor activities.',
        icon: '😊',
        color: 'text-green-600'
      };
    } else if (aqi <= 100) {
      return {
        message: 'Air quality is satisfactory. Sensitive individuals should limit outdoor exercise.',
        icon: '🙂',
        color: 'text-yellow-600'
      };
    } else if (aqi <= 150) {
      return {
        message: 'Air quality is moderate. Children and elderly should avoid prolonged outdoor activities.',
        icon: '😷',
        color: 'text-orange-600'
      };
    } else if (aqi <= 200) {
      return {
        message: 'Air quality is unhealthy. Avoid outdoor activities, especially exercise.',
        icon: '⚠️',
        color: 'text-red-600'
      };
    } else {
      return {
        message: 'Air quality is very unhealthy. Stay indoors and avoid outdoor activities.',
        icon: '🚫',
        color: 'text-red-700'
      };
    }
  };

  const healthAdvisory = getHealthAdvisory(value);

  return (
    <div className={`${getAQIColor(value)} rounded-2xl p-6 text-white relative overflow-hidden h-full`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Current AQI</h3>
            <p className="text-sm opacity-90">{location}</p>
          </div>
          <div className="flex items-center space-x-2">
            {React.createElement(trendInfo.icon, { 
              className: `w-4 h-4 ${trendInfo.direction === 'up' ? 'text-red-200' : trendInfo.direction === 'down' ? 'text-green-200' : 'text-white'}` 
            })}
            <span className="text-xs opacity-90">24h trend</span>
          </div>
        </div>
        
        {/* Main AQI Display */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-4xl font-bold mb-1">{value}</div>
            <div className="text-base font-medium opacity-90">{category}</div>
            <div className="text-xs opacity-75">Primary: {primaryPollutant}</div>
          </div>
          
          <div className="text-right">
            <div className="text-xs opacity-75">Last updated</div>
            <div className="text-xs opacity-60">{lastUpdate}</div>
          </div>
        </div>

        {/* Health Advisory */}
        <div className="bg-white bg-opacity-20 rounded-lg p-2 mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm">{healthAdvisory.icon}</span>
            <span className="text-xs font-medium">Health Advisory</span>
          </div>
          <p className="text-xs opacity-90 leading-relaxed">{healthAdvisory.message}</p>
        </div>

        {/* Additional AQI Data */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white bg-opacity-15 rounded-lg p-2">
            <div className="text-xs opacity-75 mb-1">24h Average</div>
            <div className="text-sm font-semibold">{Math.round(value * 0.95)}</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-lg p-2">
            <div className="text-xs opacity-75 mb-1">Peak Today</div>
            <div className="text-sm font-semibold">{Math.round(value * 1.1)}</div>
          </div>
        </div>

        {/* Pollutant Levels */}
        <div className="bg-white bg-opacity-15 rounded-lg p-2 mb-3">
          <div className="text-xs font-medium mb-2">Key Pollutants</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-90">PM2.5</span>
              <span className="text-xs font-semibold">35 μg/m³</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-90">PM10</span>
              <span className="text-xs font-semibold">28 μg/m³</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-90">NO₂</span>
              <span className="text-xs font-semibold">15 μg/m³</span>
            </div>
          </div>
        </div>

        {/* Trend Information */}
        <div className="flex items-center justify-between text-xs mt-auto">
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 opacity-75" />
            <span className="opacity-75">Trend: {trendInfo.direction}</span>
            {trendInfo.change > 0 && (
              <span className="opacity-75">({trendInfo.change} pts)</span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 opacity-75" />
            <span className="opacity-75">Monitor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQICard;
