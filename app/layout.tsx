/**
 * The root layout component for the application.
 * This component sets up the global state management, context providers, and the PrelineScript component.
 * It wraps the children components with the necessary providers and stores.
 *
 * @param {Object} props - The props passed to the component.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 * @returns {React.ReactElement} The root layout component.
 */
"use client";
import "./globals.scss";
import { Provider } from "react-redux";
import store from "@/shared/redux/store";
import PrelineScript from "./PrelineScript";
import { useState } from "react";
import { Initialload } from "@/shared/contextapi";
import { ProfileProvider } from "@/shared/providers/ProfileProvider";
import { ConfigProvider } from "@/shared/providers/ConfigProvider";

const RootLayout = ({ children }: any) => {
  const [pageloading, setpageloading] = useState(false);

  return (
    <>
      <Provider store={store}>
        <Initialload.Provider value={{ pageloading, setpageloading }}>
          <ConfigProvider>
            <ProfileProvider>{children}</ProfileProvider>
          </ConfigProvider>
        </Initialload.Provider>
      </Provider>
      <PrelineScript />
    </>
  );
};
export default RootLayout;
