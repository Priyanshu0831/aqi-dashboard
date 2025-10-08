import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

const PollutantTooltip = ({ pollutant, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const pollutantInfo = {
    'PM2.5': {
      name: 'PM2.5 (Fine Particulate Matter)',
      description: 'Particles with diameter less than 2.5 micrometers',
      sources: 'Vehicle emissions, industrial processes, wildfires, dust',
      healthEffects: 'Can penetrate deep into lungs, cause respiratory and cardiovascular problems',
      safeLevels: 'WHO: <15 μg/m³ (24h), <5 μg/m³ (annual)',
      color: '#28784A'
    },
    'PM10': {
      name: 'PM10 (Coarse Particulate Matter)',
      description: 'Particles with diameter less than 10 micrometers',
      sources: 'Dust, pollen, mold spores, construction sites, unpaved roads',
      healthEffects: 'Can irritate eyes, nose, throat, and lungs',
      safeLevels: 'WHO: <45 μg/m³ (24h), <15 μg/m³ (annual)',
      color: '#F6C94C'
    },
    'NO2': {
      name: 'NO₂ (Nitrogen Dioxide)',
      description: 'Reddish-brown gas formed by combustion processes',
      sources: 'Vehicle emissions, power plants, industrial facilities',
      healthEffects: 'Can cause respiratory problems, especially in asthmatics',
      safeLevels: 'WHO: <25 μg/m³ (24h), <10 μg/m³ (annual)',
      color: '#F59E0B'
    },
    'O3': {
      name: 'O₃ (Ozone)',
      description: 'Colorless gas formed by chemical reactions in sunlight',
      sources: 'Vehicle emissions, industrial emissions, chemical reactions',
      healthEffects: 'Can cause chest pain, coughing, throat irritation',
      safeLevels: 'WHO: <100 μg/m³ (8h average)',
      color: '#EF4444'
    },
    'SO2': {
      name: 'SO₂ (Sulfur Dioxide)',
      description: 'Colorless gas with a pungent odor',
      sources: 'Burning fossil fuels, industrial processes, volcanoes',
      healthEffects: 'Can cause breathing problems, especially in asthmatics',
      safeLevels: 'WHO: <40 μg/m³ (24h), <20 μg/m³ (24h)',
      color: '#8B5CF6'
    }
  };

  const info = pollutantInfo[pollutant] || {
    name: pollutant,
    description: 'Air pollutant',
    sources: 'Various sources',
    healthEffects: 'Can affect air quality and health',
    safeLevels: 'Check local guidelines',
    color: '#6B7280'
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
        aria-label={`Learn more about ${pollutant}`}
      >
        <Info className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-lg mx-4 max-h-[85vh] overflow-y-auto animate-slideUp shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: info.color }}
                >
                  {pollutant.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{info.name}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Description
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">{info.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-orange-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Main Sources
                  </h4>
                  <p className="text-sm text-orange-700">{info.sources}</p>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Health Effects
                  </h4>
                  <p className="text-sm text-red-700">{info.healthEffects}</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  WHO Safe Levels
                </h4>
                <p className="text-sm text-green-700 font-medium">{info.safeLevels}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-3">Current Level Indicator</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-6 h-6 rounded-full shadow-md" 
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="text-sm text-blue-700 font-medium">{pollutant} Level</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-800">Moderate</div>
                    <div className="text-xs text-blue-600">Above WHO guidelines</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-purple-800 mb-2">💡 Pro Tips</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Check air quality before outdoor activities</li>
                  <li>• Use air purifiers in indoor spaces</li>
                  <li>• Wear appropriate masks when levels are high</li>
                  <li>• Keep windows closed during peak pollution hours</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-[#28784A] text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 text-sm font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PollutantTooltip;
