import axios from "axios";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://d3et1hn8rmwtro.cloudfront.net";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${jwt}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
  (response) => {
    // IMPORTANT:
    // Return the complete Axios response.
    // Do NOT return response.data here.
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

// ===============================
// AUTH HEADERS
// ===============================
export const getAuthHeaders = () => {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    return {};
  }

  return {
    Authorization: `Bearer ${jwt}`,
  };
};
