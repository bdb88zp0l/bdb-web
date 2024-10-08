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
import { useProtectedJpg } from "@/utils/protectedImage";
import { hasPermission } from "@/utils/utils";
const Select = dynamic(() => import("react-select"), { ssr: false });
import Pusher from "pusher-js";

const NodeView = ({
  item,
  setParentId,
  setSelectedDocumentId,
  setScreen,
  handleDeleteDocument,
  toggleFavourite,
  fetchNode,
  setSingleFileDetail,
}: any) => {
  const [data, setData] = useState(item);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const protected_image = useProtectedJpg(item.thumbnail_url, "thumbnail");

  useEffect(() => {
    setData(item);
  }, [item]);

  useEffect(() => {
    if (data?.nodeType == "document" && data?.ocr_status != "SUCCESS") {
      console.log("pusher listening for the: " + data._id);
      // Initialize Pusher
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      });

      // Subscribe to the user's channel
      const channel = pusher.subscribe(`ocr_status_${data._id}`);

      channel.bind("update_ocr_status", (status: any) => {
        console.log("status", status);
        setData({ ...data, ocr_status: status });
      });

      // Cleanup when component unmounts
      return () => {
        pusher.unsubscribe(`ocr_status_${data._id}`);
      };
    }
  }, [data]);
  console.log("data",data)

  return (
    <>
      <div
        className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 col-span-12"
        key={Math.random()}
        onDoubleClick={(e) => {
          if (data.ctype === "document") {
            setSelectedDocumentId(data.id);
            setScreen("viewer");
          } else if (data.ctype === "folder") {
            setParentId(data.id);
            setScreen("explorer");
          }
        }}
        onClick={(e) => {
          e.preventDefault();
          setSingleFileDetail(item);
        }}
      >
        <div className="box border dark:border-defaultborder/10  !shadow-none">
          <div className={`box-body bg-primary/10`}>
            <div className="mb-4 folder-svg-container flex flex-wrap justify-between items-start">
              {data.ctype === "folder" ? (
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
                  <div>{protected_image.data}</div>
                </>
              )}
              <div>
                <div className="hs-dropdown ti-dropdown ltr:[--placement:left-top] rtl:[--placement:right-top]">
                  <button
                    className={`ti-btn ti-btn-sm ti-btn-primary`}
                    aria-label="button"
                    type="button"
                    aria-expanded={isDropdownOpen}
                    onClick={toggleDropdown}
                  >
                    <i className="ri-more-2-fill"></i>
                  </button>

                  {/* Dynamically show/hide the dropdown */}
                  <ul
                    className={`ti-dropdown-menu ${
                      isDropdownOpen ? "block" : "hidden"
                    } fixed bg-dropdown bg-white`}
                    style={{
                      zIndex: 99,
                      opacity: 1,
                      marginTop: "2rem",
                    }}
                  >
                    {hasPermission("file_manager.delete") && (
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                          href="#!"
                          scroll={false}
                          onClick={async (e) => {
                            e.preventDefault();
                            if (
                              window.confirm(
                                "Are you sure you want to delete this item?"
                              )
                            ) {
                              await handleDeleteDocument([data.id], "soft");
                              await fetchNode();
                            }
                          }}
                        >
                          Delete
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                        href="#!"
                        scroll={false}
                        onClick={async (e) => {
                          e.preventDefault();
                          await toggleFavourite(data._id);
                          await fetchNode();
                        }}
                      >
                        {item?.isFavourited ? "Unfavourite" : "Favourite"}
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                        href="#!"
                        scroll={false}
                      >
                        Rename
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium"
                        href="#!"
                        scroll={false}
                      >
                        Hide Folder
                      </Link>
                    </li> */}
                  </ul>
                </div>

                {data.ctype == "document" && (
                  <>
                    {data?.ocr_status === "UNKNOWN" ? (
                      <div style={{ width: "10px" }}>
                        <div key={data._id} className="relative group">
                          <div
                            className="ti-spinner text-warning"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 z-10">
                            OCR is Processing
                          </div>
                        </div>
                      </div>
                    ) : data.ocr_status == "SUCCESS" ? (
                      <div style={{ width: "10px" }}>
                        <div key={data._id} className="relative group">
                          <div className=" text-warning" role="status">
                            <i
                              className="ri-checkbox-circle-fill"
                              style={{ fontSize: "30px" }}
                            ></i>
                          </div>
                          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 z-10">
                            OCR Processed
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: "10px" }}>
                        <div key={data._id} className="relative group">
                          <div className=" text-danger" role="status">
                            <i
                              className="ri-error-warning-fill"
                              style={{ fontSize: "30px" }}
                            ></i>
                          </div>
                          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 z-10">
                            OCR Processing Failed
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <p className="text-[.875rem] font-semibold mb-1 leading-none">
              <Link href="#!" scroll={false}>
                {item?.title}
              </Link>
            </p>
            <div className="flex items-center justify-between flex-wrap">
              {item?.ctype == "folder" ? (
                <div>
                  <span className="text-[#8c9097] dark:text-white/50 text-[.75rem]">
                    {data.childrenCount} files
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-default font-semibold">
                    {(Number(item?.size ?? 0) / 1000).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeView;
