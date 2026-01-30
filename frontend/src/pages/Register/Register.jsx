import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // Try to register with API first
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user',
        profileCompleted: false,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
        university: '',
        dormitory: '',
        yearOfStudy: ''
      };
      
      // Try to save to db.json API
      let response;
      try {
        response = await fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
      } catch (apiError) {
        console.log('API not available, using localStorage instead');
        // If API fails, use localStorage
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const newUser = {
          ...userData,
          id: `u${mockUsers.length + 1}`,
        };
        mockUsers.push(newUser);
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        localStorage.setItem('user', JSON.stringify(newUser));
        response = { ok: true, data: newUser };
      }
      
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        
        // Navigate to profile completion page
        navigate('/completeprofile', { 
          state: { 
            email: formData.email,
            name: formData.name 
          } 
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        general: 'Registration failed. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
    // Mock Google Registration
    const mockGoogleUser = {
      id: `google-${Date.now()}`,
      email: "google-user@gmail.com",
      name: "Google User",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      role: "user",
      profileCompleted: false
    };

    console.log('Google Registration successful:', mockGoogleUser);
    localStorage.setItem('user', JSON.stringify(mockGoogleUser));
    navigate('/completeprofile');
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side: Hero Image */}
        <div className="register-hero">
          <div
            className="hero-image"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")'
              
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <span className="hero-tag">Join Our Community</span>
              <h2 className="hero-title">
                Start Your <span className="hero-highlight">Food Journey</span> Today
              </h2>
              <p className="hero-description">
                Join thousands of AAU students who are discovering amazing food spots
                and sharing their culinary experiences on campus.
              </p>
            
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="register-form-side">
          <div className="register-form-container">
            {/* Header */}
            <div className="register-logo">
              <Link to="/" className="logo-link">
                <h1 className="logo-text">Gebeta</h1>
              </Link>
              <p className="logo-subtitle">The Campus Food Guide</p>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
              <div className="progress-step active">
                <div className="step-number">1</div>
                <div className="step-label">Register</div>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step ">
                <div className="step-number">2</div>
                <div className="step-label">Complete Profile</div>
              </div>
            </div>

            {/* Form Card */}
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">Create Your Account</h2>
                <p className="form-subtitle">Fill in your details to get started</p>
                {errors.general && (
                  <div className="error-message" style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                    {errors.general}
                  </div>
                )}
              </div>

              <form className="register-form" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <input
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="student@aau.edu.et"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  {errors.email && <span className="error-text">{errors.email}</span>}
                  <div className="form-hint">
                    Use your AAU email for student verification
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper password-input">
                    <input
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Create a strong password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                  <div className="password-hint">
                    Must be at least 6 characters with letters and numbers
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper password-input">
                    <input
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Re-enter your password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-text">{errors.confirmPassword}</span>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    id="terms"
                    type="checkbox"
                    required
                  />
                  <label className="checkbox-label" htmlFor="terms">
                    I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                  </label>
                </div>

                {/* Sign Up Button */}
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="large" 
                  disabled={isSubmitting}
                  style={{ marginTop: '1rem' }}
                >
                  {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>

              {/* Divider */}
              <div className="form-divider">
                <div className="divider-line"></div>
                <span className="divider-text">Or sign up with</span>
              </div>

              {/* Social Registration */}
              <div className="social-login">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGoogleRegister}
                  className="google-button"
                >
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="social-text">Google</span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="facebook-button"
                >
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="social-text">Facebook</span>
                </Button>
              </div>
            </div>

            {/* Footer Links */}
            <p className="login-link">
              Already have an account?
              <Link
                to="/login"
                className="login-button-link"
              >
                Sign In
              </Link>
            </p>

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

export default Register;