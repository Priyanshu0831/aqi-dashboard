import React from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Heart, 
  Users, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Target,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Clock,
  Star,
  Bell,
  Download,
  Share2,
  CheckCircle
} from 'lucide-react';

// Health Advisory Widget
export const HealthAdvisoryWidget = ({ aqi }) => {
  const getHealthLevel = (aqi) => {
    if (aqi <= 50) return { level: 'Low Risk', color: 'text-green-600', bgColor: 'bg-green-50', icon: Shield };
    if (aqi <= 100) return { level: 'Moderate Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: AlertTriangle };
    if (aqi <= 150) return { level: 'High Risk', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: AlertTriangle };
    return { level: 'Very High Risk', color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertTriangle };
  };

  const healthData = getHealthLevel(aqi);
  const Icon = healthData.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 ${healthData.bgColor} rounded-lg`}>
          <Heart className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Health Advisory</h3>
          <p className="text-sm text-gray-500">Risk assessment for sensitive groups</p>
        </div>
      </div>

      <div className={`${healthData.bgColor} rounded-xl p-4 mb-4`}>
        <div className="flex items-center space-x-3">
          <Icon className={`w-8 h-8 ${healthData.color}`} />
          <div>
            <p className={`text-lg font-bold ${healthData.color}`}>{healthData.level}</p>
            <p className="text-sm text-gray-600">Current health risk level</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Outdoor Activities</span>
          <span className={aqi <= 100 ? 'text-green-600' : 'text-red-600'}>
            {aqi <= 100 ? 'Safe' : 'Avoid'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Exercise</span>
          <span className={aqi <= 50 ? 'text-green-600' : aqi <= 100 ? 'text-yellow-600' : 'text-red-600'}>
            {aqi <= 50 ? 'Recommended' : aqi <= 100 ? 'Moderate' : 'Avoid'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Sensitive Groups</span>
          <span className={aqi <= 50 ? 'text-green-600' : 'text-red-600'}>
            {aqi <= 50 ? 'Safe' : 'High Risk'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Air Quality Trends Widget
export const AirQualityTrendsWidget = ({ data }) => {
  const trends = data || [
    { period: '1h', value: 85, change: 2 },
    { period: '6h', value: 82, change: -3 },
    { period: '24h', value: 78, change: -7 },
    { period: '7d', value: 75, change: -10 }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Air Quality Trends</h3>
          <p className="text-sm text-gray-500">Recent changes in air quality</p>
        </div>
      </div>

      <div className="space-y-4">
        {trends.map((trend, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-gray-800">{trend.period}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-800">{trend.value}</span>
              <div className={`flex items-center ${trend.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {trend.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(trend.change)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Station Status Widget
export const StationStatusWidget = ({ stations }) => {
  const activeStations = stations?.filter(station => station.status === 'active').length || 8;
  const totalStations = stations?.length || 10;
  const offlineStations = totalStations - activeStations;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Globe className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Station Status</h3>
          <p className="text-sm text-gray-500">Monitoring network health</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{activeStations}</p>
          <p className="text-sm text-gray-600">Active Stations</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-xl">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{offlineStations}</p>
          <p className="text-sm text-gray-600">Offline Stations</p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(activeStations / totalStations) * 100}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        {Math.round((activeStations / totalStations) * 100)}% Network Uptime
      </p>
    </div>
  );
};

// Air Quality Alerts Widget
export const AirQualityAlertsWidget = ({ alerts }) => {
  const alertData = alerts || [
    { id: 1, type: 'warning', message: 'High PM2.5 levels detected in Salalah', time: '2 hours ago', severity: 'moderate' },
    { id: 2, type: 'info', message: 'New monitoring station added in Nizwa', time: '1 day ago', severity: 'low' },
    { id: 3, type: 'success', message: 'Air quality improved across Muscat region', time: '3 days ago', severity: 'low' }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info': return <Bell className="w-5 h-5 text-blue-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'border-orange-200 bg-orange-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Bell className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Air Quality Alerts</h3>
          <p className="text-sm text-gray-500">Recent notifications and updates</p>
        </div>
      </div>

      <div className="space-y-3">
        {alertData.map((alert) => (
          <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
            <div className="flex items-start space-x-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Actions Widget
export const QuickActionsWidget = () => {
  const actions = [
    { icon: Download, label: 'Export Data', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { icon: Share2, label: 'Share Report', color: 'text-green-600', bgColor: 'bg-green-50' },
    { icon: Bell, label: 'Set Alerts', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { icon: Calendar, label: 'Schedule', color: 'text-purple-600', bgColor: 'bg-purple-50' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Zap className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          <p className="text-sm text-gray-500">Common tasks and tools</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className={`p-4 rounded-xl ${action.bgColor} hover:shadow-md transition-all duration-200 text-left`}
            >
              <Icon className={`w-6 h-6 ${action.color} mb-2`} />
              <p className={`text-sm font-medium ${action.color}`}>{action.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Air Quality Score Widget
export const AirQualityScoreWidget = ({ score = 78 }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Award className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Air Quality Score</h3>
          <p className="text-sm text-gray-500">Overall environmental health</p>
        </div>
      </div>

      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={getScoreColor(score)}
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
          </div>
        </div>
        <p className={`text-lg font-semibold ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
        <p className="text-sm text-gray-500 mt-2">Based on multiple factors</p>
      </div>
    </div>
  );
};

// Weather Forecast Widget
export const WeatherForecastWidget = ({ forecast }) => {
  const forecastData = forecast || [
    { day: 'Today', temp: 28, condition: 'Sunny', icon: '☀️' },
    { day: 'Tomorrow', temp: 26, condition: 'Partly Cloudy', icon: '⛅' },
    { day: 'Wed', temp: 24, condition: 'Cloudy', icon: '☁️' },
    { day: 'Thu', temp: 27, condition: 'Sunny', icon: '☀️' },
    { day: 'Fri', temp: 29, condition: 'Hot', icon: '🔥' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">5-Day Forecast</h3>
          <p className="text-sm text-gray-500">Weather predictions</p>
        </div>
      </div>

      <div className="space-y-3">
        {forecastData.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{day.icon}</span>
              <div>
                <p className="font-medium text-gray-800">{day.day}</p>
                <p className="text-sm text-gray-500">{day.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-800">{day.temp}°C</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Data Quality Widget
export const DataQualityWidget = ({ quality = 95 }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <BarChart3 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Data Quality</h3>
          <p className="text-sm text-gray-500">Sensor accuracy and reliability</p>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="relative w-24 h-24 mx-auto mb-2">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-green-500"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${quality}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-green-600">{quality}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">High Quality Data</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Sensor Calibration</span>
          <span className="text-green-600 font-medium">Optimal</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Data Completeness</span>
          <span className="text-green-600 font-medium">98%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Update Frequency</span>
          <span className="text-green-600 font-medium">Real-time</span>
        </div>
      </div>
    </div>
  );
};
