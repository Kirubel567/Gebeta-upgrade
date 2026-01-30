import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './CompleteProfile.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  // Get user data from registration
  const { email, name } = location.state || {};
  
  const [formData, setFormData] = useState({
    university: '',
    dormitory: '',
    yearOfStudy: '',
    description: '',
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [dormitories, setDormitories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AAU Campus options
  const universityOptions = [
    'Main Campus - 6kilo',
    'CTBE - 5kilo',
    'CNCS - 4kilo',
    'FBE - 6kilo',
    'SSC - Sefere Selam',
    'CTBE - Lideta'
  ];

  // Dormitory options for each AAU campus
  const dormitoryOptions = {
    'Main Campus - 6kilo': [
      'Block A (Ras Desta)',
      'Block B (Ras Mekonnen)', 
      'Block C (Sidist Kilo)',
      'Block E (6 Kilo)',
      'Graduate Housing',
      'Off-Campus (6kilo area)'
    ],
    'CTBE - 5kilo': [
      'Block D (5 Kilo)',
      'Graduate Housing',
      'Off-Campus (5kilo area)'
    ],
    'CNCS - 4kilo': [
      'Off-Campus (4kilo area)',
      'Nearby Housing'
    ],
    'FBE - 6kilo': [
      'Block A (Ras Desta)',
      'Block B (Ras Mekonnen)',
      'Block C (Sidist Kilo)',
      'Block E (6 Kilo)',
      'Graduate Housing',
      'Off-Campus (6kilo area)'
    ],
    'SSC - Sefere Selam': [
      'On-Campus Housing',
      'Off-Campus (Sefere Selam area)'
    ],
    'CTBE - Lideta': [
      'On-Campus Housing',
      'Off-Campus (Lideta area)'
    ]
  };

  // Year options
  const yearOptions = [
    '1st Year',
    '2nd Year', 
    '3rd Year',
    '4th Year',
    '5th Year',
    'Graduate Student',
    'PhD Candidate'
  ];

  useEffect(() => {
    // Set dormitories based on selected university
    if (formData.university) {
      setDormitories(dormitoryOptions[formData.university] || []);
    }
  }, [formData.university]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, profileImage: 'Please upload a valid image (JPEG, PNG, GIF, WebP)' }));
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profileImage: 'Image size should be less than 5MB' }));
      return;
    }

    setProfileImage(file);
    setErrors(prev => ({ ...prev, profileImage: '' }));

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.university) {
      newErrors.university = 'Please select your campus';
    }
    
    if (!formData.dormitory) {
      newErrors.dormitory = 'Please select your dormitory';
    }
    
    if (!formData.yearOfStudy) {
      newErrors.yearOfStudy = 'Please select your year of study';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please write a brief description';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Extract campus name without location
      const campusName = formData.university.split(' - ')[0];
      
      // Prepare updated user data
      let updatedUser = {
        ...currentUser,
        university: 'AAU',
        campus: campusName,
        dormitory: formData.dormitory,
        yearOfStudy: formData.yearOfStudy,
        bio: formData.description,
        profileCompleted: true
      };
      
      // If profile image uploaded, store it (in real app you'd upload to server)
      if (profileImagePreview) {
        updatedUser = {
          ...updatedUser,
          avatar: profileImagePreview,
          hasCustomAvatar: true
        };
      }
      
      // Try to update via API first
      try {
        if (currentUser.id && !currentUser.id.startsWith('google')) {
          const response = await fetch(`http://localhost:5000/users/${currentUser.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser)
          });
          
          if (response.ok) {
            const apiUser = await response.json();
            localStorage.setItem('user', JSON.stringify(apiUser));
          }
        }
      } catch (apiError) {
        console.log('API update failed, updating localStorage only');
      }
      
      // Always update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Also update in mockUsers if exists
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      if (mockUsers.length > 0) {
        const updatedMockUsers = mockUsers.map(user => 
          user.id === currentUser.id ? updatedUser : user
        );
        localStorage.setItem('mockUsers', JSON.stringify(updatedMockUsers));
      }
      
      // Navigate to home
      navigate('/', { replace: true });
      
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        general: 'Failed to save profile. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipForNow = () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...currentUser,
      profileCompleted: false
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    navigate('/');
  };

  return (
    <div className="complete-profile-page">
      <div className="profile-container">
        {/* Left Side: Hero Image */}
        <div className="profile-hero">
          <div className="hero-image">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <span className="hero-tag">Almost There!</span>
              <h2 className="hero-title">
                Complete Your <span className="hero-highlight">Profile</span>
              </h2>
              <p className="hero-description">
                Help us personalize your AAU campus food experience by telling us more about yourself.
                Get better recommendations and connect with fellow students!
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="profile-form-side">
          <div className="profile-form-container">
            {/* Header */}
            <div className="profile-header">
              <Link to="/" className="logo-link">
                <h1 className="logo-text">Gebeta</h1>
              </Link>
              <p className="profile-subtitle">The AAU Campus Food Guide</p>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
              <div className="progress-step">
                <div className="step-number">1</div>
                <div className="step-label">Register</div>
              </div>
              <div className="progress-line active"></div>
              <div className="progress-step active">
                <div className="step-number">2</div>
                <div className="step-label">Complete Profile</div>
              </div>
            </div>

            {/* Form Card */}
            <div className="profile-card">
              <div className="profile-header-section">
                <h2 className="profile-title">Complete Your Profile</h2>
                <p className="profile-description">
                  Tell us more about yourself to personalize your AAU campus food experience!
                </p>
                {errors.general && (
                  <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                    {errors.general}
                  </div>
                )}
              </div>

              <form className="profile-form" onSubmit={handleSubmit}>
                {/* Profile Image Upload */}
                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Profile Picture</span>
                    <span className="optional">(Optional)</span>
                  </label>
                  
                  <div className="image-upload-container">
                    <div className="image-preview-wrapper">
                      <div 
                        className={`image-preview ${profileImagePreview ? 'has-image' : ''}`}
                        onClick={triggerFileInput}
                      >
                        {profileImagePreview ? (
                          <img 
                            src={profileImagePreview} 
                            alt="Profile preview" 
                            className="preview-image"
                          />
                        ) : (
                          <div className="upload-placeholder">
                            <svg className="upload-icon" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                            </svg>
                            <span className="upload-text">Upload Photo</span>
                          </div>
                        )}
                      </div>
                      
                      {profileImagePreview && (
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={handleRemoveImage}
                          aria-label="Remove image"
                        >
                          <svg className="remove-icon" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      className="file-input"
                      id="profileImage"
                    />
                    
                    <div className="image-upload-info">
                      <button
                        type="button"
                        className="upload-btn"
                        onClick={triggerFileInput}
                      >
                        {profileImagePreview ? 'Change Photo' : 'Choose Photo'}
                      </button>
                      <p className="image-hint">
                        JPG, PNG, GIF or WebP. Max 5MB
                      </p>
                    </div>
                  </div>
                  
                  {errors.profileImage && (
                    <span className="error-text">{errors.profileImage}</span>
                  )}
                </div>

                {/* Campus Selection */}
                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">AAU Campus</span>
                    <span className="required">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      className={`form-select ${errors.university ? 'error' : ''}`}
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select your AAU campus</option>
                      {universityOptions.map((campus) => (
                        <option key={campus} value={campus}>
                          {campus}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">▼</div>
                  </div>
                  {errors.university && <span className="error-text">{errors.university}</span>}
                </div>

                {/* Dormitory Selection */}
                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Dormitory / Living Arrangement</span>
                    <span className="required">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      className={`form-select ${errors.dormitory ? 'error' : ''}`}
                      name="dormitory"
                      value={formData.dormitory}
                      onChange={handleChange}
                      disabled={isSubmitting || !formData.university}
                    >
                      <option value="">Select your dormitory</option>
                      {dormitories.map((dorm) => (
                        <option key={dorm} value={dorm}>
                          {dorm}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">▼</div>
                  </div>
                  {errors.dormitory && <span className="error-text">{errors.dormitory}</span>}
                  {!formData.university && (
                    <div className="form-hint">Select a campus first</div>
                  )}
                </div>

                {/* Year of Study */}
                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Year of Study</span>
                    <span className="required">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      className={`form-select ${errors.yearOfStudy ? 'error' : ''}`}
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select your year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">▼</div>
                  </div>
                  {errors.yearOfStudy && <span className="error-text">{errors.yearOfStudy}</span>}
                </div>

                {/* Description/Bio */}
                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Tell us about yourself</span>
                    <span className="required">*</span>
                  </label>
                  <div className="textarea-wrapper">
                    <textarea
                      className={`form-textarea hide-textarea-scrollbar ${errors.description ? 'error' : ''}`}
                      placeholder="Example: I'm a Computer Science student at AAU CNCS Campus, love trying new food spots around 4kilo, and always looking for good coffee places on campus..."
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      rows={4}
                      maxLength={500}
                    />
                    <div className="char-count">
                      {formData.description.length}/500 characters
                    </div>
                  </div>
                  {errors.description && <span className="error-text">{errors.description}</span>}
                  <div className="form-hint">
                    Share your food preferences, dietary restrictions, or anything else we should know
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                  <Button
                    variant="primary"
                    type="submit"
                    size="large"
                    disabled={isSubmitting}
                    style={{ flex: 1 }}
                  >
                    {isSubmitting ? 'Saving Profile...' : 'Complete Profile'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={skipForNow}
                    style={{ marginLeft: '1rem' }}
                  >
                    Skip for Now
                  </Button>
                </div>
              </form>
            </div>

            {/* Footer Links */}
            <div className="footer-links">
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer-link">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;