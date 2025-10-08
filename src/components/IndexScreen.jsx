import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  BarChart3, 
  ArrowRight,
  Users,
  Shield,
  Activity
} from 'lucide-react';

const IndexScreen = () => {
  const navigate = useNavigate();

  const handleLandingClick = () => {
    navigate('/landing');
  };

  const handleDashboardClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full mr-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">AQI Dashboard</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your access level to continue to the Air Quality Index monitoring system
          </p>
        </div>

        {/* Entry Point Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Public Landing Page Card */}
          <div 
            onClick={handleLandingClick}
            className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-4 rounded-xl mr-4 group-hover:bg-green-200 transition-colors">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Public Access</h2>
                  <p className="text-gray-500">Landing Screen</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access public air quality information, view real-time AQI data, and explore environmental insights without requiring authentication.
              </p>
              
              <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                <span>Enter as Guest</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="h-4 w-4 mr-2" />
                <span>No login required</span>
              </div>
            </div>
          </div>

          {/* Internal Dashboard Card */}
          <div 
            onClick={handleDashboardClick}
            className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-4 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Internal Users</h2>
                  <p className="text-gray-500">Dashboard Access</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access the full dashboard with advanced analytics, user management, and administrative features for internal team members.
              </p>
              
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                <span>Login Required</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>Authentication required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Air Quality Index Monitoring System • Environmental Data Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndexScreen;
