import React, { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from '../../features/auth/authThunks';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  ArrowRight
} from "lucide-react";

// Memoized form field configuration
const FORM_FIELDS = [
  {
    name: "name",
    type: "text",
    placeholder: "Full Name",
    icon: User,
    autoComplete: "name"
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email Address",
    icon: Mail,
    autoComplete: "email"
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    icon: Lock,
    autoComplete: "new-password"
  },
  {
    name: "password_confirmation",
    type: "password",
    placeholder: "Confirm Password",
    icon: Lock,
    autoComplete: "new-password"
  }
];

// Password strength calculator
const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: "Very Weak", color: "text-error" };
  
  let score = 0;
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  ];
  
  score = checks.filter(Boolean).length;

  const levels = [
    { label: "Very Weak", color: "text-error" },
    { label: "Weak", color: "text-warning" },
    { label: "Fair", color: "text-brand-accent" },
    { label: "Good", color: "text-info" },
    { label: "Strong", color: "text-success" }
  ];

  return { ...levels[score] || levels[0], score };
};

// Password requirements checker
const checkPasswordRequirements = (password) => [
  {
    met: password.length >= 8,
    text: "At least 8 characters",
    key: "length"
  },
  {
    met: /[a-z]/.test(password),
    text: "One lowercase letter",
    key: "lowercase"
  },
  {
    met: /[A-Z]/.test(password),
    text: "One uppercase letter",
    key: "uppercase"
  },
  {
    met: /\d/.test(password),
    text: "One number",
    key: "number"
  }
];

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    password_confirmation: false
  });
  const [touchedFields, setTouchedFields] = useState({});

  // Memoized derived state
  const passwordStrength = useMemo(
    () => calculatePasswordStrength(formData.password),
    [formData.password]
  );

  const passwordRequirements = useMemo(
    () => checkPasswordRequirements(formData.password),
    [formData.password]
  );

  const allRequirementsMet = useMemo(
    () => passwordRequirements.every(req => req.met),
    [passwordRequirements]
  );

  // Optimized handlers
  const handleInputChange = useCallback((fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  }, []);

  const handleFieldBlur = useCallback((fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  const togglePasswordVisibility = useCallback((fieldName) => {
    setShowPassword(prev => ({ 
      ...prev, 
      [fieldName]: !prev[fieldName] 
    }));
  }, []);

  const getInputType = useCallback((fieldName, originalType) => {
    if (originalType !== "password") return originalType;
    return showPassword[fieldName] ? "text" : "password";
  }, [showPassword]);

  const getFieldError = useCallback((fieldName) => {
    if (!touchedFields[fieldName]) return null;
    
    const value = formData[fieldName];
    
    switch (fieldName) {
      case "name":
        if (!value) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (value.length > 50) return "Name must be less than 50 characters";
        break;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address";
        break;
      case "password":
        if (!value) return "Password is required";
        if (!allRequirementsMet) return "Password doesn't meet requirements";
        break;
      case "password_confirmation":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords don't match";
        break;
      default:
        return null;
    }
    
    return null;
  }, [formData, touchedFields, allRequirementsMet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = FORM_FIELDS.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);

    // Check for errors
    const hasErrors = FORM_FIELDS.some(field => getFieldError(field.name));
    if (hasErrors) return;

    const result = await dispatch(registerUser(formData));

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login?registered=true", { replace: true });
    }
  };

  const isFormValid = useMemo(() => {
    return FORM_FIELDS.every(field => !getFieldError(field.name)) && 
           Object.keys(touchedFields).length > 0;
  }, [getFieldError, touchedFields]);

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center px-4 py-8">
      {/* Main Card */}
      <div className="w-full max-w-md">
        {/* Header Section */}
        <header className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 mb-6 group"
            aria-label="Go to homepage"
          >
            <div className="p-2 bg-brand-primary rounded-xl group-hover:scale-105 transition-transform">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-brand-text-primary">
              YourBrand
            </span>
          </Link>
          
          <h1 className="text-3xl font-bold text-brand-text-primary mb-3">
            Create Your Account
          </h1>
          <p className="text-brand-text-secondary text-lg">
            Join thousands of happy users
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div 
            className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-brand-surface rounded-2xl shadow-lg p-6 space-y-6"
          noValidate
        >
          {/* Form Fields */}
          {FORM_FIELDS.map((field) => {
            const IconComponent = field.icon;
            const isPasswordField = field.type === "password";
            const error = getFieldError(field.name);
            const isTouched = touchedFields[field.name];
            
            return (
              <div key={field.name} className="space-y-2">
                <label 
                  htmlFor={field.name}
                  className="block text-sm font-medium text-brand-text-primary"
                >
                  {field.placeholder}
                </label>
                
                <div className="relative">
                  {/* Input Icon */}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconComponent className="h-5 w-5 text-brand-gray-400" />
                  </div>

                  {/* Input Field */}
                  <input
                    id={field.name}
                    name={field.name}
                    type={getInputType(field.name, field.type)}
                    value={formData[field.name]}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    onBlur={() => handleFieldBlur(field.name)}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    required
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${field.name}-error` : undefined}
                    className={`
                      w-full pl-10 pr-10 py-3 border rounded-xl
                      transition-all duration-200 focus:outline-none
                      disabled:bg-brand-gray-50 disabled:cursor-not-allowed
                      ${error 
                        ? 'border-error focus:ring-2 focus:ring-error/20' 
                        : isTouched && !error
                          ? 'border-success focus:ring-2 focus:ring-success/20'
                          : 'border-brand-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary'
                      }
                    `}
                    disabled={loading}
                  />

                  {/* Password Visibility Toggle */}
                  {isPasswordField && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field.name)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-gray-400 hover:text-brand-text-secondary transition-colors"
                      disabled={loading}
                      aria-label={showPassword[field.name] ? "Hide password" : "Show password"}
                    >
                      {showPassword[field.name] ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  )}

                  {/* Success Indicator */}
                  {isTouched && !error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <p 
                    id={`${field.name}-error`}
                    className="text-error text-sm flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                )}
              </div>
            );
          })}

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-3 p-4 bg-brand-gray-50 rounded-xl">
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-text-secondary">Password strength:</span>
                <span className={`font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
              
              {/* Strength Bar */}
              <div className="w-full bg-brand-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    passwordStrength.score >= 4 ? 'bg-success' :
                    passwordStrength.score >= 3 ? 'bg-info' :
                    passwordStrength.score >= 2 ? 'bg-warning' :
                    'bg-error'
                  }`}
                  style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  aria-valuenow={passwordStrength.score}
                  aria-valuemin={0}
                  aria-valuemax={4}
                />
              </div>

              {/* Requirements List */}
              <div className="space-y-2 text-sm">
                {passwordRequirements.map((req) => (
                  <div 
                    key={req.key} 
                    className="flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle2 
                      className={`h-4 w-4 transition-colors ${
                        req.met ? 'text-success' : 'text-brand-gray-400'
                      }`} 
                    />
                    <span className={req.met ? 'text-success' : 'text-brand-text-secondary'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms Agreement */}
          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-brand-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="terms" className="text-sm text-brand-text-secondary">
              I agree to the{" "}
              <Link 
                to="/terms" 
                className="text-brand-primary hover:underline font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link 
                to="/privacy" 
                className="text-brand-primary hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`
              w-full py-3 px-6 rounded-xl font-semibold text-white
              transition-all duration-200 flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${loading 
                ? 'bg-brand-gray-400' 
                : 'bg-brand-primary hover:bg-brand-primary/90 hover:shadow-lg'
              }
            `}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <footer className="text-center mt-6">
          <p className="text-brand-text-secondary">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-brand-primary font-semibold hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </footer>

        {/* Security Badge */}
        <div className="mt-6 p-3 bg-brand-gray-50 rounded-xl text-center">
          <p className="text-xs text-brand-text-secondary flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Your data is securely encrypted and protected
          </p>
        </div>
      </div>
    </div>
  );
}