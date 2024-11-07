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
import moment from "moment";
import { useProtectedJpg } from "@/utils/protectedImage";
import { getImageUrl } from "@/utils/utils";
const Select = dynamic(() => import("react-select"), { ssr: false });

const FileDetail = ({
  handleToggleDetailsClose,
  isDetailsOpen,
  node,
  setSingleFileDetail,
}) => {
  const { data, is_loading } = useProtectedJpg(
    node?.thumbnail_url,
    "thumbnail"
  );
  return (
    <>
      <div className={`selected-file-details ${isDetailsOpen ? "open" : ""}`}>
        <div className="flex p-4 items-center justify-between border-b dark:border-defaultborder/10">
          <div>
            <h6 className="font-semibold mb-0 text-[1rem]">File Details</h6>
          </div>
          <div className="flex items-center">
            <div className="hs-dropdown ti-dropdown me-1">
              <button
                className="ti-btn ti-btn-sm ti-btn-primary"
                aria-label="button"
                type="button"
                aria-expanded="false"
              >
                <i className="ri-more-2-fill"></i>
              </button>
              <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                <li>
                  <Link
                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                    href="#!"
                    scroll={false}
                  >
                    Share
                  </Link>
                </li>
                <li>
                  <Link
                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                    href="#!"
                    scroll={false}
                  >
                    Copy
                  </Link>
                </li>
                <li>
                  <Link
                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                    href="#!"
                    scroll={false}
                  >
                    Move
                  </Link>
                </li>
                <li>
                  <Link
                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                    href="#!"
                    scroll={false}
                  >
                    Delete
                  </Link>
                </li>
                <li>
                  <Link
                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                    href="#!"
                    scroll={false}
                  >
                    Raname
                  </Link>
                </li>
              </ul>
            </div>
            <button
              onClick={handleToggleDetailsClose}
              aria-label="button"
              type="button"
              id="file-close-btn"
              className="ti-btn ti-btn-icon ti-btn-sm ti-btn-danger xl:hidden block"
            >
              <i className="ri-close-fill"></i>
            </button>
          </div>
        </div>
        {node && (
          <div
            className="filemanager-file-details overflow-scroll"
            id="filemanager-file-details"
          >
            <div className="p-4 text-center border-b border-dashed dark:border-defaultborder/10 ">
              <div className="file-details mb-4 !inline-flex folder-svg-container ">
                {node?.ctype === "folder" ? (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-primary"
                      data-name="Layer 1"
                      viewBox="0 0 24 24"
                    >
                      <path
                        opacity="1"
                        d="M19.97586,10V9a3,3,0,0,0-3-3H10.69678l-.31622-.94868A3,3,0,0,0,7.53451,3H3.97586a3,3,0,0,0-3,3V19a2,2,0,0,0,2,2H3.3067a2,2,0,0,0,1.96774-1.64223l1.40283-7.71554A2,2,0,0,1,8.645,10Z"
                      />
                      <path
                        opacity="0.3"
                        d="M22.02386,10H8.645a2,2,0,0,0-1.96777,1.64221L5.27441,19.35773A2,2,0,0,1,3.3067,21H19.55292a2,2,0,0,0,1.96771-1.64227l1.48712-8.17884A1,1,0,0,0,22.02386,10Z"
                      />
                    </svg>
                  </div>
                ) : (
                  <>
                    <div>{!is_loading && data}</div>
                  </>
                )}
              </div>
              <div>
                <p className="mb-0 font-semibold text-[1rem]">{node?.title}</p>
                <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[.625rem]">
                  {node?.ctype == "folder" ? (
                    <>{node.childrenCount} Files </>
                  ) : (
                    <>{(Number(node?.size ?? 0) / 1000).toFixed(2)} MB</>
                  )}{" "}
                  |{" "}
                  {moment
                    .utc(node?.createdAt)
                    .format("DD,MMM YYYY HH:mm")
                    .toString()}
                </p>
              </div>
            </div>
            <div className="p-4 border-b border-dashed dark:border-defaultborder/10">
              <ul className="list-group">
                {node?.ctype == "document" && (
                  <li className="list-group-item">
                    <div>
                      <span className="font-semibold">File Format : </span>
                      <span className="text-[.75rem] text-[#8c9097] dark:text-white/50">
                        <>
                          {node?.title
                            ?.split(".")
                            [node?.title?.split(".").length - 1].toUpperCase()}
                        </>
                      </span>
                    </div>
                  </li>
                )}
                <li className="list-group-item">
                  <div>
                    <p className="font-semibold mb-0">File Description : </p>
                    <span className="text-[.75rem] text-[#8c9097] dark:text-white/50">
                      This file contains 3 folder ynex.main &amp; ynex.premium
                      &amp; ynex.featured and 42 images and layout styles are
                      added in this update.
                    </span>
                  </div>
                </li>
                <li className="list-group-item">
                  <p className="font-semibold mb-0">File Location : </p>
                  <span className="text-[.75rem] text-[#8c9097] dark:text-white/50">
                    {node?.breadcrumb
                      ?.slice(0, -1)
                      ?.map((breadcrumb: any) => {
                        // Capitalize the first letter for 'home'
                        if (breadcrumb[1] === ".home") {
                          return "Home";
                        }
                        return breadcrumb[1];
                      })
                      .join(" > ")}
                  </span>
                </li>
              </ul>
            </div>
            {/* <div className="p-4 border-b border-dashed dark:border-defaultborder/10">
            <p className="mb-1 font-semibold text-[.875rem]">
              Downloaded from :
            </p>
            <Link
              className="text-primary font-semibold break-words"
              href="https://themeforest.net/user/spruko/portfolio"
              target="_blank"
              scroll={false}
            >
              <u>https://themeforest.net/user/spruko/portfolio</u>
            </Link>
          </div> */}

            {node?.visibility === "protected" && (
              <div className="p-4">
                <p className="mb-2 font-semibold text-[.875rem]">
                  Shared With :
                </p>
                {node?.sharedWithTeams?.map((team: any) => {
                  return (
                    <>
                      {team?.users?.map((user: any) => {
                        return (
                          <>
                            <div className="flex items-center p-2 mb-1">
                              <span className="avatar avatar-sm me-2">
                                {user?.photo ? (
                                  <img
                                    src={getImageUrl(user?.photo)}
                                    alt=""
                                    className="!rounded-md"
                                  />
                                ) : (
                                  <i className="ri-account-circle-line me-1 align-middle text-3xl"></i>
                                )}
                              </span>
                              <span className="font-semibold flex-grow dark:text-defaulttextcolor/70">
                                {user?.firstName ?? ""} {user?.lastName ?? ""}
                              </span>
                              <span className="badge bg-success/10 text-success font-normal">
                                {moment
                                  .utc(user?.createdAt)
                                  .format("DD,MMM YYYY HH:mm")
                                  .toString()}
                              </span>
                            </div>
                          </>
                        );
                      })}
                    </>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FileDetail;
