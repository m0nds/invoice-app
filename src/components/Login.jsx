import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useError } from '../context/ErrorContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAuth();
  const { addError } = useError();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      addError({
        message: 'Please enter your email address.',
        code: 'VALIDATION_ERROR'
      });
      return;
    }
    
    if (!password.trim()) {
      addError({
        message: 'Please enter your password.',
        code: 'VALIDATION_ERROR'
      });
      return;
    }
    
    if (!isLogin && !displayName.trim()) {
      addError({
        message: 'Please enter your full name.',
        code: 'VALIDATION_ERROR'
      });
      return;
    }
    
    if (password.length < 6) {
      addError({
        message: 'Password must be at least 6 characters long.',
        code: 'VALIDATION_ERROR'
      });
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, displayName);
        addError({
          message: 'Account created successfully! Welcome!',
          code: 'SIGNUP_SUCCESS',
          type: 'success'
        });
      }
    } catch (error) {
      addError({
        message: error.message,
        code: 'AUTH_ERROR'
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-generalBackground flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="mt-6 text-center text-2xl lg:text-3xl font-bold text-primaryBlack">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-lightGray">
            {isLogin ? 'Enter your credentials to access your dashboard' : 'Create a new account to get started'}
          </p>
        </div>
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-lightGray mb-2">Full Name</label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required={!isLogin}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-darkGray focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                  placeholder="Enter your full name"
                />
              </div>
            )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-lightGray mb-2">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-darkGray focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                    placeholder="Enter your email address"
                  />
                  {!isLogin && (
                    <p className="mt-1 text-xs text-lightGray">We'll use this to send you important updates</p>
                  )}
                </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-lightGray mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl placeholder-gray-400 text-darkGray focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-appBlue"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-lightGray">Must be at least 6 characters long</p>
              )}
              {isLogin && (
                <p className="mt-1 text-xs text-lightGray">
                  <button 
                    type="button" 
                    className="text-appBlue hover:text-blue-700 underline"
                    onClick={() => addError({
                      message: 'Password reset feature coming soon! For now, please contact support.',
                      code: 'PASSWORD_RESET',
                      type: 'info'
                    })}
                  >
                    Forgot your password?
                  </button>
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-appBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-appBlue disabled:opacity-50 touch-manipulation"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-appBlue hover:text-blue-700 text-sm font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

