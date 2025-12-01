export const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export const config = {
  apiUrl: API_BASE_URL,
  endpoints: {
    auth: '/api/auth',
    communities: '/api/communities',
    fields: '/api/fields',
    posts: '/api/posts',
    weather: '/api/weather'
  }
};