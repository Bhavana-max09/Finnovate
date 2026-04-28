// Central API configuration
// In local dev:   VITE_API_URL is set → use Vite proxy at /api (same-origin, no CORS)
// In production:  falls back to the deployed Render backend
const API_BASE = import.meta.env.DEV 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'https://ethicredit-pro.onrender.com');

export default API_BASE;
