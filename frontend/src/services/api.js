// FinGuard API Service Client
// Centralized HTTP client for communicating with the FastAPI backend

import { API_BASE_URL } from '../config';

/**
 * Check if the backend server is online and healthy
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Unable to connect to backend server on ' + API_BASE_URL,
    };
  }
}

/**
 * Generic API request helper for future endpoints
 * @param {string} endpoint - e.g. '/api/v1/transactions'
 * @param {object} options - fetch options
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
