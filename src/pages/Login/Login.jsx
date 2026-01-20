// src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BASE_URL from '../../api/client';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/users`);
      const users = await response.json();

      const user = users.find(u => u.email === email);

      if (user) {
        // In a real app, we would validate password here using bcrypt or similar
        // For this mock implementation, we'll accept any password if the user exists
        console.log('Login successful:', user);
        // You might want to store user info in context or local storage here
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google Login
    const mockGoogleUser = {
      id: "google-123",
      email: "google-user@gmail.com",
      name: "Google User",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      role: "user"
    };

    console.log('Google Login successful:', mockGoogleUser);
    localStorage.setItem('user', JSON.stringify(mockGoogleUser));
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side: Hero Image */}
        <div className="login-hero">
          <div
            className="hero-image"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")'
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <span className="hero-tag">Trending Now</span>
              <h2 className="hero-title">
                Craving something <span className="hero-highlight">extraordinary?</span>
              </h2>
              <p className="hero-description">
                Join thousands of students exploring the best campus eats at AAU.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="login-form-side">
          <div className="login-form-container">
            {/* Logo */}
            <div className="login-logo">
              <Link to="/" className="logo-link">
                <h1 className="logo-text">Gebeta</h1>
              </Link>
              <p className="logo-subtitle">The Campus Food Guide</p>
            </div>

            {/* Form Card */}
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">Sign In</h2>
                <p className="form-subtitle">Welcome back! Please enter your details.</p>
                {error && <div className="error-message" style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</div>}
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="form-group">
                  <label className="form-label">Email or Student ID</label>
                  <div className="input-wrapper">
                    <input
                      className="form-input"
                      placeholder="student@aau.edu.et"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <div className="label-row">
                    <label className="form-label">Password</label>
                    <Link
                      to="/forgot-password"
                      className="forgot-link"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="input-wrapper password-input">
                    <input
                      className="form-input"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </div>

                {/* Remember Me */}
                <div className="checkbox-group">
                  <input
                    className="form-checkbox"
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="checkbox-label" htmlFor="remember">
                    Keep me signed in
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="login-button"
                >
                  Sign In to Gebeta
                </button>
              </form>

              {/* Divider */}
              <div className="form-divider">
                <div className="divider-line"></div>
                <span className="divider-text">Or continue with</span>
              </div>

              {/* Social Login */}
              <div className="social-login">
                <button
                  type="button"
                  className="social-button google-button"
                  onClick={handleGoogleLogin}
                >
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="social-text">Google</span>
                </button>
                <button
                  type="button"
                  className="social-button facebook-button"
                >
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="social-text">Facebook</span>
                </button>
              </div>
            </div>

            {/* Footer Links */}
            <p className="register-link">
              Don't have an account?
              <Link
                to="/register"
                className="register-button"
              >
                Create an Account
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

export default Login;