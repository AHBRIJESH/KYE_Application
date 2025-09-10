import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './css/login.css';

function Login() {
  const [email, setEmail] = useState('usman@aamindata.com');
  const [password, setPassword] = useState('usman');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showContactAdmin, setShowContactAdmin] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/home');
    } else {
      setError('Invalid credentials. Please try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    setShowContactAdmin(true);
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="brand-section text-center mb-4">
          <div className="logo-container mb-3">
            <img 
              src="/assets/img/audit-workflow-logo.png" 
              alt="Company Logo" 
              className="company-logo" 
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} autoComplete="on" className="login-form">
          <div className="form-group mb-3">
            <label htmlFor="userEmail" className="form-label">
              <i className="bi bi-person-fill me-2"></i>User ID
            </label>
            <div className="input-group">
              <input 
                type="email" 
                className="form-control" 
                id="userEmail" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
                autoComplete="username"
              />
            </div>
          </div>
          
          <div className="form-group mb-3 position-relative">
            <label htmlFor="userPassword" className="form-label">
              <i className="bi bi-lock-fill me-2"></i>Password
            </label>
            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                id="userPassword" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="btn password-toggle-btn" 
                onClick={togglePasswordVisibility}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
            </div>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <button 
              type="button" 
              className="forgot-password-btn" 
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>
          
          <div className="d-grid">
            <button type="submit" className="btn login-btn">
              <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
            </button>
          </div>
        </form>
        
        {error && (
          <div className="alert alert-danger mt-3 d-flex align-items-center">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {error}
          </div>
        )}
        
        {showContactAdmin && (
          <div className="alert alert-info mt-3 d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-2"></i>
            Please contact aamindata Admin for password reset.
          </div>
        )}
        
        <div className="text-center mt-4">
          
          <div className="support-info mt-3">
            <p className="mb-1">
              <i className="bi bi-headset me-2"></i>Need help? Contact Support
            </p>
            <p className="mb-0 text-muted">support@aamindata.com | +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
      
      <div className="right-side d-none d-md-flex">
        <img src="/assets/img/login-office-right.png" alt="Audit Office" />
      </div>
    </div>
  );
}

export default Login;