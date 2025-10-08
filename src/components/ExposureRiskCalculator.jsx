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
  Loader2
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
    if (otp.length !== 6) return;
    
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
      
      // Store result data
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
          temperature: 32,
          humidity: 62,
          wind_kmh: 12
        },
        riskScore: 78,
        riskCategory: 'High',
        primary_reason: 'PM2.5 concentration and duration of activity',
        recommendations: [
          'Avoid intensive outdoor exercise today',
          'Use N95 mask if you must go outside',
          'Keep windows closed during afternoon dust peaks'
        ],
        confidence: 82,
        generatedAt: new Date().toISOString()
      };
      
      sessionStorage.setItem('exposure_calc_result', JSON.stringify(resultData));
      
      trackEvent('otp_verify_success');
      trackEvent('redirect_to_dashboard');
      
      console.log('Mock OTP verification successful. In a real app, this would call the API.');
      
      // Show success message briefly then redirect directly to dashboard
      setTimeout(() => {
        // Use onDirectLogin if available, otherwise fall back to onRedirectToDashboard
        if (onDirectLogin) {
          onDirectLogin({
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            fromExposureCalc: true,
            resultId: mockResultId
          });
        } else {
          onRedirectToDashboard(mockResultId);
        }
      }, 1500);
      
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

  // Stable input component to prevent focus loss
  const StableInput = ({ value, onChange, placeholder, className, type = "text", maxLength }) => {
    const [localValue, setLocalValue] = useState(value);
    
    useEffect(() => {
      setLocalValue(value);
    }, [value]);
    
    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange(newValue);
    };
    
    return (
      <input
        type={type}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        maxLength={maxLength}
      />
    );
  };

  const StableTextarea = ({ value, onChange, placeholder, className, maxLength }) => {
    const [localValue, setLocalValue] = useState(value);
    
    useEffect(() => {
      setLocalValue(value);
    }, [value]);
    
    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange(newValue);
    };
    
    return (
      <textarea
        value={localValue}
        onChange={handleChange}
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
          <StableInput
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
          <StableInput
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
          <StableTextarea
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

  // Stable contact input component
  const StableContactInput = ({ value, onChange, placeholder, className, type = "text" }) => {
    const [localValue, setLocalValue] = useState(value);
    
    useEffect(() => {
      setLocalValue(value);
    }, [value]);
    
    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange(newValue);
    };
    
    return (
      <input
        type={type}
        value={localValue}
        onChange={handleChange}
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
            <StableContactInput
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
            <StableContactInput
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
            <StableContactInput
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
            {otpValues.map((value, index) => (
              <input
                key={index}
                ref={el => otpInputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength="1"
                value={value}
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
            disabled={otpValues.join('').length !== 6 || isLoading}
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
    </div>
  );
};

export default ExposureRiskCalculator;
