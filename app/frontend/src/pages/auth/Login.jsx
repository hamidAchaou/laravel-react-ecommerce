// src/pages/Login.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { loginUser } from '../../features/auth/authThunks';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { useFormValidation } from '../../hooks/useFormValidation';
import { Input } from '../../components/frontend/ui/Input';
import { Button } from '../../components/frontend/ui/Button';
import { Alert } from '../../components/frontend/ui/Alert';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';

// Validation rules
const validationRules = {
  email: [
    (value) => !value ? 'Email is required' : '',
    (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : '',
  ],
  password: [
    (value) => !value ? 'Password is required' : '',
    (value) => value && value.length < 2 ? 'Password must be at least 6 characters' : '',
  ],
};

const initialFormState = {
  email: '',
  password: '',
};

export default function Login() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((state) => state.auth);
  
  // Redirect if already authenticated
  useAuthRedirect();

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
  } = useFormValidation(initialFormState, validationRules);

  // Check for redirect message from registration
  const registered = searchParams.get('registered');
  const verified = searchParams.get('verified');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await dispatch(loginUser(formData));
    
    if (result.meta.requestStatus === 'fulfilled') {
      // Redirect is handled by useAuthRedirect hook
    }
  };

  const getInputStatus = (fieldName) => {
    if (errors[fieldName] && touched[fieldName]) return 'error';
    if (touched[fieldName] && !errors[fieldName]) return 'success';
    return null;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-20 bg-brand-gray-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <Shield className="h-8 w-8 text-brand-primary" />
              <span className="text-2xl font-bold text-brand-dark">YourBrand</span>
            </Link>
            
            <h1 className="text-3xl font-bold text-brand-dark mb-2">
              Welcome back
            </h1>
            <p className="text-brand-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Success Messages */}
          {registered && (
            <Alert type="success" className="mb-6">
              Registration successful! Please log in with your credentials.
            </Alert>
          )}

          {verified && (
            <Alert type="success" className="mb-6">
              Email verified successfully! You can now log in.
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert type="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={touched.email && errors.email}
              success={getInputStatus('email') === 'success'}
              leftIcon={Mail}
              placeholder="Enter your email"
              isLoading={loading}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              error={touched.password && errors.password}
              success={getInputStatus('password') === 'success'}
              leftIcon={Lock}
              placeholder="Enter your password"
              isLoading={loading}
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-brand-gray-300 text-brand-primary focus:ring-brand-primary"
                />
                <span className="ml-2 text-brand-gray-600">Remember me</span>
              </label>
              
              <Link 
                to="/forgot-password" 
                className="text-brand-primary hover:text-brand-primary/80 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full"
              rightIcon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-brand-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-brand-primary font-semibold hover:text-brand-primary/80 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-brand-gray-100 rounded-xl text-center">
            <p className="text-xs text-brand-gray-500">
              <Shield className="h-3 w-3 inline mr-1" />
              Your data is securely encrypted and protected
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Hero Image/Content */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-primary to-brand-secondary">
        <div className="flex-1 flex items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">
              Secure Access to Your Account
            </h2>
            <p className="text-lg opacity-90">
              Manage your preferences, track orders, and enjoy personalized experiences with secure login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}