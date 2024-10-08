/**
 * The `Signincover` component is the main login page for the application. It handles user authentication and provides a visual cover image with security tips.
 *
 * The component uses Redux hooks to manage the login state and dispatch actions. It also utilizes the `react-toastify` library to display error messages.
 *
 * The login form includes fields for email and password, with a toggle to show/hide the password. When the user submits the form, the component makes a request to the `/api/auth/login` endpoint to authenticate the user. Upon successful login, the user is redirected to the CRM dashboard.
 *
 * The component also includes a cover image carousel with security tips, such as protecting credentials, enabling two-factor authentication, and logging out when finished.
 */
"use client";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/shared/redux/store/slices/authSlice";
import { userPrivateRequest, userPublicRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import { connect } from "react-redux";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import LoginAuthenticatorModal from "@/shared/modals/LoginAuthenticatorModal";
import CustomToasterContainer from "@/shared/common-components/CustomToasterContainer";

const Signincover = ({ local_varaiable }) => {
  const router = useRouter();

  // Redux hooks for dispatching actions and accessing state
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);

  // Local state for managing form data and error messages
  const [data, setData] = useState({
    email: "admin@metatrend.com.ph",
    password: "12345678",
  });
  const [passwordShow, setPasswordShow] = useState(false); // Manage password visibility toggle

  const [temporaryToken, setTemporaryToken] = useState("");

  const [isAuthenticatorModalOpen, setIsAuthenticatorModalOpen] =
    useState(false);

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
      const status = response.data?.status ?? "success";
      if (status == "otp_required") {
        setTemporaryToken(response.data?.token ?? "");
        setIsAuthenticatorModalOpen(true);
      } else {
        // Save the token to Redux store and localStorage
        dispatch(loginSuccess({ token }));
        localStorage.setItem("token", token);

        // Redirect to the CRM dashboard after successful login
        if (hasDashboardAccess) {
          router.push("/dashboard");
        } else {
          router.push("/profile/settings/");
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      // Dispatch login failure and set error message
      dispatch(loginFailure(message));
      toast.error(message); // Show a loading toast)
    }
  };
  const customstyles: any = {
    ...(local_varaiable.colorPrimaryRgb !== "" && {
      "--primary-rgb": local_varaiable.colorPrimaryRgb,
    }),
    ...(local_varaiable.colorPrimary !== "" && {
      "--primary": local_varaiable.colorPrimary,
    }),
    ...(local_varaiable.darkBg !== "" && {
      "--dark-bg": local_varaiable.darkBg,
    }),
    ...(local_varaiable.bodyBg !== "" && {
      "--body-bg": local_varaiable.bodyBg,
    }),
    ...(local_varaiable.inputBorder !== "" && {
      "--input-border": local_varaiable.inputBorder,
    }),
    ...(local_varaiable.Light !== "" && { "--light": local_varaiable.Light }),
  };

  return (
    <Fragment>
      <html
        suppressHydrationWarning={true}
        dir={local_varaiable.dir}
        className={local_varaiable.class}
        data-header-styles={local_varaiable.dataHeaderStyles}
        data-vertical-style={local_varaiable.dataVerticalStyle}
        data-nav-layout={local_varaiable.dataNavLayout}
        data-menu-styles={local_varaiable.dataMenuStyles}
        data-toggled={local_varaiable.dataToggled}
        data-nav-style={local_varaiable.dataNavStyle}
        hor-style={local_varaiable.horStyle}
        data-page-style={local_varaiable.dataPageStyle}
        data-width={local_varaiable.dataWidth}
        data-menu-position={local_varaiable.dataMenuPosition}
        data-header-position={local_varaiable.dataHeaderPosition}
        data-icon-overlay={local_varaiable.iconOverlay}
        bg-img={local_varaiable.bgImg}
        data-icon-text={local_varaiable.iconText}
        //Styles
        style={customstyles}
      >
        <body>
          <CustomToasterContainer />
          <Seo title={"Signin-cover"} />
          {/* Modal */}

          <LoginAuthenticatorModal
            token={temporaryToken}
            isOpen={isAuthenticatorModalOpen}
            onClose={() => {
              setIsAuthenticatorModalOpen(false);
            }}
          />
          {/* Modal end */}
          <div className="grid grid-cols-12 authentication mx-0 text-defaulttextcolor text-defaultsize">
            <div className="xxl:col-span-7 xl:col-span-7 lg:col-span-12 col-span-12 bg-white dark:!bg-bodybg">
              <div className="grid grid-cols-12 items-center h-full ">
                <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2"></div>
                <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12">
                  <div className="p-[3rem]">
                    <div className="mb-4">
                      <Link aria-label="anchor" href="/dashboard/">
                        <img
                          src="../../../assets/images/brand-logos/desktop-logo.png"
                          alt=""
                          className="authentication-brand desktop-logo"
                        />
                        <img
                          src="../../../assets/images/brand-logos/desktop-dark.png"
                          alt=""
                          className="authentication-brand desktop-dark"
                        />
                      </Link>
                    </div>

                    <div className="grid grid-cols-12 gap-y-4">
                      <div className="xl:col-span-12 col-span-12 mt-0">
                        <label
                          htmlFor="signin-username"
                          className="form-label text-default"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg w-full !rounded-md"
                          id="signin-username"
                          placeholder="Email"
                          name="email"
                          onChange={changeHandler}
                          value={email}
                        />
                      </div>
                      <div className="xl:col-span-12 col-span-12">
                        <label
                          htmlFor="signin-password"
                          className="form-label text-default block"
                        >
                          Password{" "}
                          {/*}<Link href="/authentication/reset-password/reset-cover" className="ltr:float-right rtl:float-left text-danger">Forgot password?</Link>{*/}
                        </label>
                        <div className="input-group">
                          <input
                            type={passwordShow ? "text" : "password"}
                            className="form-control form-control-lg  !border-s !rounded-e-none"
                            id="signin-password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={changeHandler}
                          />
                          <button
                            aria-label="button"
                            type="button"
                            className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                            onClick={() => setPasswordShow(!passwordShow)}
                            id="button-addon2"
                          >
                            <i
                              className={`${
                                passwordShow ? "ri-eye-line" : "ri-eye-off-line"
                              } align-middle`}
                            ></i>
                          </button>
                        </div>
                        <div className="mt-2">
                          <div className="form-check !ps-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              id="defaultCheck1"
                            />
                            <label
                              className="form-check-label text-[#8c9097] dark:text-white/50 font-normal"
                              htmlFor="defaultCheck1"
                            >
                              Remember password?
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="xl:col-span-12 col-span-12 grid">
                        <Link
                          href="#"
                          className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10"
                          onClick={handleLogin}
                        >
                          {auth.loading ? (
                            <ButtonSpinner text={"Signing In"} />
                          ) : (
                            "Sign In"
                          )}
                        </Link>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                        If you haven't been granted access to the portal or are
                        having trouble logging in, please reach out to your
                        system administrator to ensure your account is set up
                        correctly. Do not attempt to create an unauthorized
                        account.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2"></div>
              </div>
            </div>
            <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-5 col-span-12 xl:block hidden px-0">
              <div className="authentication-cover">
                <div className="aunthentication-cover-content rounded">
                  <div className="swiper keyboard-control">
                    <Swiper
                      spaceBetween={30}
                      navigation={true}
                      centeredSlides={true}
                      autoplay={{ delay: 10000, disableOnInteraction: false }}
                      pagination={{ clickable: true }}
                      modules={[Pagination, Autoplay, Navigation]}
                      className="mySwiper"
                    >
                      <SwiperSlide>
                        <div className="text-white text-center p-[3rem] flex items-center justify-center">
                          <div>
                            <div className="mb-[3rem]">
                              <img
                                src="../../../assets/images/authentication/cred.png"
                                className="authentication-image"
                                alt=""
                              />
                            </div>
                            <h6 className="font-semibold text-[1rem]">
                              Protect Your Credentials
                            </h6>
                            <p className="font-normal text-[.875rem] opacity-[0.7]">
                              {" "}
                              Never share your username or password with anyone.
                              If you suspect that your login information has
                              been compromised, change your password immediately
                              and notify the IT department.
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="text-white text-center p-[3rem] flex items-center justify-center">
                          <div>
                            <div className="mb-[3rem]">
                              <img
                                src="../../../assets/images/authentication/2fa.png"
                                className="authentication-image"
                                alt=""
                              />
                            </div>
                            <h6 className="font-semibold text-[1rem]">
                              Enable Two-Factor Authentication (2FA)
                            </h6>
                            <p className="font-normal text-[.875rem] opacity-[0.7]">
                              {" "}
                              Ensure that you have 2FA enabled for an added
                              layer of security. This helps protect your account
                              even if your password is compromised.
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="text-white text-center p-[3rem] flex items-center justify-center">
                          <div>
                            <div className="mb-[3rem]">
                              <img
                                src="../../../assets/images/authentication/exit.png"
                                className="authentication-image"
                                alt=""
                              />
                            </div>
                            <h6 className="font-semibold text-[1rem]">
                              Log Out When Finished
                            </h6>
                            <p className="font-normal text-[.875rem] opacity-[0.7]">
                              {" "}
                              Always log out of your account when you're
                              finished, especially if you're using a shared or
                              public device. This helps prevent unauthorized
                              access to your account.
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  local_varaiable: state,
});
export default connect(mapStateToProps)(Signincover);

// export default Signincover;
