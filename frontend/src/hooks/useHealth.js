// Custom React hook to check and monitor backend health status

import { useState, useEffect } from 'react';
import { checkBackendHealth } from '../services/api';

export function useHealth() {
  const [health, setHealth] = useState({
    loading: true,
    isOnline: false,
    data: null,
    error: null,
    lastChecked: null,
  });

  const checkStatus = async () => {
    setHealth((prev) => ({ ...prev, loading: true, error: null }));
    const result = await checkBackendHealth();

    if (result.success) {
      setHealth({
        loading: false,
        isOnline: true,
        data: result.data,
        error: null,
        lastChecked: new Date().toLocaleTimeString(),
      });
    } else {
      setHealth({
        loading: false,
        isOnline: false,
        data: null,
        error: result.error,
        lastChecked: new Date().toLocaleTimeString(),
      });
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return { ...health, refetch: checkStatus };
}
