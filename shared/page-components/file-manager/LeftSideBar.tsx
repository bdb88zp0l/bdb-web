/**
 * A reusable React component that renders a modal dialog.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the modal should be open or closed.
 * @param {function} props.close - A callback function to close the modal.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 * @returns {React.ReactElement} The rendered modal component.
 */
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
const Select = dynamic(() => import("react-select"), { ssr: false });

const LeftSideBar = ({
  isFoldersOpen,
  handleToggleFolders,
  setSearch,
  setScreen,
  setFilter,
  setParentId,
  workspaceHomeFolderId,
}) => {
  return (
    <>
      <div
        className={`file-manager-navigation ${isFoldersOpen ? "close" : ""}`}
      >
        <div className="flex items-center justify-between w-full p-4 border-b dark:border-defaultborder/10">
          <div>
            <h6 className="font-semibold mb-0 text-[1rem] text-defaulttextcolor">
              File Manager
            </h6>
          </div>
          <div className="hs-dropdown ti-dropdown">
            <button
              className="ti-btn ti-btn-sm ti-btn-primary"
              aria-label="button"
              type="button"
              aria-expanded="false"
            >
              <i className="ri-settings-3-line"></i>
            </button>
            <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
              <li>
                <Link
                  className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                  href="#!"
                  scroll={false}
                >
                  Hidden Files
                </Link>
              </li>
              <li>
                <Link
                  className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                  href="#!"
                  scroll={false}
                >
                  Another action
                </Link>
              </li>
              <li>
                <Link
                  className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                  href="#!"
                  scroll={false}
                >
                  Something else here
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="p-4 border-b dark:border-defaultborder/10">
          <div className="input-group">
            <input
              type="text"
              className="form-control !bg-light border-0 !rounded-s-sm"
              placeholder="Search Files"
              aria-describedby="button-addon2"
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  setSearch(e.currentTarget.value);
                  setScreen("search");
                }
              }}
            />
            <button
              aria-label="button"
              type="button"
              className="ti-btn ti-btn-light !rounded-s-none !mb-0"
              id="button-addon2"
            >
              <i className="ri-search-line text-[#8c9097] dark:text-white/50"></i>
            </button>
          </div>
        </div>
        <div>
          <PerfectScrollbar>
            <ul
              className="list-none files-main-nav"
              id="files-main-nav"
              onClick={handleToggleFolders}
            >
              <li className="active files-type">
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setScreen("explorer");
                    setFilter(null);
                    setParentId(workspaceHomeFolderId);
                  }}
                >
                  <div className="flex items-center">
                    <div className="me-2">
                      <i className="ri-folder-2-line text-[1rem]"></i>
                    </div>
                    <span className="flex-grow whitespace-nowrap">
                      My Files
                    </span>
                    <span className="badge bg-primary text-white">322</span>
                  </div>
                </a>
              </li>

              <li className="files-type">
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setScreen("explorer");
                    setFilter("cases");
                    setParentId(workspaceHomeFolderId);
                  }}
                >
                  <div className="flex items-center">
                    <div className="me-2">
                      <i className="ri-star-s-line text-[1rem]"></i>
                    </div>
                    <span className="flex-grow whitespace-nowrap">Cases</span>
                  </div>
                </a>
              </li>

              <li>
                <a href="#!">
                  <div className="flex items-center">
                    <div className="me-2">
                      <i className="ri-folder-line text-[1rem]"></i>
                    </div>
                    <span className="flex-grow whitespace-nowrap">
                      Templates
                    </span>
                  </div>
                </a>
              </li>

              <li className="files-type">
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setScreen("tableExplorer");
                    setFilter("shared");
                  }}
                >
                  <div className="flex items-center">
                    <div className="me-2">
                      <i className="ri-share-forward-line text-[1rem]"></i>
                    </div>
                    <span className="flex-grow whitespace-nowrap">
                      Shared Files
                    </span>
                  </div>
                </a>
              </li>

              <li className="files-type">
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setScreen("tableExplorer");
                    setFilter("recycleBin");
                  }}
                >
                  <div className="flex items-center">
                    <div className="me-2">
                      <i className="ri-delete-bin-line text-[1rem]"></i>
                    </div>
                    <span className="flex-grow whitespace-nowrap">
                      Recycle Bin
                    </span>
                  </div>
                </a>
              </li>

              {/* <li className="files-type">
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setScreen("recent");
                  }}
                >
                  <div className="flex items-center">
                    <div className="me-2">
                      <i className="ri-history-fill text-[1rem]"></i>
                    </div>
                    <span className="flex-grow whitespace-nowrap">
                      Recent Files
                    </span>
                  </div>
                </a>
              </li> */}

              <li>
                <a href="#!">
                  <div className="flex items-center">
                    <div className="me-2">
                      <i className="ri-questionnaire-line text-[1rem]"></i>
                    </div>
                    <span className="flex-grow whitespace-nowrap">
                      Help Center
                    </span>
                  </div>
                </a>
              </li>

              <li>
                <a href="#!">
                  <div className="flex items-center">
                    <div className="me-2">
                      <i className="ri-settings-3-line text-[1rem]"></i>
                    </div>
                    <span className="flex-grow whitespace-nowrap">
                      Settings
                    </span>
                  </div>
                </a>
              </li>

              <li className="mb-8">
                <a href="#!">
                  <div className="flex items-center">
                    <div className="me-2">
                      <i className="ri-logout-box-line text-[1rem]"></i>
                    </div>
                    <span className="flex-grow whitespace-nowrap">Log out</span>
                  </div>
                </a>
              </li>

              <li className="mb-8">
                <div className="text-[#8c9097] dark:text-white/50 mb-2">
                  <p className="mb-1">
                    <span className="font-bold text-[.875rem]"></span> Total
                    File Size: 420.01 GB
                  </p>
                  <p className="mb-1">
                    <span className="font-bold text-[.875rem]"></span> Total
                    Files: 4,201
                  </p>
                  <p className="text-[.75rem] mb-0"></p>
                </div>
                <div>
                  {" "}
                  <p className="text-[.75rem] mb-0">10% of 5 TB</p>
                </div>
                <div className="progress progress-xs">
                  <div
                    className="progress-bar !bg-info w-[58%]"
                    role="progressbar"
                    aria-valuenow={58}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </li>

              {/* 
              <li className="flex items-center justify-center">
                <div className="filemanager-upgrade-storage">
                  <span>
                    <img
                      src="../../assets/images/media/file-manager/2.png"
                      alt=""
                    />
                  </span>
                  <div className="text-defaulttextcolor">
                    <span className="text-[.9375rem] font-semibold">
                      Want to{" "}
                      <span className="font-bold text-success">
                        <u>Buy</u>
                      </span>{" "}
                      Storage?
                    </span>
                  </div>
                  <div className="mt-4 grid">
                    <button
                      type="button"
                      className="ti-btn ti-btn-primary-gradient"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </li>
*/}
            </ul>
          </PerfectScrollbar>
        </div>
      </div>
    </>
  );
};

export default LeftSideBar;
