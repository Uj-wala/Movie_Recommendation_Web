import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';
import { useLogoNavigation } from '../../../../hooks/useLogoNavigation';
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MAX_LENGTH_ERROR,
  hasReachedEmailMaxLength,
  limitEmailInput,
} from '../../../../utils/validation';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleLogoClick = useLogoNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@thestackly.com' && password === 'Stackly@123') {
      setError('');
      onLogin(email);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <button type="button" className="login-logo" onClick={handleLogoClick} aria-label="Go to Home Page">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill="#238B45"/>
              <path d="M9.83006 8.0767C11.2766 6.53824 12.7231 6.53824 14.1697 8.0767" stroke="white"/>
              <path d="M9.83019 9.46154C11.2767 11 12.7233 11 14.1698 9.46154M12 3C8.88679 3 7 5.30769 7 8.07692C7 10.3846 8.41509 12.2308 10.3019 13.1538V15H13.6981V13.1538C15.5849 12.2308 17 10.3846 17 8.07692C17 5.30769 15.1132 3 12 3Z" stroke="white"/>
            </svg>
          </button>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your E-Learning dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div style={{ color: '#E11D48', fontSize: '14px', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              maxLength={EMAIL_MAX_LENGTH}
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => {
                setEmail(limitEmailInput(e.target.value));
                setEmailError(
                  hasReachedEmailMaxLength(e.target.value)
                    ? EMAIL_MAX_LENGTH_ERROR
                    : '',
                );
              }}
              required
            />
            {emailError && (
              <span style={{ color: '#ef4444', fontSize: '12px' }}>
                {emailError}
              </span>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} color="#8B8B8B" /> : <Eye size={20} color="#8B8B8B" />}
              </button>
            </div>
          </div>
          
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <span className="forgot-password">Forgot Password?</span>
          </div>

          <button type="submit" className="login-btn">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
