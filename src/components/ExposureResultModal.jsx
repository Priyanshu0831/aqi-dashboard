import React, { useState, useEffect } from 'react';
import { 
  XCircle, 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  Clock, 
  MapPin,
  TrendingUp,
  Download,
  Share2
} from 'lucide-react';
import './ExposureResultModal.css';

const ExposureResultModal = ({ isOpen, onClose, resultData }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const getRiskColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'moderate': return 'risk-moderate';
      case 'high': return 'risk-high';
      default: return 'risk-moderate';
    }
  };

  const getRiskIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'low': return <CheckCircle className="risk-icon" />;
      case 'moderate': return <AlertTriangle className="risk-icon" />;
      case 'high': return <AlertTriangle className="risk-icon" />;
      default: return <AlertTriangle className="risk-icon" />;
    }
  };

  return (
    <div className={`exposure-result-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <div className="modal-header">
          <h2>Your Exposure Risk Assessment</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <XCircle />
          </button>
        </div>

        <div className="modal-body">
          {resultData ? (
            <>
              {/* Risk Summary */}
              <div className="risk-summary">
                <div className={`risk-badge ${getRiskColor(resultData.riskCategory)}`}>
                  {getRiskIcon(resultData.riskCategory)}
                  <div className="risk-info">
                    <div className="risk-category">{resultData.riskCategory} Risk</div>
                    <div className="risk-score">Score: {resultData.riskScore}/100</div>
                  </div>
                </div>
                <div className="risk-reason">
                  <strong>Primary concern:</strong> {resultData.primary_reason}
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="environment-section">
                <h3>Current Environmental Conditions</h3>
                <div className="environment-grid">
                  <div className="env-item">
                    <div className="env-label">Air Quality Index</div>
                    <div className="env-value aqi">{resultData.environment?.aqi}</div>
                  </div>
                  <div className="env-item">
                    <div className="env-label">PM2.5</div>
                    <div className="env-value">{resultData.environment?.pm25} μg/m³</div>
                  </div>
                  <div className="env-item">
                    <div className="env-label">PM10</div>
                    <div className="env-value">{resultData.environment?.pm10} μg/m³</div>
                  </div>
                  <div className="env-item">
                    <div className="env-label">Temperature</div>
                    <div className="env-value">{resultData.environment?.temperature}°C</div>
                  </div>
                  <div className="env-item">
                    <div className="env-label">Humidity</div>
                    <div className="env-value">{resultData.environment?.humidity}%</div>
                  </div>
                  <div className="env-item">
                    <div className="env-label">Wind Speed</div>
                    <div className="env-value">{resultData.environment?.wind_kmh} km/h</div>
                  </div>
                </div>
              </div>

              {/* User Inputs Summary */}
              <div className="inputs-section">
                <h3>Your Activity Profile</h3>
                <div className="inputs-grid">
                  <div className="input-item">
                    <Shield className="input-icon" />
                    <div className="input-details">
                      <div className="input-label">Activity</div>
                      <div className="input-value">{resultData.inputs?.activity}</div>
                    </div>
                  </div>
                  <div className="input-item">
                    <Clock className="input-icon" />
                    <div className="input-details">
                      <div className="input-label">Duration</div>
                      <div className="input-value">{resultData.inputs?.duration_min} minutes</div>
                    </div>
                  </div>
                  <div className="input-item">
                    <MapPin className="input-icon" />
                    <div className="input-details">
                      <div className="input-label">Location</div>
                      <div className="input-value">{resultData.inputs?.location}</div>
                    </div>
                  </div>
                  <div className="input-item">
                    <TrendingUp className="input-icon" />
                    <div className="input-details">
                      <div className="input-label">Age Group</div>
                      <div className="input-value">{resultData.inputs?.age_group}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="recommendations-section">
                <h3>Personalized Recommendations</h3>
                <div className="recommendations-list">
                  {resultData.recommendations?.map((rec, index) => (
                    <div key={index} className="recommendation-item">
                      <CheckCircle className="rec-icon" />
                      <span className="rec-text">{rec}</span>
                    </div>
                  ))}
                </div>
                <div className="confidence-level">
                  <div className="confidence-label">Assessment Confidence</div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${resultData.confidence}%` }}
                    />
                  </div>
                  <div className="confidence-value">{resultData.confidence}%</div>
                </div>
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button className="action-button primary">
                  <Download className="button-icon" />
                  Download Report
                </button>
                <button className="action-button secondary">
                  <Share2 className="button-icon" />
                  Share Results
                </button>
              </div>
            </>
          ) : (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading your personalized results...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExposureResultModal;
