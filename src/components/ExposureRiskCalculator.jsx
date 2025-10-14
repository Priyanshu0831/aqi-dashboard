import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  User, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Download,
  Share2,
  RefreshCw,
  Heart,
  Brain,
  Zap,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  BarChart3,
  Info,
  Lightbulb,
  Calendar,
  TrendingUp
} from 'lucide-react';
import './ExposureRiskCalculator.css';

const ExposureRiskCalculator = ({ onRedirectToDashboard, onDirectLogin, selectedLocation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRTL, setIsRTL] = useState(false);
  const [showContactOverlay, setShowContactOverlay] = useState(false);
  const [showOTPOverlay, setShowOTPOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [requestId, setRequestId] = useState('');
  const [maskedContact, setMaskedContact] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState(null);
  
  const otpInputRefs = useRef([]);
  const contactFormRef = useRef(null);

  // Calculator form data
  const [formData, setFormData] = useState({
    activity: '',
    duration: 30,
    location: selectedLocation || '',
    timeOfDay: 'morning',
    ageGroup: '',
    respiratoryCondition: 'none',
    maskUsage: 'none',
    allergies: [],
    skinType: 'normal',
    otherConcerns: ''
  });

  // Contact form data
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // No validation errors needed

  const totalSteps = 5;

  // Check for RTL language
  useEffect(() => {
    const htmlDir = document.documentElement.dir;
    setIsRTL(htmlDir === 'rtl');
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debouncedSave.current) {
        clearTimeout(debouncedSave.current);
      }
    };
  }, []);

  // Load saved data from sessionStorage
  useEffect(() => {
    const savedData = sessionStorage.getItem('exposure_calc_input');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => {
          // Only update if there are actual differences to prevent unnecessary re-renders
          const hasChanges = Object.keys(parsed).some(key => prev[key] !== parsed[key]);
          return hasChanges ? { ...prev, ...parsed } : prev;
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Update location when selectedLocation prop changes
  useEffect(() => {
    if (selectedLocation) {
      setFormData(prev => ({ ...prev, location: selectedLocation }));
    }
  }, [selectedLocation]);

  // Focus first OTP input when overlay opens
  useEffect(() => {
    if (showOTPOverlay && otpInputRefs.current[0]) {
      setTimeout(() => {
        otpInputRefs.current[0].focus();
      }, 100);
    }
  }, [showOTPOverlay]);

  // Save data to sessionStorage with debouncing
  const saveToSessionStorage = (data) => {
    sessionStorage.setItem('exposure_calc_input', JSON.stringify(data));
  };

  // Debounced save function
  const debouncedSave = useRef(null);
  const debouncedSaveToSessionStorage = (data) => {
    if (debouncedSave.current) {
      clearTimeout(debouncedSave.current);
    }
    debouncedSave.current = setTimeout(() => {
      saveToSessionStorage(data);
    }, 300);
  };

  // Analytics tracking
  const trackEvent = (eventName, properties = {}) => {
    console.log('Analytics Event:', eventName, properties);
    // In a real app, this would send to analytics service
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      saveToSessionStorage(formData);
      trackEvent('exposure_calc_step_completed', { step: newStep });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  // Form data handlers - stable reference
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Use debounced save to avoid excessive sessionStorage writes
      debouncedSaveToSessionStorage(newData);
      return newData;
    });
  }, []);

  const handleActivitySelect = (activity) => {
    updateFormData('activity', activity);
    nextStep();
  };

  const handleDurationChange = useCallback((duration) => {
    updateFormData('duration', duration);
  }, []);

  const handleLocationChange = useCallback((location) => {
    updateFormData('location', location);
  }, []);

  const handleTimeOfDayChange = useCallback((timeOfDay) => {
    updateFormData('timeOfDay', timeOfDay);
  }, []);

  const handleAgeGroupChange = useCallback((ageGroup) => {
    updateFormData('ageGroup', ageGroup);
  }, []);

  const handleRespiratoryConditionChange = useCallback((condition) => {
    updateFormData('respiratoryCondition', condition);
  }, []);

  const handleMaskUsageChange = useCallback((mask) => {
    updateFormData('maskUsage', mask);
  }, []);

  const handleAllergyToggle = useCallback((allergy) => {
    setFormData(prev => {
      const currentAllergies = prev.allergies || [];
      const newAllergies = currentAllergies.includes(allergy)
        ? currentAllergies.filter(a => a !== allergy)
        : [...currentAllergies, allergy];
      const newData = { ...prev, allergies: newAllergies };
      debouncedSaveToSessionStorage(newData);
      return newData;
    });
  }, []);

  const handleSkinTypeChange = useCallback((skinType) => {
    updateFormData('skinType', skinType);
  }, []);

  const handleOtherConcernsChange = useCallback((concerns) => {
    updateFormData('otherConcerns', concerns);
  }, []);

  // Contact form handlers - no validation needed

  // No validation functions needed - form accepts any input

  // OTP functions - Mock implementation for demo
  const handleOTPRequest = async () => {
    setIsLoading(true);
    trackEvent('exposure_calc_preview_requested');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockRequestId = 'req_' + Math.random().toString(36).substr(2, 9);
      setRequestId(mockRequestId);
      setOtpCountdown(300); // 5 minutes
      setOtpSent(true);
      setShowOTPOverlay(true);
      setResendCountdown(30);
      
      // Mask contact info for display
      const contact = contactData.phone ? contactData.phone : contactData.email;
      const masked = contactData.phone 
        ? `+${contact.slice(1, 3)} ••••${contact.slice(-4)}`
        : `${contact.split('@')[0].slice(0, 2)}•••@${contact.split('@')[1]}`;
      setMaskedContact(masked);
      
      trackEvent('otp_sent', { 
        method: contactData.phone ? 'phone' : 'email',
        masked: masked
      });
      
      // Start countdown timers
      startCountdowns();
      
      console.log('Mock OTP sent successfully. In a real app, this would call the API.');
      
    } catch (error) {
      console.error('OTP request error:', error);
      // No error display - form accepts any input
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdowns = () => {
    // OTP expiry countdown
    const otpInterval = setInterval(() => {
      setOtpCountdown(prev => {
        if (prev <= 1) {
          clearInterval(otpInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Resend countdown
    const resendInterval = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(resendInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOTPChange = useCallback((index, value) => {
    console.log('OTP Change:', index, value); // Debug log
    // Only allow single digits
    if (!/^\d$/.test(value) && value !== '') return;
    
    setOtpValues(prev => {
      const newOtpValues = [...prev];
      newOtpValues[index] = value;
      console.log('New OTP values:', newOtpValues); // Debug log
      return newOtpValues;
    });
    
    // Auto-focus next input
    if (value && index < 5) {
      setTimeout(() => {
        otpInputRefs.current[index + 1]?.focus();
      }, 0);
    }
  }, []);

  const handleOTPPaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newOtpValues = [...otpValues];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtpValues[i] = pastedData[i];
      }
      setOtpValues(newOtpValues);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtpValues.findIndex((val, idx) => idx >= pastedData.length && !val);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(pastedData.length, 5);
      setTimeout(() => {
        otpInputRefs.current[focusIndex]?.focus();
      }, 0);
    }
  }, [otpValues]);

  const handleOTPKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      setTimeout(() => {
        otpInputRefs.current[index - 1]?.focus();
      }, 0);
    }
  }, [otpValues]);

  const handleOTPVerify = async () => {
    const otp = otpValues.join('');
    
    setIsLoading(true);
    setOtpAttempts(prev => prev + 1);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock verification - accept any 6-digit OTP
      const mockSessionToken = 'session_' + Math.random().toString(36).substr(2, 9);
      const mockResultId = 'result_' + Math.random().toString(36).substr(2, 9);
      
      // Store session token and result data
      sessionStorage.setItem('exposure_session_token', mockSessionToken);
      
      // Store comprehensive result data
      const resultData = {
        resultId: mockResultId,
        user: {
          name: contactData.name,
          phone: contactData.phone,
          email: contactData.email
        },
        inputs: formData,
        environment: {
          aqi: 142,
          pm25: 85,
          pm10: 120,
          no2: 42,
          o3: 28,
          co: 1.2,
          so2: 15,
          temperature: 32,
          humidity: 62,
          wind_kmh: 12,
          uvIndex: 8,
          pressure: 1013
        },
        riskScore: 78,
        riskCategory: 'High',
        primary_reason: 'PM2.5 concentration and duration of activity',
        healthEffects: {
          immediate: [
            'Eye irritation and watering',
            'Coughing and throat irritation',
            'Shortness of breath during physical activity',
            'Headache and fatigue'
          ],
          longTerm: [
            'Increased risk of respiratory infections',
            'Potential lung function decline',
            'Higher risk of cardiovascular issues',
            'Exacerbation of existing respiratory conditions'
          ]
        },
        recommendations: {
          immediate: [
            'Avoid intensive outdoor exercise today',
            'Use N95 mask if you must go outside',
            'Keep windows closed during afternoon dust peaks',
            'Stay indoors during peak pollution hours (2-6 PM)'
          ],
          protective: [
            'Wear N95 or KN95 mask for outdoor activities',
            'Use air purifiers indoors',
            'Keep windows closed and use AC',
            'Avoid outdoor activities near busy roads'
          ],
          health: [
            'Stay hydrated throughout the day',
            'Consider postponing outdoor exercise',
            'Monitor symptoms if you have respiratory conditions',
            'Use saline nasal spray to reduce irritation'
          ]
        },
        funFacts: [
          'PM2.5 particles are 30 times smaller than a human hair!',
          'Air pollution can travel up to 1000km from its source',
          'Indoor air can be 2-5 times more polluted than outdoor air',
          'Plants can reduce indoor air pollution by up to 87%'
        ],
        alternatives: [
          'Try indoor yoga or home workouts instead',
          'Visit air-conditioned malls or libraries',
          'Schedule outdoor activities for early morning',
          'Consider virtual social activities'
        ],
        confidence: 82,
        generatedAt: new Date().toISOString(),
        nextUpdate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours
      };
      
      sessionStorage.setItem('exposure_calc_result', JSON.stringify(resultData));
      
      trackEvent('otp_verify_success');
      trackEvent('results_displayed_on_landing');
      
      console.log('Mock OTP verification successful. In a real app, this would call the API.');
      
      // Show results on landing page instead of redirecting
      setResultData(resultData);
      setShowResults(true);
      setShowOTPOverlay(false);
      setShowContactOverlay(false);
      
    } catch (error) {
      console.error('OTP verification error:', error);
      trackEvent('otp_verify_failure');
      // No error display - form accepts any input
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0) return;
    
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock resend - just reset timers
      setOtpCountdown(300);
      setResendCountdown(30);
      setOtpValues(['', '', '', '', '', '']);
      startCountdowns();
      
      console.log('Mock OTP resent successfully. In a real app, this would call the API.');
      
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format time for countdown
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simple input components without local state to prevent focus loss
  const SimpleInput = ({ value, onChange, placeholder, className, type = "text", maxLength }) => {
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        maxLength={maxLength}
      />
    );
  };

  const SimpleTextarea = ({ value, onChange, placeholder, className, maxLength }) => {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        maxLength={maxLength}
      />
    );
  };

  // Step content components
  const Step1 = () => (
    <div className="step-content">
      <h2 className="step-title">What's your planned activity?</h2>
      <p className="step-description">We'll use this to assess your exposure risk level</p>
      
      <div className="activity-buttons">
        {[
          { id: 'outdoor_exercise', label: 'Outdoor exercise', icon: '🏃' },
          { id: 'commute', label: 'Commute', icon: '🚗' },
          { id: 'outdoor_work', label: 'Outdoor work', icon: '🔨' },
          { id: 'leisure', label: 'Leisure / Social', icon: '🎉' },
          { id: 'other', label: 'Other', icon: '📝' }
        ].map(activity => (
          <button
            key={activity.id}
            className={`activity-button ${formData.activity === activity.id ? 'selected' : ''}`}
            onClick={() => handleActivitySelect(activity.id)}
            aria-label={`Select ${activity.label}`}
          >
            <span className="activity-icon">{activity.icon}</span>
            <span className="activity-label">{activity.label}</span>
          </button>
        ))}
      </div>
      
      {formData.activity === 'other' && (
        <div className="other-input">
          <SimpleInput
            placeholder="Please specify your activity"
            value={formData.otherActivity || ''}
            onChange={(value) => {
              setFormData(prev => {
                const newData = { ...prev, otherActivity: value };
                debouncedSaveToSessionStorage(newData);
                return newData;
              });
            }}
            className="text-input"
          />
        </div>
      )}
      
      {/* Step Navigation Buttons */}
      <div className="step-buttons">
        <button
          className="step-button prev"
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{ display: currentStep === 1 ? 'none' : 'flex' }}
        >
          <ChevronLeft className="button-icon" />
          Previous
        </button>
        <button
          className="step-button next"
          onClick={nextStep}
          disabled={!formData.activity}
          style={{ display: currentStep === totalSteps ? 'none' : 'flex' }}
        >
          Next
          <ChevronRight className="button-icon" />
        </button>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="step-content">
      <h2 className="step-title">How long will you be outside?</h2>
      <p className="step-description">Duration affects your exposure level significantly</p>
      
      <div className="duration-slider-container">
        <div className="duration-display">
          <span className="duration-value">{formData.duration}</span>
          <span className="duration-unit">minutes</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="240"
          value={formData.duration}
          onChange={(e) => handleDurationChange(parseInt(e.target.value))}
          className="duration-slider"
        />
        
        <div className="duration-presets">
          {[15, 30, 60, 120, 240].map(preset => (
            <button
              key={preset}
              className={`preset-button ${formData.duration === preset ? 'selected' : ''}`}
              onClick={() => handleDurationChange(preset)}
            >
              {preset}m
            </button>
          ))}
        </div>
      </div>
      
      {/* Step Navigation Buttons */}
      <div className="step-buttons">
        <button
          className="step-button prev"
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{ display: currentStep === 1 ? 'none' : 'flex' }}
        >
          <ChevronLeft className="button-icon" />
          Previous
        </button>
        <button
          className="step-button next"
          onClick={nextStep}
          disabled={formData.duration === 0}
          style={{ display: currentStep === totalSteps ? 'none' : 'flex' }}
        >
          Next
          <ChevronRight className="button-icon" />
        </button>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="step-content">
      <h2 className="step-title">Where will you be?</h2>
      <p className="step-description">Location and time affect air quality conditions</p>
      
      <div className="location-section">
        <div className="input-group">
          <label className="input-label">
            <MapPin className="input-icon" />
            Location
          </label>
          <SimpleInput
            placeholder="Enter city or area"
            value={formData.location}
            onChange={(value) => {
              setFormData(prev => {
                const newData = { ...prev, location: value };
                debouncedSaveToSessionStorage(newData);
                return newData;
              });
            }}
            className="text-input"
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">
            <Clock className="input-icon" />
            Time of day
          </label>
          <select
            value={formData.timeOfDay}
            onChange={(e) => handleTimeOfDayChange(e.target.value)}
            className="select-input"
          >
            <option value="morning">Morning (6AM - 12PM)</option>
            <option value="afternoon">Afternoon (12PM - 6PM)</option>
            <option value="evening">Evening (6PM - 12AM)</option>
          </select>
        </div>
      </div>
      
      {/* Step Navigation Buttons */}
      <div className="step-buttons">
        <button
          className="step-button prev"
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{ display: currentStep === 1 ? 'none' : 'flex' }}
        >
          <ChevronLeft className="button-icon" />
          Previous
        </button>
        <button
          className="step-button next"
          onClick={nextStep}
          disabled={!formData.location.trim()}
          style={{ display: currentStep === totalSteps ? 'none' : 'flex' }}
        >
          Next
          <ChevronRight className="button-icon" />
        </button>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="step-content">
      <h2 className="step-title">Health & Protection Details</h2>
      <p className="step-description">Help us personalize your risk assessment</p>
      
      <div className="health-section">
        <div className="input-group">
          <label className="input-label">
            <User className="input-icon" />
            Age Group
          </label>
          <select
            value={formData.ageGroup}
            onChange={(e) => handleAgeGroupChange(e.target.value)}
            className="select-input"
          >
            <option value="">Select age group</option>
            <option value="under_12">Under 12</option>
            <option value="12_17">12-17</option>
            <option value="18_49">18-49</option>
            <option value="50_64">50-64</option>
            <option value="65_plus">65+</option>
          </select>
        </div>
        
        <div className="input-group">
          <label className="input-label">
            <AlertTriangle className="input-icon" />
            Respiratory Condition
          </label>
          <select
            value={formData.respiratoryCondition}
            onChange={(e) => handleRespiratoryConditionChange(e.target.value)}
            className="select-input"
          >
            <option value="none">None</option>
            <option value="asthma">Asthma</option>
            <option value="copd">COPD</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="input-group">
          <label className="input-label">
            <Shield className="input-icon" />
            Mask Usage
          </label>
          <div className="radio-group">
            {[
              { value: 'none', label: 'No mask' },
              { value: 'surgical', label: 'Surgical' },
              { value: 'n95', label: 'N95' }
            ].map(option => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="maskUsage"
                  value={option.value}
                  checked={formData.maskUsage === option.value}
                  onChange={(e) => handleMaskUsageChange(e.target.value)}
                />
                <span className="radio-label">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="input-group">
          <label className="input-label">Allergies</label>
          <div className="checkbox-group">
            {['dust', 'pollen', 'none'].map(allergy => (
              <label key={allergy} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={formData.allergies.includes(allergy)}
                  onChange={() => handleAllergyToggle(allergy)}
                />
                <span className="checkbox-label">{allergy.charAt(0).toUpperCase() + allergy.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Step Navigation Buttons */}
      <div className="step-buttons">
        <button
          className="step-button prev"
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{ display: currentStep === 1 ? 'none' : 'flex' }}
        >
          <ChevronLeft className="button-icon" />
          Previous
        </button>
        <button
          className="step-button next"
          onClick={nextStep}
          disabled={!formData.ageGroup}
          style={{ display: currentStep === totalSteps ? 'none' : 'flex' }}
        >
          Next
          <ChevronRight className="button-icon" />
        </button>
      </div>
    </div>
  );

  const Step5 = () => (
    <div className="step-content">
      <h2 className="step-title">Additional Information</h2>
      <p className="step-description">Optional details to improve your assessment</p>
      
      <div className="additional-section">
        <div className="input-group">
          <label className="input-label">Skin Type</label>
          <select
            value={formData.skinType}
            onChange={(e) => handleSkinTypeChange(e.target.value)}
            className="select-input"
          >
            <option value="normal">Normal</option>
            <option value="dry">Dry</option>
            <option value="sensitive">Sensitive</option>
          </select>
        </div>
        
        <div className="input-group">
          <label className="input-label">Any other concerns?</label>
          <SimpleTextarea
            placeholder="Share any specific health concerns or questions (140 characters max)"
            value={formData.otherConcerns}
            onChange={(value) => {
              setFormData(prev => {
                const newData = { ...prev, otherConcerns: value };
                debouncedSaveToSessionStorage(newData);
                return newData;
              });
            }}
            maxLength={140}
            className="textarea-input"
          />
          <div className="char-count">
            {formData.otherConcerns.length}/140
          </div>
        </div>
      </div>
      
      {/* Step Navigation Buttons */}
      <div className="step-buttons">
        <button
          className="step-button prev"
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{ display: currentStep === 1 ? 'none' : 'flex' }}
        >
          <ChevronLeft className="button-icon" />
          Previous
        </button>
        <button
          className="preview-button"
          onClick={() => setShowContactOverlay(true)}
          disabled={!formData.activity || !formData.ageGroup}
        >
          <span>Preview Result</span>
          <ArrowRight className="button-icon" />
        </button>
      </div>
    </div>
  );

  // Simple contact input component
  const SimpleContactInput = ({ value, onChange, placeholder, className, type = "text" }) => {
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    );
  };

  const ContactOverlay = () => (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-header">
          <h3>Verify to View Your Results</h3>
          <button
            className="close-button"
            onClick={() => setShowContactOverlay(false)}
            aria-label="Close"
          >
            <XCircle />
          </button>
        </div>
        
        <div className="contact-form">
          <div className="privacy-note">
            <p>
              We will send a one-time code to verify contact. We keep your details for 30 days to deliver results; 
              you can request deletion anytime. <a href="/privacy" target="_blank">See Privacy</a>.
            </p>
          </div>
          
          <div className="form-group">
            <label className="form-label">Name *</label>
            <SimpleContactInput
              type="text"
              value={contactData.name}
              onChange={(value) => {
                setContactData(prev => ({ ...prev, name: value }));
              }}
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone</label>
            <SimpleContactInput
              type="tel"
              value={contactData.phone}
              onChange={(value) => {
                setContactData(prev => ({ ...prev, phone: value }));
              }}
              className="form-input"
              placeholder="+968 XXXX XXXX"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <SimpleContactInput
              type="email"
              value={contactData.email}
              onChange={(value) => {
                setContactData(prev => ({ ...prev, email: value }));
              }}
              className="form-input"
              placeholder="your@email.com"
            />
          </div>
          
          <button
            className="submit-button"
            onClick={handleOTPRequest}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="spinner" />
                Sending...
              </>
            ) : (
              <>
                <Phone className="button-icon" />
                Send OTP & View Results
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const OTPOverlay = () => (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-header">
          <h3>Enter Verification Code</h3>
          <button
            className="close-button"
            onClick={() => setShowOTPOverlay(false)}
            aria-label="Close"
          >
            <XCircle />
          </button>
        </div>
        
        <div className="otp-form">
          <div className="otp-sent-message">
            <CheckCircle className="success-icon" />
            <p>OTP sent to {maskedContact} — check SMS or email.</p>
          </div>
          
          <div className="otp-inputs">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={`otp-${index}`}
                ref={el => otpInputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength="1"
                value={otpValues[index] || ''}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleOTPKeyDown(index, e)}
                onPaste={handleOTPPaste}
                className="otp-input"
                aria-label={`Digit ${index + 1}`}
                autoComplete="one-time-code"
                placeholder="0"
              />
            ))}
          </div>
          
          
          <div className="otp-actions">
            <div className="countdown-info">
              <Clock className="countdown-icon" />
              <span>Code expires in {formatTime(otpCountdown)}</span>
            </div>
            
            <button
              className="resend-button"
              onClick={handleResendOTP}
              disabled={resendCountdown > 0 || isLoading}
            >
              {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
            </button>
          </div>
          
          <button
            className="verify-button"
            onClick={handleOTPVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="spinner" />
                Verifying...
              </>
            ) : (
              'Verify & View Results'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Helper functions for results display
  const getRiskColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    }
  };

  const getRiskIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'low': return <CheckCircle className="w-6 h-6" />;
      case 'moderate': return <AlertTriangle className="w-6 h-6" />;
      case 'high': return <AlertTriangle className="w-6 h-6" />;
      default: return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const handleRecalculate = () => {
    setShowResults(false);
    setResultData(null);
    setCurrentStep(1);
    setFormData({
      activity: '',
      duration: 30,
      location: selectedLocation || '',
      timeOfDay: 'morning',
      ageGroup: '',
      respiratoryCondition: 'none',
      maskUsage: 'none',
      allergies: [],
      skinType: 'normal',
      otherConcerns: ''
    });
    setContactData({
      name: '',
      phone: '',
      email: ''
    });
    sessionStorage.removeItem('exposure_calc_input');
    sessionStorage.removeItem('exposure_calc_result');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Air Quality Exposure Risk Assessment',
        text: `My exposure risk is ${resultData.riskCategory} (${resultData.riskScore}/100). Check your risk at AQI Dashboard!`,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`My exposure risk is ${resultData.riskCategory} (${resultData.riskScore}/100). Check your risk at AQI Dashboard! ${window.location.href}`);
      alert('Results copied to clipboard!');
    }
  };

  const DetailedResults = () => {
    if (!resultData) return null;

    return (
      <div className="detailed-results">
        <div className="results-header">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Exposure Risk Assessment</h2>
              <p className="text-gray-600">Personalized analysis for {resultData.user.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={handleRecalculate}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Recalculate
              </button>
            </div>
          </div>

          {/* Risk Summary */}
          <div className={`risk-summary p-6 rounded-2xl border-2 mb-8 ${getRiskColor(resultData.riskCategory)}`}>
            <div className="flex items-center gap-4 mb-4">
              {getRiskIcon(resultData.riskCategory)}
              <div>
                <h3 className="text-2xl font-bold">{resultData.riskCategory} Risk</h3>
                <p className="text-lg">Risk Score: {resultData.riskScore}/100</p>
              </div>
            </div>
            <p className="text-lg font-medium">Primary concern: {resultData.primary_reason}</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Generated: {new Date(resultData.generatedAt).toLocaleString()}</span>
              <span className="mx-2">•</span>
              <span>Confidence: {resultData.confidence}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Environment Data */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Current Air Quality
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">AQI</p>
                      <p className="text-lg font-bold">{resultData.environment.aqi}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">PM2.5</p>
                      <p className="text-lg font-bold">{resultData.environment.pm25} μg/m³</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Wind className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">PM10</p>
                      <p className="text-lg font-bold">{resultData.environment.pm10} μg/m³</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">NO₂</p>
                      <p className="text-lg font-bold">{resultData.environment.no2} μg/m³</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Conditions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Weather Conditions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="text-lg font-bold">{resultData.environment.temperature}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Humidity</p>
                      <p className="text-lg font-bold">{resultData.environment.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wind className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Wind Speed</p>
                      <p className="text-lg font-bold">{resultData.environment.wind_kmh} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600">UV Index</p>
                      <p className="text-lg font-bold">{resultData.environment.uvIndex}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Effects */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Potential Health Effects
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Immediate Effects</h4>
                    <ul className="space-y-1">
                      {resultData.healthEffects.immediate.map((effect, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">Long-term Risks</h4>
                    <ul className="space-y-1">
                      {resultData.healthEffects.longTerm.map((effect, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Recommendations */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Recommendations
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Immediate Actions</h4>
                    <ul className="space-y-2">
                      {resultData.recommendations.immediate.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Protective Measures</h4>
                    <ul className="space-y-2">
                      {resultData.recommendations.protective.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Health Tips</h4>
                    <ul className="space-y-2">
                      {resultData.recommendations.health.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Heart className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Alternative Activities */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Alternative Activities
                </h3>
                <ul className="space-y-2">
                  {resultData.alternatives.map((alt, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fun Facts */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Did You Know?
                </h3>
                <ul className="space-y-3">
                  {resultData.funFacts.map((fact, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Info className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Your Inputs Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Activity Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activity:</span>
                    <span className="font-medium">{resultData.inputs.activity.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{resultData.inputs.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{resultData.inputs.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{resultData.inputs.timeOfDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age Group:</span>
                    <span className="font-medium">{resultData.inputs.ageGroup.replace('_', '-')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mask Usage:</span>
                    <span className="font-medium">{resultData.inputs.maskUsage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      case 5: return <Step5 />;
      default: return <Step1 />;
    }
  };

  return (
    <div className={`exposure-calculator ${isRTL ? 'rtl' : 'ltr'}`}>
      {showResults ? (
        <DetailedResults />
      ) : (
        <>
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <div className="progress-text">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {/* Calculator Card */}
          <div className="calculator-card">
            {/* Step Navigation */}
            <div className="step-navigation">
              <div className="step-indicators">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
                  <button
                    key={step}
                    className={`step-indicator ${currentStep === step ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
                    onClick={() => goToStep(step)}
                    aria-label={`Go to step ${step}`}
                  >
                    {step < currentStep ? <CheckCircle /> : step}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="step-container">
              {renderStep()}
            </div>
          </div>

          {/* Contact Overlay */}
          {showContactOverlay && <ContactOverlay />}
          
          {/* OTP Overlay */}
          {showOTPOverlay && <OTPOverlay />}
        </>
      )}
    </div>
  );
};

export default ExposureRiskCalculator;
