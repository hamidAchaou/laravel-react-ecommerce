// src/components/frontend/ui/Alert.jsx
import React from 'react';
import { AlertCircle, CheckCircle2, XCircle, Info, X } from 'lucide-react';

const icons = {
  error: XCircle,
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  error: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const Alert = ({ 
  type = 'error', 
  title, 
  children, 
  className = '',
  onDismiss 
}) => {
  const Icon = icons[type];

  return (
    <div className={`rounded-xl border p-4 ${styles[type]} ${className}`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${
          type === 'error' ? 'text-red-500' :
          type === 'success' ? 'text-green-500' :
          type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
        }`} />
        
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          {children && (
            <div className="text-sm mt-1">{children}</div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export { Alert };