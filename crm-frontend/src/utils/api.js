import axios from "axios";
import { store } from "../store/store";
import { logout, refreshAccessToken } from "../features/auth/authSlice";

let storeRef;

export const injectStore = (_store) => {
  storeRef = _store;
};

const api = axios.create({
  baseURL: "/", // proxy handled by CRA
});

// Attach access token to each request
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.user?.accesstoken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (originalRequest.url.includes("api/auth/refresh")) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storeRef.getState().auth.user?.refreshtoken;
        if (!refreshToken) {
          storeRef.dispatch(logout());
          return Promise.reject(err);
        }

        // request new access token
        const res = await axios.post("/api/auth/refresh", null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const newAccessToken = res.data.accesstoken;
        // console.log(newAccessToken);

        // ✅ update Redux store (using your refreshAccessToken action)
        storeRef.dispatch(refreshAccessToken(newAccessToken));

        // retry the original request with new token
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        storeRef.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
