// Helper to get the base URL for the application
// Used for Stripe redirect URLs

const getBaseUrl = () => {
  // For browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // For server environment, use environment variable or default
  return import.meta.env.VITE_BASE_URL || 'http://localhost:5173';
};

export default getBaseUrl;