import React, { useState } from 'react';
import { Mail, Lock, User, ChevronDown, Eye, EyeOff, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SplitScreenLayout from '../components/SplitScreenLayout';
import Logo from '../components/Logo';
import _PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
const PhoneInput = (_PhoneInput as any).default || _PhoneInput;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationType, setRegistrationType] = useState<'email' | 'phone'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/verify-account');
  };

  return (
    <SplitScreenLayout>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:bg-gray-50 transition-colors z-10"
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>
      <div className="w-full max-w-md pt-4 sm:pt-8 pb-12">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10 justify-between w-full">
          <button
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${registrationType === 'email' ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-900'
              }`}
            onClick={() => setRegistrationType('email')}
          >
            Email Registration
          </button>
          <button
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${registrationType === 'phone' ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-900'
              }`}
            onClick={() => setRegistrationType('phone')}
          >
            Phone Registration
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Logo />

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 mt-6 text-center">Create your Account</h1>
          <p className="text-gray-500 text-xs sm:text-sm text-center">
            Create your AIcademy account to start learning
          </p>
        </div>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                placeholder="you@institution.edu"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {registrationType === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <div className="relative">
              {registrationType === 'email' ? (
                <>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                    placeholder="you@institution.edu"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z0-9@._-]/g, '');
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-[46px]">
                  <PhoneInput
                    country={'in'}
                    value={phoneNumber}
                    onChange={(phone: string) => setPhoneNumber(phone)}
                    enableSearch={true}
                    containerClass="!w-full !h-full"
                    inputClass="!w-full !h-full !border-gray-100 !shadow-[0_2px_10px_rgba(0,0,0,0.02)] !rounded-md !text-sm focus:!outline-none focus:!ring-1 focus:!ring-brand-green focus:!border-brand-green"
                    buttonClass="!bg-gray-50 !border-gray-100 !shadow-[0_2px_10px_rgba(0,0,0,0.02)] !rounded-l-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green tracking-[0.2em]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green tracking-[0.2em]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Security Question
            </label>
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-3 text-sm border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green bg-white">
                <option>Select a Security Question</option>
                <option>What is your Favorite Food?</option>
                <option>What is your Favorite Country?</option>
                <option>What is your favorte Sport?</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              className="block w-full px-3 py-3 text-sm border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
              placeholder="Kumar Gandham"
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-xs text-gray-700">
              I agree to the <a href="#" className="text-brand-green underline decoration-brand-green underline-offset-2">terms of use</a> and our <a href="#" className="text-brand-green underline decoration-brand-green underline-offset-2">privacy policy.</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-bold py-3 px-4 rounded-md transition-colors mb-4"
          >
            Create Account
          </button>

          <div className="text-center text-sm font-medium mb-6">
            <span className="text-gray-900">Already have an account? </span>
            <Link to="/login" className="text-[#FF6B6B] hover:text-[#ff5252]">Login</Link>
          </div>
        </form>
      </div>
    </SplitScreenLayout>
  );
};

export default Register;
