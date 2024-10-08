"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { ThemeChanger } from "../../redux/action";
import { connect } from "react-redux";
import store from "@/shared/redux/store";
import Modalsearch from "../modal-search/modalsearch";
import { basePath } from "@/next.config";
import { logout } from "@/shared/redux/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { userPrivateRequest } from "@/config/axios.config";
import { useConfig } from "@/shared/providers/ConfigProvider";
import { toast } from "react-toastify";
import { getImageUrl } from "@/utils/utils";
import Pusher from "pusher-js";

const Header = ({ local_varaiable, ThemeChanger }: any) => {
  const data = (
    <span className="font-[600] py-[0.25rem] px-[0.45rem] rounded-[0.25rem] bg-pinkmain/10 text-pinkmain text-[0.625rem]">
      Free shipping
    </span>
  );

  const { auth } = store.getState();
  //Notifications

  const span1 = <span className="text-warning">ID: #1116773</span>;
  const span2 = <span className="text-success">ID: 7731116</span>;

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    await userPrivateRequest
      .get("/api/notification/list")
      .then((response) => {
        setNotifications(response.data?.data?.docs ?? []);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClose = (
    index: number,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (event) {
      event.stopPropagation();
    }
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  //full screen
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", fullscreenChangeHandler);

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const windowObject = window;
      if (windowObject.innerWidth <= 991) {
      } else {
      }
    };
    handleResize(); // Check on component mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function menuClose() {
    const theme = store.getState();
    if (window.innerWidth <= 992) {
      ThemeChanger({ ...theme, dataToggled: "close" });
    }
    if (window.innerWidth >= 992) {
      ThemeChanger({
        ...theme,
        dataToggled: local_varaiable.dataToggled
          ? local_varaiable.dataToggled
          : "",
      });
    }
  }

  const toggleSidebar = () => {
    const theme = store.getState();
    let sidemenuType = theme.dataNavLayout;
    if (window.innerWidth >= 992) {
      if (sidemenuType === "vertical") {
        let verticalStyle = theme.dataVerticalStyle;
        const navStyle = theme.dataNavStyle;
        switch (verticalStyle) {
          // closed
          case "closed":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "close-menu-close") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "close-menu-close" });
            }
            break;
          // icon-overlay
          case "overlay":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "icon-overlay-close") {
              ThemeChanger({ ...theme, dataToggled: "", iconOverlay: "" });
            } else {
              if (window.innerWidth >= 992) {
                ThemeChanger({
                  ...theme,
                  dataToggled: "icon-overlay-close",
                  iconOverlay: "",
                });
              }
            }
            break;
          // icon-text
          case "icontext":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "icon-text-close") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "icon-text-close" });
            }
            break;
          // doublemenu
          case "doublemenu":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "double-menu-open") {
              ThemeChanger({ ...theme, dataToggled: "double-menu-close" });
            } else {
              let sidemenu = document.querySelector(".side-menu__item.active");
              if (sidemenu) {
                ThemeChanger({ ...theme, dataToggled: "double-menu-open" });
                if (sidemenu.nextElementSibling) {
                  sidemenu.nextElementSibling.classList.add(
                    "double-menu-active"
                  );
                } else {
                  ThemeChanger({ ...theme, dataToggled: "double-menu-close" });
                }
              }
            }
            break;
          // detached
          case "detached":
            if (theme.dataToggled === "detached-close") {
              ThemeChanger({ ...theme, dataToggled: "", iconOverlay: "" });
            } else {
              ThemeChanger({
                ...theme,
                dataToggled: "detached-close",
                iconOverlay: "",
              });
            }

            break;

          // default
          case "default":
            ThemeChanger({ ...theme, dataToggled: "" });
        }
        switch (navStyle) {
          case "menu-click":
            if (theme.dataToggled === "menu-click-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "menu-click-closed" });
            }
            break;
          // icon-overlay
          case "menu-hover":
            if (theme.dataToggled === "menu-hover-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "menu-hover-closed" });
            }
            break;
          case "icon-click":
            if (theme.dataToggled === "icon-click-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "icon-click-closed" });
            }
            break;
          case "icon-hover":
            if (theme.dataToggled === "icon-hover-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "icon-hover-closed" });
            }
            break;
        }
      }
    } else {
      if (theme.dataToggled === "close") {
        ThemeChanger({ ...theme, dataToggled: "open" });

        setTimeout(() => {
          if (theme.dataToggled == "open") {
            const overlay = document.querySelector("#responsive-overlay");

            if (overlay) {
              overlay.classList.add("active");
              overlay.addEventListener("click", () => {
                const overlay = document.querySelector("#responsive-overlay");

                if (overlay) {
                  overlay.classList.remove("active");
                  menuClose();
                }
              });
            }
          }

          window.addEventListener("resize", () => {
            if (window.screen.width >= 992) {
              const overlay = document.querySelector("#responsive-overlay");

              if (overlay) {
                overlay.classList.remove("active");
              }
            }
          });
        }, 100);
      } else {
        ThemeChanger({ ...theme, dataToggled: "close" });
      }
    }
  };
  //Dark Model

  const ToggleDark = () => {
    ThemeChanger({
      ...local_varaiable,
      class: local_varaiable.class == "dark" ? "light" : "dark",
      dataHeaderStyles: local_varaiable.class == "dark" ? "light" : "dark",
      dataMenuStyles:
        local_varaiable.dataNavLayout == "horizontal"
          ? local_varaiable.class == "dark"
            ? "light"
            : "dark"
          : "dark",
    });
    const theme = store.getState();

    if (theme.class != "dark") {
      ThemeChanger({
        ...theme,
        bodyBg: "",
        Light: "",
        darkBg: "",
        inputBorder: "",
      });
      localStorage.setItem("ynexlighttheme", "light");
      localStorage.removeItem("ynexdarktheme");
      localStorage.removeItem("ynexMenu");
      localStorage.removeItem("ynexHeader");
    } else {
      localStorage.setItem("ynexdarktheme", "dark");
      localStorage.removeItem("ynexlighttheme");
      localStorage.removeItem("ynexMenu");
      localStorage.removeItem("ynexHeader");
    }
  };

  useEffect(() => {
    const navbar = document?.querySelector(".header");
    const navbar1 = document?.querySelector(".app-sidebar");
    const sticky: any = navbar?.clientHeight;
    // const sticky1 = navbar1.clientHeight;

    function stickyFn() {
      if (window.pageYOffset >= sticky) {
        navbar?.classList.add("sticky-pin");
        navbar1?.classList.add("sticky-pin");
      } else {
        navbar?.classList.remove("sticky-pin");
        navbar1?.classList.remove("sticky-pin");
      }
    }

    window.addEventListener("scroll", stickyFn);
    window.addEventListener("DOMContentLoaded", stickyFn);

    // Cleanup event listeners when the component unmounts
    return () => {
      window.removeEventListener("scroll", stickyFn);
      window.removeEventListener("DOMContentLoaded", stickyFn);
    };
  }, []);

  const router = useRouter();

  const [hasNewNotification, setHasNewNotification] = useState(false);
  const configData = useConfig();
  let { workspaces } = configData;
  const handleSwitchWorkspace = async (workspaceId: any) => {
    userPrivateRequest
      .get(`api/profile/switchWorkspace/${workspaceId}`, {})
      .then((response: any) => {
        router.refresh();
      })
      .catch((error: any) => {
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    if (auth?.user?.id) {
      // Initialize Pusher
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      });

      // Subscribe to the user's channel
      const channel = pusher.subscribe(`notification_${auth?.user?.id}`);

      // Bind to the event to get real-time notifications
      channel.bind("new_notification", (data: any) => {
        setNotifications((prevNotifications) => [
          data, // New notification added at the beginning
          ...prevNotifications,
        ]);
        setHasNewNotification(true);
      });

      // Cleanup when component unmounts
      return () => {
        pusher.unsubscribe(`notification_${auth?.user?.id}`);
      };
    }
  }, [auth?.user]);
  return (
    <Fragment>
      <div className="app-header">
        <nav className="main-header !h-[3.75rem]" aria-label="Global">
          <div className="main-header-container ps-[0.725rem] pe-[1rem] ">
            <div className="header-content-left">
              <div className="header-element">
                <div className="horizontal-logo">
                  <Link href="/dashboard/" className="header-logo">
                    <img
                      src={`${getImageUrl(
                        auth?.user?.defaultWorkspace?.logo ?? ""
                      )}`}
                      alt="logo"
                      className="desktop-logo"
                    />
                    <img
                      src={`${getImageUrl(
                        auth?.user?.defaultWorkspace?.logo ?? ""
                      )}`}
                      alt="logo"
                      className="toggle-logo"
                    />
                    <img
                      src={`${getImageUrl(
                        auth?.user?.defaultWorkspace?.logo ?? ""
                      )}`}
                      alt="logo"
                      className="desktop-dark"
                    />
                    <img
                      src={`${getImageUrl(
                        auth?.user?.defaultWorkspace?.logo ?? ""
                      )}`}
                      alt="logo"
                      className="toggle-dark"
                    />
                    <img
                      src={`${getImageUrl(
                        auth?.user?.defaultWorkspace?.logo ?? ""
                      )}`}
                      alt="logo"
                      className="desktop-white"
                    />
                    <img
                      src={`${getImageUrl(
                        auth?.user?.defaultWorkspace?.logo ?? ""
                      )}`}
                      alt="logo"
                      className="toggle-white"
                    />
                  </Link>
                </div>
              </div>
              <div
                className="header-element md:px-[0.325rem] !items-center"
                onClick={() => toggleSidebar()}
              >
                <Link
                  aria-label="Hide Sidebar"
                  className="sidemenu-toggle animated-arrow  hor-toggle horizontal-navtoggle inline-flex items-center"
                  href="#!"
                  scroll={false}
                >
                  <span></span>
                </Link>
              </div>
            </div>
            <div className="header-content-right">
              {/* Search Modal */}
              <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
                <button
                  aria-label="button"
                  type="button"
                  data-hs-overlay="#search-modal"
                  className="inline-flex flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                >
                  <i className="bx bx-search-alt-2 header-link-icon"></i>
                </button>
              </div>

              {/* Notification Feed */}
              <div className="header-element py-[1rem] md:px-[0.65rem] px-2 notifications-dropdown header-notification hs-dropdown ti-dropdown !hidden md:!block [--placement:bottom-right]">
                <button
                  id="dropdown-notification"
                  type="button"
                  className="hs-dropdown-toggle relative ti-dropdown-toggle !p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none align-middle text-xs"
                >
                  <i className="bx bx-bell header-link-icon  text-[1.125rem]"></i>
                  {hasNewNotification && (
                    <span className="flex absolute h-5 w-5 -top-[0.25rem] end-0  -me-[0.6rem]">
                      <span className="animate-slow-ping absolute inline-flex -top-[2px] -start-[2px] h-full w-full rounded-full bg-secondary/40 opacity-75"></span>
                      {/* <span
                      className="relative inline-flex justify-center items-center rounded-full  h-[14.7px] w-[14px] bg-secondary text-[0.625rem] text-white"
                      id="notification-icon-badge"
                    >
                      {notifications.length}
                    </span> */}
                    </span>
                  )}
                </button>
                <div
                  className="main-header-dropdown !-mt-3 !p-0 hs-dropdown-menu ti-dropdown-menu bg-white !w-[22rem] border-0 border-defaultborder hidden !m-0"
                  aria-labelledby="dropdown-notification"
                >
                  <div className="ti-dropdown-header !m-0 !p-4 !bg-transparent flex justify-between items-center">
                    <p className="mb-0 text-[1.0625rem] text-defaulttextcolor font-semibold ">
                      Notifications
                    </p>
                    {/* <span
                      className="text-[0.75em] py-[0.25rem/2] px-[0.45rem] font-[600] rounded-sm bg-secondary/10 text-secondary"
                      id="notifiation-data"
                    >{`${notifications.length} Unread`}</span> */}
                  </div>
                  <div className="dropdown-divider"></div>
                  <ul
                    className="list-none !m-0 !p-0 end-0 overflow-y-scroll"
                    id="header-notification-scroll"
                  >
                    {notifications.map((idx, index) => (
                      <li
                        className="ti-dropdown-item dropdown-item"
                        key={Math.random()}
                      >
                        <div className="flex items-start">
                          <div className="pe-2">
                            <span
                              className={`inline-flex justify-center items-center !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !text-[0.8rem] !rounded-[50%]`}
                            >
                              {/* <i
                                className={`ti ti-${idx.icon} text-[1.125rem]`}
                              ></i> */}
                            </span>
                          </div>
                          <div className="grow flex items-center justify-between">
                            <div>
                              <p className="mb-0 text-defaulttextcolor dark:text-white text-[0.8125rem] font-semibold">
                                <Link href="/pages/notifications/">
                                  {idx.title}
                                </Link>
                              </p>
                              <span className="text-[#8c9097] dark:text-white/50 font-normal text-[0.75rem] header-notification-text">
                                {idx.description}
                              </span>
                            </div>
                            <div>
                              <Link
                                aria-label="anchor"
                                href="#!"
                                scroll={false}
                                className="min-w-fit text-[#8c9097] dark:text-white/50 me-1 dropdown-item-close1"
                                onClick={(event) =>
                                  handleNotificationClose(index, event)
                                }
                              >
                                <i className="ti ti-x text-[1rem]"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`p-4 empty-header-item1 border-t mt-2 ${
                      notifications.length === 0 ? "hidden" : "block"
                    }`}
                  >
                    <div className="grid">
                      <Link
                        href="/pages/notifications/"
                        className="ti-btn ti-btn-primary-full !m-0 w-full p-2"
                      >
                        View All
                      </Link>
                    </div>
                  </div>
                  <div
                    className={`p-[3rem] empty-item1 ${
                      notifications.length === 0 ? "block" : "hidden"
                    }`}
                  >
                    <div className="text-center">
                      <span className="!h-[4rem]  !w-[4rem] avatar !leading-[4rem] !rounded-full !bg-secondary/10 !text-secondary">
                        <i className="ri-notification-off-line text-[2rem]  "></i>
                      </span>
                      <h6 className="font-semibold mt-3 text-defaulttextcolor dark:text-[#8c9097] dark:text-white/50 text-[1rem]">
                        No New Notifications
                      </h6>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unknown Settings */}
              {/* <div className="header-element header-apps dark:text-[#8c9097] dark:text-white/50 py-[1rem] md:px-[0.65rem] px-2 hs-dropdown ti-dropdown md:!block !hidden [--placement:bottom-left]">
                <button
                  aria-label="button"
                  id="dropdown-apps"
                  type="button"
                  className="hs-dropdown-toggle ti-dropdown-toggle !p-0 !border-0 flex-shrink-0  !rounded-full !shadow-none text-xs"
                >
                  <i className="bx bx-grid-alt header-link-icon text-[1.125rem]"></i>
                </button>

                <div
                  className="main-header-dropdown !-mt-3 hs-dropdown-menu ti-dropdown-menu !w-[22rem] border-0 border-defaultborder   hidden"
                  aria-labelledby="dropdown-apps"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="mb-0 text-defaulttextcolor text-[1.0625rem]  font-semibold">
                        Related Apps
                      </p>
                    </div>
                  </div>
                  <div className="dropdown-divider mb-0"></div>
                  <div
                    className="ti-dropdown-divider divide-y divide-gray-200 dark:divide-white/10 main-header-shortcuts p-2"
                    id="header-shortcut-scroll"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      <div className="">
                        <Link
                          href="#!"
                          scroll={false}
                          className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                          <div>
                            <img
                              src={`${
                                process.env.NODE_ENV === "production"
                                  ? basePath
                                  : ""
                              }/assets/images/apps/figma.png`}
                              alt="figma"
                              className="!h-[1.75rem] !w-[1.75rem] text-2xl avatar text-primary flex justify-center items-center mx-auto"
                            />
                            <div className="text-[0.75rem] text-defaulttextcolor dark:text-white">
                              Figma
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link
                          href="#!"
                          scroll={false}
                          className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                          <img
                            src={`${
                              process.env.NODE_ENV === "production"
                                ? basePath
                                : ""
                            }/assets/images/apps/microsoft-powerpoint.png`}
                            alt="miscrosoft"
                            className="leading-[1.75] text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto"
                          />
                          <div className="text-[0.75rem] text-defaulttextcolor dark:text-white">
                            Power Point
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link
                          href="#!"
                          scroll={false}
                          className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                          <img
                            src={`${
                              process.env.NODE_ENV === "production"
                                ? basePath
                                : ""
                            }/assets/images/apps/microsoft-word.png`}
                            alt="miscrodoftword"
                            className="leading-none
                         text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto"
                          />
                          <div className="text-[0.75rem] text-defaulttextcolor dark:text-white">
                            MS Word
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link
                          href="#!"
                          scroll={false}
                          className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                          <img
                            src={`${
                              process.env.NODE_ENV === "production"
                                ? basePath
                                : ""
                            }/assets/images/apps/calender.png`}
                            alt="calander"
                            className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto"
                          />
                          <div className="text-[0.75rem] text-defaulttextcolor dark:text-white">
                            Calendar
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link
                          href="#!"
                          scroll={false}
                          className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                          <img
                            src={`${
                              process.env.NODE_ENV === "production"
                                ? basePath
                                : ""
                            }/assets/images/apps/sketch.png`}
                            alt="apps"
                            className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto"
                          />
                          <div className="text-[0.75rem] text-defaulttextcolor dark:text-white">
                            Sketch
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link
                          href="#!"
                          scroll={false}
                          className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                          <img
                            src={`${
                              process.env.NODE_ENV === "production"
                                ? basePath
                                : ""
                            }/assets/images/apps/google-docs.png`}
                            alt="docs"
                            className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto"
                          />
                          <div className="text-[0.75rem] text-defaulttextcolor dark:text-white">
                            Docs
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link
                          href="#!"
                          scroll={false}
                          className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                          <img
                            src={`${
                              process.env.NODE_ENV === "production"
                                ? basePath
                                : ""
                            }/assets/images/apps/google.png`}
                            alt="google"
                            className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto"
                          />
                          <div className="text-[0.75rem] text-defaulttextcolor dark:text-white">
                            Google
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link
                          href="#!"
                          scroll={false}
                          className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                          <img
                            src={`${
                              process.env.NODE_ENV === "production"
                                ? basePath
                                : ""
                            }/assets/images/apps/translate.png`}
                            alt="translate"
                            className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto"
                          />
                          <div className="text-[0.75rem] text-defaulttextcolor dark:text-white">
                            Translate
                          </div>
                        </Link>
                      </div>
                      <div className="">
                        <Link
                          href="#!"
                          scroll={false}
                          className="p-4 items-center related-app block text-center rounded-sm hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                          <img
                            src={`${
                              process.env.NODE_ENV === "production"
                                ? basePath
                                : ""
                            }/assets/images/apps/google-sheets.png`}
                            alt="sheets"
                            className="leading-none text-2xl !h-[1.75rem] !w-[1.75rem] align-middle flex justify-center mx-auto"
                          />
                          <div className="text-[0.75rem] text-defaulttextcolor dark:text-white">
                            Sheets
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 first:pt-0 border-t">
                    <Link
                      className="w-full ti-btn ti-btn-primary-full p-2 !m-0"
                      href="#!"
                      scroll={false}
                    >
                      View All
                    </Link>
                  </div>
                </div>
              </div> */}

              {/* User Settings */}
              <div className="header-element md:!px-[0.65rem] px-2 hs-dropdown !items-center ti-dropdown [--placement:bottom-left]">
                <button
                  id="dropdown-profile"
                  type="button"
                  className="hs-dropdown-toggle ti-dropdown-toggle !gap-2 !p-0 flex-shrink-0 sm:me-2 me-0 !rounded-full !shadow-none text-xs align-middle !border-0 !shadow-transparent "
                >
                  <img
                    className="inline-block rounded-full  w-5 h-5"
                    src={
                      getImageUrl(auth.user?.photo) ||
                      "../../../assets/images/user-circle.png"
                    }
                    style={{ objectFit: "cover" }}
                    
                  />

                  {/* <img
                    className="inline-block rounded-full w-5 h-5"
                    src="../../../assets/images/user-circle.png"
                  /> */}
                </button>
                <div className="md:block hidden dropdown-profile">
                  <p className="font-semibold mb-0 leading-none text-[#536485] text-[0.813rem] ">
                    {auth?.user?.firstName} {auth?.user?.lastName}
                  </p>
                  <span className="opacity-[0.7] font-normal text-[#536485] block text-[0.6875rem] ">
                    {auth?.user?.roleType === "superAdmin"
                      ? ""
                      : auth?.user?.role?.name ?? ""}
                  </span>
                </div>
                <div
                  className="hs-dropdown-menu ti-dropdown-menu !-mt-3 border-0 w-[11rem] !p-0 border-defaultborder hidden main-header-dropdown  pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end"
                  aria-labelledby="dropdown-profile"
                >
                  <ul className="text-defaulttextcolor font-medium dark:text-[#8c9097] dark:text-white/50">
                    <li>
                      <Link
                        className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0 !p-[0.65rem]"
                        href="/profile/settings/"
                      >
                        <i className="ti ti-adjustments-horizontal text-[1.125rem] me-2 opacity-[0.7] !inline-flex"></i>
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="w-full ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          logout();

                          localStorage.removeItem("token");
                          router.push("/");
                        }}
                      >
                        <i className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7] !inline-flex"></i>
                        Log Out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Workspace Switch */}
              <div className="header-element py-[1rem] md:px-[0.65rem] px-2  header-country hs-dropdown ti-dropdown  hidden sm:block [--placement:bottom-left]">
                <button
                  id="dropdown-flag"
                  type="button"
                  className="hs-dropdown-toggle ti-dropdown-toggle !p-0 flex-shrink-0  !border-0 !rounded-full !shadow-none"
                >
                  {/*<img
                    src={`${
                      process.env.NODE_ENV === "production" ? basePath : ""
                    }/assets/images/flags/us_flag.jpg`}
                    alt="flag-img"
                    className="h-[1.25rem] w-[1.25rem] rounded-full"
                  />{" "}*/}

                  {auth?.user?.defaultWorkspace?.name ?? ""}
                </button>

                <div
                  className="hs-dropdown-menu ti-dropdown-menu min-w-[10rem] hidden !-mt-3"
                  aria-labelledby="dropdown-flag"
                >
                  <div className="ti-dropdown-divider divide-y divide-gray-200 dark:divide-white/10">
                    <div className="py-2 first:pt-0 last:pb-0">
                      {workspaces?.map((workspace: any) => {
                        return (
                          <div
                            className="ti-dropdown-item !p-[0.65rem] "
                            onClick={(e) => {
                              e.preventDefault();
                              handleSwitchWorkspace(workspace._id);
                            }}
                          >
                            <div className="flex items-center space-x-2 rtl:space-x-reverse w-full">
                              {/*
                              <div className="h-[1.375rem] flex items-center w-[1.375rem] rounded-full">
                                <img
                                  src={`${
                                    process.env.NODE_ENV === "production"
                                      ? basePath
                                      : ""
                                  }/assets/images/flags/us_flag.jpg`}
                                  alt="flag-img"
                                  className="h-[1rem] w-[1rem] rounded-full"
                                />
                              </div>
                              */}
                              <div>
                                <p className="!text-[0.8125rem] font-medium">
                                  {workspace.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Utilities */}

              {/* Theme Settings */}
              <div className="header-element md:px-[0.48rem]">
                <button
                  aria-label="button"
                  type="button"
                  className="hs-dropdown-toggle switcher-icon inline-flex flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium  align-middle transition-all text-xs dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  data-hs-overlay="#hs-overlay-switcher"
                >
                  <i className="bx bx-cog header-link-icon animate-spin-slow"></i>
                </button>
              </div>

              {/* Light and Dark Mode */}
              <div
                className="header-element header-theme-mode hidden !items-center sm:block !py-[1rem] md:!px-[0.65rem] px-2"
                onClick={() => ToggleDark()}
              >
                <button
                  aria-label="anchor"
                  className="hs-dark-mode-active:hidden flex hs-dark-mode group flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium transition-all text-xs dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  data-hs-theme-click-value="dark"
                >
                  <i className="bx bx-moon header-link-icon"></i>
                </button>
                <button
                  aria-label="anchor"
                  className="hs-dark-mode-active:flex hidden hs-dark-mode group flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium text-defaulttextcolor  transition-all text-xs  dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  data-hs-theme-click-value="light"
                >
                  <i className="bx bx-sun header-link-icon"></i>
                </button>
              </div>

              {/* Full Screen Toggle */}
              <div className="header-element header-fullscreen py-[1rem] md:px-[0.65rem] px-2">
                <button
                  aria-label="anchor"
                  onClick={() => toggleFullscreen()}
                  className="inline-flex flex-shrink-0 justify-center items-center gap-2  !rounded-full font-medium dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                >
                  {isFullscreen ? (
                    <i className="bx bx-exit-fullscreen full-screen-close header-link-icon"></i>
                  ) : (
                    <i className="bx bx-fullscreen full-screen-open header-link-icon"></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <Modalsearch />
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  local_varaiable: state,
});
export default connect(mapStateToProps, { ThemeChanger })(Header);
