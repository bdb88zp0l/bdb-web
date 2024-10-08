/**
 * This module sets up two Axios instances, one for public API requests and one for private API requests that require authentication.
 *
 * The `userPublicRequest` instance is configured with the base URL from the `NEXT_PUBLIC_API_URL` environment variable, or an empty string if the variable is not set.
 *
 * The `userPrivateRequest` instance is also configured with the base URL from `NEXT_PUBLIC_API_URL`, and it has a request interceptor that adds the `Authorization` header with a Bearer token from `localStorage` if it exists.
 *
 * Both instances are exported for use in other parts of the application.
 */
import axios from "axios";

// Set the base URL for the API from environment variables, or fallback to an empty string
const userPublicApi = process.env.NEXT_PUBLIC_API_URL || "";

// Set the default Content-Type for POST requests
axios.defaults.headers.post["Content-Type"] = "application/json";

// Create an Axios instance for public requests
const userPublicRequest = axios.create({
  baseURL: userPublicApi,
});

// Create an Axios instance for private requests (requires authentication)
const userPrivateRequest = axios.create({
  baseURL: userPublicApi,
});

// Add a request interceptor to the private request instance
userPrivateRequest.interceptors.request.use(
  async (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    // If headers are undefined, initialize them as an empty object
    if (!config.headers) {
      config.headers = {};
    }

    // If the token exists, add the Authorization header
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle the error by rejecting the promise
    return Promise.reject(error);
  }
);

// Export the Axios instances for use in other parts of the application
export { userPrivateRequest, userPublicRequest };

