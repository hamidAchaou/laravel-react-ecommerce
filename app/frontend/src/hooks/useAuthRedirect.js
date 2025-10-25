// src/hooks/useAuthRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return { isAuthenticated, user };
};