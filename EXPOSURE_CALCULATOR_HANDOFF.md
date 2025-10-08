# Exposure Risk Calculator - Technical Handoff

## Overview
A comprehensive, step-by-step Exposure Risk Calculator embedded as a dedicated section on the landing page. The calculator provides personalized air quality risk assessments based on user activity, health profile, and environmental conditions.

## Features Implemented

### ✅ Core Functionality
- **5-Step Interactive Flow**: Activity → Duration → Location → Health → Additional Info
- **Progress Tracking**: Visual progress bar and step indicators
- **Contact Capture**: Name, phone, email validation with privacy notice
- **OTP Verification**: 6-digit code with countdown timers and resend logic
- **Session Management**: Data persistence and secure token handling
- **RTL Support**: Full Arabic language support with proper text direction
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### ✅ User Experience
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Visual Integration**: Matches existing design system (Poppins font, rounded cards, pastel accents)
- **Smooth Animations**: Transitions and hover effects throughout
- **Error Handling**: Comprehensive validation and user feedback
- **Loading States**: Spinners and disabled states during API calls

## File Structure

```
src/components/
├── ExposureRiskCalculator.jsx    # Main calculator component
├── ExposureRiskCalculator.css    # Styled with CSS modules (no Tailwind)
└── LandingPage.jsx              # Updated to include calculator
```

## Component Architecture

### ExposureRiskCalculator.jsx
- **State Management**: Local React state with sessionStorage persistence
- **Step Navigation**: Controlled step progression with validation
- **Form Handling**: Controlled inputs with real-time validation
- **API Integration**: OTP request/verify endpoints with error handling
- **Analytics**: Event tracking for user interactions

### Key State Variables
```javascript
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({...});
const [contactData, setContactData] = useState({...});
const [showContactOverlay, setShowContactOverlay] = useState(false);
const [showOTPOverlay, setShowOTPOverlay] = useState(false);
```

## API Contract

### 1. OTP Request
```http
POST /api/otp/request
Content-Type: application/json

{
  "name": "string",
  "phone": "string (optional)",
  "email": "string (optional)",
  "context": "exposure_calc",
  "locale": "en" | "ar"
}

Response 201:
{
  "requestId": "uuid",
  "expiresIn": 300
}
```

### 2. OTP Verification
```http
POST /api/otp/verify
Content-Type: application/json

{
  "requestId": "uuid",
  "otp": "123456"
}

Response 200:
{
  "sessionToken": "jwt_or_uuid",
  "resultId": "optional_id",
  "redirectUrl": "/dashboard?from=exposure_calc&rid=optional_id"
}
```

### 3. Exposure Result (if resultId provided)
```http
GET /api/exposure/result/:resultId
Authorization: Bearer <sessionToken>

Response 200:
{
  "resultId": "abc123",
  "user": {
    "name": "Priyanshu",
    "phone": "+968XXXXXXXX",
    "email": "p@example.com"
  },
  "inputs": {
    "activity": "Outdoor exercise",
    "duration_min": 45,
    "location": "Muscat",
    "age_group": "18-49",
    "respiratory_condition": "Asthma",
    "mask": "N95",
    "allergies": ["Dust"]
  },
  "environment": {
    "aqi": 142,
    "pm25": 85,
    "pm10": 120,
    "no2": 42,
    "temperature": 32,
    "humidity": 62,
    "wind_kmh": 12
  },
  "riskScore": 78,
  "riskCategory": "High",
  "primary_reason": "PM2.5 concentration and duration of activity",
  "recommendations": [
    "Avoid intensive outdoor exercise today",
    "Use N95 mask if you must go outside",
    "Keep windows closed during afternoon dust peaks"
  ],
  "confidence": 82,
  "generatedAt": "2025-10-07T09:20:00Z"
}
```

## Security & Validation

### Client-Side Validation
- **Phone Format**: International format validation (`/^\+?[1-9]\d{1,14}$/`)
- **Email Format**: Standard email regex validation
- **Required Fields**: Name required, phone OR email required
- **OTP Format**: 6-digit numeric validation
- **Character Limits**: 140 characters for "other concerns"

### Rate Limiting
- **OTP Requests**: Maximum 3 per hour per phone/email
- **OTP Attempts**: Maximum 3 attempts per requestId
- **Resend Cooldown**: 30 seconds between resend attempts
- **OTP Expiry**: 5 minutes default

### Data Storage
- **SessionStorage**: Form data and results stored locally
- **Retention**: 30 days default (configurable)
- **Encryption**: Data encrypted at rest and in transit
- **PII Handling**: Minimal data collection, secure storage

## Analytics Events

```javascript
// Tracked Events
'exposure_calc_started'           // User begins calculator
'exposure_calc_step_completed'    // Each step completion
'exposure_calc_preview_requested' // Contact form submission
'otp_sent'                        // OTP successfully sent
'otp_verify_success'              // OTP verification success
'otp_verify_failure'              // OTP verification failure
'redirect_to_dashboard'           // Successful redirect to dashboard
```

