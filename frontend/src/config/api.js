/**
 * API Configuration
 *
 * - In development: uses localhost:8080
 * - In production (Vercel): uses relative URLs (same domain)
 */

const API_URL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080');

export default API_URL;
