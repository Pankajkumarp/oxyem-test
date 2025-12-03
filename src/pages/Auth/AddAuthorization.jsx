import axios from 'axios';
import jwtDecode from 'jsonwebtoken';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosJWT = axios.create({
  baseURL: `${apiUrl}`,
});

// Request Interceptor: Attach token and refresh if expired
axiosJWT.interceptors.request.use(async (config) => {
  let accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode.decode(token);
      if (decoded?.exp) {
        return Date.now() >= decoded.exp * 1000;
      }
      return true; // if no exp, treat as expired
    } catch (err) {
      console.error('Failed to decode token:', err);
      return true;
    }
  };

  // Case 1: access token is present and expired
  if (accessToken && isTokenExpired(accessToken)) {
    console.log('Access token expired. Attempting to refresh...');
    try {
      const response = await axios.post(`${apiUrl}/users/refreshToken`, {
        rft: refreshToken,
      });

      if (response.status === 200) {
        accessToken = response.data.accessToken;

        // Set 20 min expiry
        const expirationTime = new Date(Date.now() + 20 * 60 * 1000);
        Cookies.set('accessToken', accessToken, {
          secure: true,
          expires: expirationTime,
        });

        config.headers.Authorization = `${accessToken}`;
      }
    } catch (err) {
      console.error('Failed to refresh access token:', err);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  }

  // Case 2: access token is present and valid
  if (accessToken && !isTokenExpired(accessToken)) {
    config.headers.Authorization = `${accessToken}`;
  }

  // Case 3: access token missing, refresh token exists
  if (!accessToken && refreshToken) {
    console.log('Access token missing. Attempting to refresh...');
    try {
      const response = await axios.post(`${apiUrl}/users/refreshToken`, {
        rft: refreshToken,
      });

      if (response.status === 200) {
        accessToken = response.data.accessToken;

        const expirationTime = new Date(Date.now() + 20 * 60 * 1000);
        Cookies.set('accessToken', accessToken, {
          secure: true,
          expires: expirationTime,
        });

        config.headers.Authorization = `${accessToken}`;
      }
    } catch (err) {
      console.error('Failed to refresh access token:', err);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor (Optional: fallback if backend returns 401)
axiosJWT.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      Cookies.get('refreshToken')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refreshToken');
        const response = await axios.post(`${apiUrl}/users/refreshToken`, {
          rft: refreshToken,
        });

        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;
          const expirationTime = new Date(Date.now() + 20 * 60 * 1000);
          Cookies.set('accessToken', newAccessToken, {
            secure: true,
            expires: expirationTime,
          });

          originalRequest.headers.Authorization = `${newAccessToken}`;
          return axiosJWT(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed in response interceptor', refreshError);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export { axiosJWT };
