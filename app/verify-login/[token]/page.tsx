"use client";

/**
 * The main page component for the application.
 * This component handles user authentication, including login functionality.
 * It uses Redux to manage the application state and Axios to make API requests.
 * The component renders a login form and handles the login process, including
 * dispatching actions to the Redux store and updating the user profile data.
 * After a successful login, the user is redirected to the CRM dashboard.
 */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Updated import
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/shared/redux/store/slices/authSlice";
import { userPublicRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";

export default function VerifyLogin() {
  // Router instance for navigation
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get dynamic route param 'name' from URL
  const name = searchParams.get("name");

  // Redux hooks for dispatching actions and accessing state
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);

  // Local state for managing form data and error messages
  const [data, setData] = useState({
    email: "admin@metatrend.com.ph",
    password: "12345678",
  });
  const [passwordShow, setPasswordShow] = useState(false); // Manage password visibility toggle

  // Extract email and password from data state
  const { email, password } = data;

  // Handle form input changes
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    dispatch(loginStart()); // Dispatch login start action

    try {
      // Make the login request
      const response = await userPublicRequest.post("/api/auth/login", {
        email,
        password,
      });

      // Extract token from response
      const token = response.data?.data?.token ?? "";
      const hasDashboardAccess =
        response.data?.data?.hasDashboardAccess ?? false;

      // Save the token to Redux store and localStorage
      dispatch(loginSuccess({ token }));
      localStorage.setItem("token", token);

      // Redirect to the CRM dashboard after successful login
      if (hasDashboardAccess) {
        router.push("/dashboard");
      } else {
        router.push("/profile/settings/");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      // Dispatch login failure and set error message
      dispatch(loginFailure(message));
      toast.error(message); // Show a loading toast)
    }
  };

  return (
    <>
      {/* UI of the signin page. */}
      <ToastContainer position="bottom-center" hideProgressBar={true} />
      <div className="container">
        <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
          <div className="grid grid-cols-12">
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>

            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12 flex items-center justify-center min-h-screen">
              <div className="box !p-[3rem] ">
                <div
                  className="box-body"
                  role="tabpanel"
                  id="pills-with-brand-color-01"
                  aria-labelledby="pills-with-brand-color-item-1"
                >
                  <div className="grid grid-cols-12 gap-y-4">
                    <div className="xl:col-span-12 col-span-12">
                      <label
                        htmlFor="signin-email"
                        className="form-label text-default"
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        name="email"
                        className="form-control form-control-lg w-full !rounded-md"
                        id="email"
                        onChange={changeHandler}
                        value={email}
                      />
                    </div>

                    <div className="xl:col-span-12 col-span-12">
                      <label
                        htmlFor="signin-password"
                        className="form-label text-default block"
                      >
                        Password
                      </label>

                      <div className="input-group">
                        <input
                          name="password"
                          type={passwordShow ? "text" : "password"}
                          value={password}
                          onChange={changeHandler}
                          className="form-control  !border-s form-control-lg !rounded-s-md"
                          id="signin-password"
                          placeholder=""
                        />
                        <button
                          onClick={() => setPasswordShow(!passwordShow)}
                          aria-label="button"
                          className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                          type="button"
                          id="button-addon2"
                        >
                          <i
                            className={`${
                              passwordShow ? "ri-eye-line" : "ri-eye-off-line"
                            } align-middle`}
                          ></i>
                        </button>
                      </div>
                    </div>

                    <div className="xl:col-span-12 col-span-12 grid">
                      <button
                        onClick={handleLogin}
                        className="ti-btn ti-btn-primary !bg-primary !text-white !font-medium"
                        disabled={auth.loading}
                      >
                        {auth.loading ? (
                          <ButtonSpinner text={"Logging In"} />
                        ) : (
                          "Log In"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
