/**
 * Provides a React context for managing application configuration data.
 *
 * The `ConfigProvider` component fetches the configuration data from the server and makes it available to its child components through the `ConfigContext`. The `useConfig` hook can be used to access the configuration data within the context.
 *
 * The configuration data is fetched asynchronously, and the `loading` state is provided to indicate when the data is being loaded.
 *
 * @param {object} children - The child components to render within the `ConfigProvider`.
 * @returns {React.ReactNode} - The child components wrapped in the `ConfigContext.Provider`.
 */
"use client";
import { userPrivateRequest } from "@/config/axios.config";
import { createContext, useContext, useEffect, useState } from "react";

// Create a context for configuration
export const ConfigContext = createContext<any>(null);

// Provider component to fetch and provide configuration data
export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<any>(null); // State to store the config data
  const [loading, setLoading] = useState(true); // State to track loading status

  // Function to fetch configuration data from the server
  const fetchConfig = async () => {
    try {
      setLoading(true); // Start loading
      const response = await userPrivateRequest("/api/config/get");
      setConfig(response.data?.data ?? {}); // Set the config data or an empty object if undefined
    } catch (error) {
      console.error("Failed to fetch config:", error); // Handle errors (optional: add error state)
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch config data on component mount
  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ ...config, loading, fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

// Custom hook to access configuration data
export const useConfig = () => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return config; // Return the config data
};
