import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CardLoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect directly to I-Card view as requested
    navigate('/icards', { replace: true });
  }, [navigate]);

  return null;
}
