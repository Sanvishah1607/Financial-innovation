// FinShield Frontend API & Client Configuration
// Place all your frontend API keys, backend URLs, and Google OAuth credentials here.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const GOOGLE_OAUTH_CONFIG = {
  // Replace with your Google Cloud Console OAuth 2.0 Client ID:
  // e.g. "1234567890-abcdefg.apps.googleusercontent.com"
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-finshield-google-client-id.apps.googleusercontent.com',
};

export const AI_ADVISOR_CONFIG = {
  // Optional: If you want to use OpenAI or Google Gemini directly in frontend:
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
};

export const APP_CONFIG = {
  name: 'FinShield',
  tagline: 'Your Money. Your Shield.',
  version: '1.0.0',
};
