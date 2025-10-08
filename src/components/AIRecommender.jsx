import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Share2, 
  CheckCircle,
  AlertTriangle,
  Shield,
  Heart,
  Activity,
  Wind,
  Sun,
  Droplets,
  Thermometer,
  ArrowRight,
  ArrowLeft,
  Star,
  Clock,
  User,
  Zap,
  Target,
  Sparkles,
  TrendingUp,
  Info
} from 'lucide-react';

const AIRecommender = ({ currentData, location }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showWizard, setShowWizard] = useState(false);
  const [recommendationHistory, setRecommendationHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [formData, setFormData] = useState({
    healthCondition: '',
    skinType: '',
    activityIntent: '',
    allergies: [],
    notes: '',
    savePreferences: false
  });

  const healthConditions = [
    { 
      id: 'healthy', 
      name: 'Healthy', 
      description: 'No known respiratory conditions',
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      id: 'asthma', 
      name: 'Asthma', 
      description: 'Sensitive airways, may react to pollutants',
      icon: Wind,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      id: 'copd', 
      name: 'COPD', 
      description: 'Chronic lung disease, high sensitivity',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    { 
      id: 'pregnant', 
      name: 'Pregnant', 
      description: 'Extra precautions for you and baby',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    { 
      id: 'child', 
      name: 'Young child (0-5)', 
      description: 'Developing lungs need extra protection',
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    { 
      id: 'elderly', 
      name: 'Elderly 65+', 
      description: 'May have reduced lung function',
      icon: Shield,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  const skinTypes = [
    { id: 'normal', name: 'Normal', description: 'Balanced skin' },
    { id: 'dry', name: 'Dry', description: 'Needs extra moisture' },
    { id: 'oily', name: 'Oily', description: 'Prone to breakouts' },
    { id: 'sensitive', name: 'Sensitive', description: 'Easily irritated' },
    { id: 'acne', name: 'Acne-prone', description: 'Requires gentle care' }
  ];

  const activityIntents = [
    { id: 'exercise', name: 'Outdoor exercise', description: 'Running, cycling, sports', icon: Activity },
    { id: 'commute', name: 'Commuting', description: 'Walking, cycling to work', icon: Target },
    { id: 'gardening', name: 'Gardening', description: 'Outdoor plant care', icon: Sun },
    { id: 'work', name: 'Outdoor work', description: 'Construction, delivery', icon: Shield },
    { id: 'leisure', name: 'Leisure outdoors', description: 'Picnics, walks, events', icon: Heart }
  ];

  const allergyOptions = [
    { id: 'dust', name: 'Dust', icon: Wind },
    { id: 'pollen', name: 'Pollen', icon: Sun },
    { id: 'mold', name: 'Mold', icon: Droplets },
    { id: 'none', name: 'None', icon: CheckCircle }
  ];

  const steps = [
    { id: 'health', title: 'Health Profile', description: 'Tell us about your health condition' },
    { id: 'skin', title: 'Skin Type', description: 'Help us personalize skin care advice' },
    { id: 'activity', title: 'Planned Activity', description: 'What will you be doing outdoors?' },
    { id: 'allergies', title: 'Allergies & Notes', description: 'Any specific concerns?' },
    { id: 'review', title: 'Review & Generate', description: 'Ready to get your recommendations' }
  ];

  const handleInputChange = (field, value) => {
    if (field === 'allergies') {
      setFormData(prev => ({
        ...prev,
        allergies: prev.allergies.includes(value)
          ? prev.allergies.filter(a => a !== value)
          : [...prev.allergies, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.healthCondition !== '';
      case 1: return formData.skinType !== '';
      case 2: return formData.activityIntent !== '';
      case 3: return true; // Allergies and notes are optional
      case 4: return true; // Review step
      default: return false;
    }
  };

  const startWizard = () => {
    setShowWizard(true);
    setCurrentStep(0);
    setRecommendations(null);
  };

  const skipWizard = () => {
    setShowWizard(false);
    setCurrentStep(0);
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    setShowWizard(false);
    
    // Simulate API call with progress
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const healthCondition = healthConditions.find(h => h.id === formData.healthCondition);
    const skinType = skinTypes.find(s => s.id === formData.skinType);
    const activity = activityIntents.find(a => a.id === formData.activityIntent);
    
    const mockRecommendations = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      summary: `Today: AQI ${currentData.currentAQI.category} (${currentData.currentAQI.value}). ${currentData.currentAQI.primaryPollutant} is the main concern. ${healthCondition?.name === 'Asthma' ? 'Avoid vigorous outdoor exercise.' : 'Consider limiting outdoor activities.'}`,
      actions: [
        {
          type: 'Reduce Exposure',
          icon: Shield,
          text: healthCondition?.name === 'Asthma' ? 'Use N95 mask / stay indoors during 10am–4pm' : 'Limit outdoor time during peak pollution hours',
          priority: 'high'
        },
        {
          type: 'Skin Care',
          icon: Heart,
          text: skinType?.name === 'Sensitive' ? 'Apply barrier moisturizer after coming indoors' : 'Use gentle cleanser and moisturizer',
          priority: 'medium'
        },
        {
          type: 'Medication',
          icon: Activity,
          text: healthCondition?.name === 'Asthma' ? 'Carry inhaler; keep rescue meds ready' : 'Consider air purifier for indoor spaces',
          priority: 'high'
        }
      ],
      explanation: {
        why: `Current AQI of ${currentData.currentAQI.value} indicates ${currentData.currentAQI.category.toLowerCase()} air quality. ${currentData.currentAQI.primaryPollutant} levels are elevated, which can affect respiratory health.`,
        evidence: `AQI: ${currentData.currentAQI.value}, ${currentData.currentAQI.primaryPollutant}: ${currentData.pollutants.find(p => p.name === currentData.currentAQI.primaryPollutant)?.value || 'N/A'} µg/m³, Humidity: ${currentData.weather.humidity}%, Wind: ${currentData.weather.windSpeed} km/h`,
        tips: [
          'Check air quality before outdoor activities',
          'Use air purifiers in indoor spaces',
          'Keep windows closed during high pollution periods',
          'Wear appropriate masks when necessary',
          'Stay hydrated and maintain good indoor air circulation'
        ]
      },
      confidence: 82,
      userProfile: {
        healthCondition: healthCondition?.name,
        skinType: skinType?.name,
        activity: activity?.name,
        allergies: formData.allergies
      }
    };
    
    setRecommendations(mockRecommendations);
    setRecommendationHistory(prev => [mockRecommendations, ...prev.slice(0, 4)]); // Keep last 5
    setIsLoading(false);
  };

  const addToFavorites = (recommendation) => {
    setFavorites(prev => [...prev, recommendation.id]);
  };

  const removeFromFavorites = (recommendationId) => {
    setFavorites(prev => prev.filter(id => id !== recommendationId));
  };

  const getSmartSuggestions = () => {
    const aqi = currentData.currentAQI.value;
    const suggestions = [];
    
    if (aqi > 100) {
      suggestions.push({
        icon: AlertTriangle,
        text: "High pollution detected - consider staying indoors",
        color: "text-red-600",
        bgColor: "bg-red-50"
      });
    }
    
    if (currentData.weather.humidity > 80) {
      suggestions.push({
        icon: Droplets,
        text: "High humidity may worsen air quality effects",
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      });
    }
    
    if (currentData.weather.windSpeed < 5) {
      suggestions.push({
        icon: Wind,
        text: "Low wind speed - pollutants may accumulate",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      });
    }
    
    return suggestions;
  };

  const resetForm = () => {
    setFormData({
      healthCondition: '',
      skinType: '',
      activityIntent: '',
      allergies: [],
      notes: '',
      savePreferences: false
    });
    setRecommendations(null);
    setShowWizard(false);
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Health Condition
        return (
          <div className="space-y-3">
            <div className="text-center mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">What's your health condition?</h4>
              <p className="text-xs text-gray-600">This helps us provide personalized advice</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {healthConditions.map((condition) => {
                const Icon = condition.icon;
                const isSelected = formData.healthCondition === condition.id;
                return (
                  <button
                    key={condition.id}
                    onClick={() => handleInputChange('healthCondition', condition.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                      isSelected 
                        ? `${condition.bgColor} ${condition.borderColor} border-2` 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isSelected ? condition.color : 'text-gray-400'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isSelected ? condition.color : 'text-gray-800'}`}>
                          {condition.name}
                        </p>
                        <p className="text-xs text-gray-600">{condition.description}</p>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 1: // Skin Type
        return (
          <div className="space-y-3">
            <div className="text-center mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">What's your skin type?</h4>
              <p className="text-xs text-gray-600">Help us personalize skin care advice</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {skinTypes.map((skin) => {
                const isSelected = formData.skinType === skin.id;
                return (
                  <button
                    key={skin.id}
                    onClick={() => handleInputChange('skinType', skin.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-300 border-2' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                          {skin.name}
                        </p>
                        <p className="text-xs text-gray-600">{skin.description}</p>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2: // Activity Intent
        return (
          <div className="space-y-3">
            <div className="text-center mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">What will you be doing outdoors?</h4>
              <p className="text-xs text-gray-600">This helps us tailor our recommendations</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {activityIntents.map((activity) => {
                const Icon = activity.icon;
                const isSelected = formData.activityIntent === activity.id;
                return (
                  <button
                    key={activity.id}
                    onClick={() => handleInputChange('activityIntent', activity.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                      isSelected 
                        ? 'bg-green-50 border-green-300 border-2' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isSelected ? 'text-green-800' : 'text-gray-800'}`}>
                          {activity.name}
                        </p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3: // Allergies & Notes
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">Any allergies or concerns?</h4>
              <p className="text-xs text-gray-600">Optional - helps us provide better advice</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Allergies</label>
              <div className="grid grid-cols-2 gap-2">
                {allergyOptions.map(allergy => {
                  const Icon = allergy.icon;
                  const isSelected = formData.allergies.includes(allergy.id);
                  return (
                    <button
                      key={allergy.id}
                      onClick={() => handleInputChange('allergies', allergy.id)}
                      className={`p-2 rounded-lg border text-center transition-all duration-200 ${
                        isSelected 
                          ? 'bg-purple-50 border-purple-300 border-2' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                      <p className={`text-xs ${isSelected ? 'text-purple-800 font-medium' : 'text-gray-600'}`}>
                        {allergy.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Additional notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any other concerns? e.g., 'I have a runny nose'"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#28784A] focus:border-transparent resize-none"
                rows="3"
              />
            </div>
          </div>
        );

      case 4: // Review
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">Review your profile</h4>
              <p className="text-xs text-gray-600">Ready to get personalized recommendations?</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Health condition:</span>
                <span className="text-xs font-medium text-gray-800">
                  {healthConditions.find(h => h.id === formData.healthCondition)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Skin type:</span>
                <span className="text-xs font-medium text-gray-800">
                  {skinTypes.find(s => s.id === formData.skinType)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Activity:</span>
                <span className="text-xs font-medium text-gray-800">
                  {activityIntents.find(a => a.id === formData.activityIntent)?.name}
                </span>
              </div>
              {formData.allergies.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Allergies:</span>
                  <span className="text-xs font-medium text-gray-800">
                    {formData.allergies.map(id => allergyOptions.find(a => a.id === id)?.name).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="savePreferences"
                checked={formData.savePreferences}
                onChange={(e) => handleInputChange('savePreferences', e.target.checked)}
                className="rounded border-gray-300 text-[#28784A] focus:ring-[#28784A] w-3 h-3"
              />
              <label htmlFor="savePreferences" className="text-xs text-gray-600">
                Save preferences for 7 days
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-[#28784A]" />
          <h3 className="text-label font-semibold">AI Health Recommender</h3>
        </div>
        <div className="flex items-center space-x-1">
          {recommendationHistory.length > 0 && (
            <button
              onClick={() => setRecommendations(recommendationHistory[0])}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              title="View last recommendation"
            >
              <Clock className="w-3 h-3 text-gray-500" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <p className="text-meta mb-3 text-xs">Get personalized health advice based on current air quality and your profile.</p>

      {/* Smart Suggestions */}
      {!showWizard && !recommendations && (
        <div className="mb-3 space-y-2">
          {getSmartSuggestions().map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div key={index} className={`p-2 rounded-lg ${suggestion.bgColor} flex items-center space-x-2`}>
                <Icon className={`w-3 h-3 ${suggestion.color}`} />
                <p className={`text-xs ${suggestion.color}`}>{suggestion.text}</p>
              </div>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#28784A] rounded-full animate-spin"></div>
            <Brain className="w-6 h-6 text-[#28784A] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">Analyzing your profile...</p>
            <p className="text-xs text-gray-600">Generating personalized recommendations</p>
          </div>
        </div>
      ) : showWizard ? (
        <div className="flex-1 flex flex-col">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-[#28784A] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Title */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800">{steps[currentStep].title}</h4>
            <p className="text-xs text-gray-600">{steps[currentStep].description}</p>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-1 px-3 py-2 text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center space-x-1 px-4 py-2 bg-[#28784A] text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={generateRecommendations}
                  disabled={!canProceed()}
                  className="flex items-center space-x-1 px-4 py-2 bg-[#28784A] text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Get Recommendations</span>
                </button>
              )}
            </div>
          </div>

          {/* Skip Option */}
          <div className="text-center pt-2">
            <button
              onClick={skipWizard}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip wizard and use quick form
            </button>
          </div>
        </div>
      ) : !recommendations ? (
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#28784A] to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Get Personalized Health Advice</h4>
            <p className="text-xs text-gray-600 mb-4">
              Our AI analyzes current air quality data and your health profile to provide tailored recommendations.
            </p>
          </div>

          <div className="space-y-3 flex-1">
            <button
              onClick={startWizard}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#28784A] to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Health Assessment</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, healthCondition: 'healthy', skinType: 'normal', activityIntent: 'leisure' }));
                  generateRecommendations();
                }}
                className="py-2 px-3 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Quick Recommendation
              </button>
              <button
                onClick={() => setShowWizard(true)}
                className="py-2 px-3 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Custom Profile
              </button>
            </div>

            {recommendationHistory.length > 0 && (
              <div className="mt-4">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Recent Recommendations</h5>
                <div className="space-y-1">
                  {recommendationHistory.slice(0, 2).map((rec, index) => (
                    <button
                      key={rec.id}
                      onClick={() => setRecommendations(rec)}
                      className="w-full p-2 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-xs font-medium text-gray-800 truncate">{rec.summary}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(rec.timestamp).toLocaleDateString()} • {rec.confidence}% confidence
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {/* Summary */}
          <div className="p-3 bg-gradient-to-r from-[#E6F6EE] to-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-[#28784A] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-[#28784A] mb-1">AI Recommendation</p>
                <p className="text-xs text-gray-700">{recommendations.summary}</p>
              </div>
            </div>
          </div>

          {/* Action Tiles */}
          <div className="space-y-2">
            {recommendations.actions.map((action, index) => {
              const Icon = action.icon;
              const priorityColors = {
                high: 'border-red-200 bg-red-50',
                medium: 'border-yellow-200 bg-yellow-50',
                low: 'border-gray-200 bg-gray-50'
              };
              return (
                <div key={index} className={`p-3 rounded-lg border ${priorityColors[action.priority] || priorityColors.medium}`}>
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-4 h-4 mt-0.5 ${
                      action.priority === 'high' ? 'text-red-600' : 
                      action.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800 mb-1">{action.type}</p>
                      <p className="text-xs text-gray-600">{action.text}</p>
                    </div>
                    {action.priority === 'high' && (
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation Accordion */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full px-3 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
            >
              <span>Detailed Explanation</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            
            {isExpanded && (
              <div className="px-3 pb-3 space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                    <Info className="w-3 h-3" />
                    <span>Why this recommendation?</span>
                  </h4>
                  <p className="text-xs text-gray-600">{recommendations.explanation.why}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Current conditions</span>
                  </h4>
                  <p className="text-xs text-gray-600">{recommendations.explanation.evidence}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>Pro tips</span>
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {recommendations.explanation.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-[#28784A] mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 mt-auto">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Confidence:</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {recommendations.confidence}%
                </span>
              </div>
              <button
                onClick={() => addToFavorites(recommendations)}
                className={`p-1 rounded transition-colors ${
                  favorites.includes(recommendations.id) 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
                title={favorites.includes(recommendations.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-3 h-3 ${favorites.includes(recommendations.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="flex space-x-1">
              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Download">
                <Download className="w-3 h-3" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Share">
                <Share2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={resetForm}
              className="flex-1 py-2 text-xs text-[#28784A] hover:text-green-700 transition-colors font-medium"
            >
              Get New Recommendations
            </button>
            <button
              onClick={startWizard}
              className="flex-1 py-2 text-xs text-gray-600 hover:text-gray-800 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommender;