## Styling Approach

### CSS Modules (No Tailwind)
- **Custom CSS**: All styles in `ExposureRiskCalculator.css`
- **Design System**: Matches existing Poppins font, 16px rounded cards
- **Color Palette**: Light pastel accents, consistent with landing page
- **Responsive**: Mobile-first with desktop enhancements
- **RTL Support**: Complete Arabic language support

### Key CSS Classes
```css
.exposure-calculator          # Main container
.calculator-card             # Rounded card with backdrop blur
.step-navigation             # Progress and navigation controls
.step-content                # Individual step content
.activity-buttons            # Large activity selection buttons
.duration-slider-container   # Duration input with presets
.overlay                     # Modal overlays for contact/OTP
.otp-inputs                  # 6-digit OTP input grid
```

## Integration Points

### Landing Page Integration
```jsx
// In LandingPage.jsx
import ExposureRiskCalculator from './ExposureRiskCalculator';

// Replace existing calculator section with:
<ExposureRiskCalculator onRedirectToDashboard={onLogin} />
```

### Dashboard Integration
The calculator redirects to dashboard with query parameters:
```javascript
// Redirect URL format
/dashboard?from=exposure_calc&rid=<resultId>

// Dashboard should check for:
const urlParams = new URLSearchParams(window.location.search);
const fromCalc = urlParams.get('from') === 'exposure_calc';
const resultId = urlParams.get('rid');

// Load result data from:
const resultData = JSON.parse(sessionStorage.getItem('exposure_calc_result'));
```

## Error Handling

### Common Error States
- **Invalid Phone**: "Invalid phone number format"
- **Invalid Email**: "Invalid email format"
- **OTP Expired**: "OTP expired — request a new code"
- **Too Many Attempts**: "Too many attempts — try again in 30 minutes"
- **Network Error**: "Failed to send verification code. Please try again."

### Fallback Options
- **Email Alternative**: "Try email" button on phone failures
- **Support Contact**: "Contact us" link for persistent issues
- **Data Recovery**: SessionStorage persistence prevents data loss

## Accessibility Features

### ARIA Labels
- All interactive elements have descriptive labels
- Step navigation includes current step announcements
- Form validation provides clear error messages

### Keyboard Navigation
- Tab order follows logical flow
- Enter key advances through steps
- Escape key closes overlays
- Arrow keys navigate step indicators

### Screen Reader Support
- Semantic HTML structure
- Live regions for dynamic content updates
- Descriptive text for all visual elements

## Mobile Optimization

### Touch-Friendly Design
- Large tap targets (minimum 44px)
- Swipe gestures for step navigation
- Optimized input sizes for mobile keyboards

### Responsive Breakpoints
- **Mobile**: < 768px - Single column, stacked layout
- **Tablet**: 768px - 1024px - Two column grid
- **Desktop**: > 1024px - Full feature layout

## Performance Considerations

### Code Splitting
- Calculator component can be lazy loaded
- CSS is scoped to prevent conflicts
- Minimal external dependencies

### Data Persistence
- Form data saved to sessionStorage on each step
- Graceful handling of page refresh
- Automatic cleanup after successful completion

## Testing Recommendations

### Unit Tests
- Form validation functions
- Step navigation logic
- OTP input handling
- Data persistence

### Integration Tests
- API endpoint integration
- Error handling scenarios
- RTL language support
- Mobile responsiveness

### User Testing
- Complete user flow testing
- Accessibility testing with screen readers
- Cross-browser compatibility
- Performance testing

## Deployment Notes

### Environment Variables
```bash
# Required for production
REACT_APP_API_BASE_URL=https://api.ea.gov.om
REACT_APP_ANALYTICS_ID=your_analytics_id
```

### Build Configuration
- Ensure CSS modules are properly configured
- Verify RTL support in build process
- Test mobile responsiveness across devices

## Future Enhancements

### Potential Improvements
- **Location Autocomplete**: Integrate with mapping API
- **Health History**: Store user health profiles
- **Push Notifications**: Alert users of high-risk conditions
- **Multi-language**: Support for additional languages
- **Offline Support**: PWA capabilities for offline use

### Analytics Enhancements
- **Conversion Funnels**: Track drop-off points
- **A/B Testing**: Test different UI variations
- **Performance Metrics**: Load times and user engagement

## Support & Maintenance

### Monitoring
- Track OTP success/failure rates
- Monitor API response times
- User feedback collection

### Updates
- Regular security updates for OTP system
- UI/UX improvements based on user feedback
- Performance optimizations

---

**Created**: 2024-01-15  
**Version**: 1.0.0  
**Status**: Ready for Production  
**Dependencies**: React 18+, Lucide React Icons
