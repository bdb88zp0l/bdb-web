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
import moment from "moment";

const NodeView = ({
  item,
  setParentId,
  setSelectedDocumentId,
  setScreen,
  handleDeleteDocument,
  toggleFavourite,
  fetchNode,
  setSingleFileDetail, filter,
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
  console.log("data", data);

  return (
    <>
      <tr
        className={
          "border border-inherit border-solid border-x-0 hover:bg-gray-100 dark:border-defaultborder/10 dark:hover:bg-light"
        }
        // key={Math.random()}
        // onDoubleClick={(e) => {
        //   if (data.ctype === "document") {
        //     setSelectedDocumentId(data.id);
        //     setScreen("viewer");
        //   } else if (data.ctype === "folder") {
        //     setParentId(data.id);
        //     setScreen("explorer");
        //   }
        // }}
        // onClick={(e) => {
        //   e.preventDefault();
        //   setSingleFileDetail(item);
        // }}
      >
        <th scope="row">
          <div className="flex items-center">
            {data.ctype === "folder" ? (
              <div className="me-2">
                <span className="avatar avatar-xs">
                  <img
                    src="../../assets/images/media/file-manager/1.png"
                    alt=""
                  />
                </span>
              </div>
            ) : (
              <div className="transform scale-y-75 origin-top">
                <div className="">{protected_image.data}</div>
              </div>
            )}

            <div className="text-[.875rem] font-semibold mb-1 leading-none">
              <Link href="#!" scroll={false}>
                {item?.title}
              </Link>
            </div>
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
        </th>
        <td>
          {item.breadcrumb
            ?.slice(0, -1)
            ?.map((breadcrumb: any) => {
              // Capitalize the first letter for 'home'
              if (breadcrumb[1] === ".home") {
                return "Home";
              }
              return breadcrumb[1];
            })
            .join(" > ")}
        </td>
        <td>
          {item?.ctype == "folder" ? (
            <span className="text-[#8c9097] dark:text-white/50 text-[.75rem]">
              {data.childrenCount} files
            </span>
          ) : (
            <span className="text-default font-semibold">
              {(Number(item?.size ?? 0) / 1000).toFixed(2)} MB
            </span>
          )}
        </td>
        {filter == "recycleBin" ? (
          <>
            <td>
              {item.deletedBy?.firstName ?? ""}{" "}
              {item.deletedBy?.lastName ?? ""}
            </td>
            <td>
              {moment
                .utc(item.deletedAt)
                .format("DD MMM YYYY")
                .toString()}
            </td>
          </>
        ) : (
          <>
            <td>
              {moment
                .utc(item.createdAt)
                .format("DD MMM YYYY")
                .toString()}
            </td>
            <td>
              <div className="flex flex-row items-center !gap-2 text-[0.9375rem]">
                <Link
                  aria-label="anchor"
                  href="#!"
                  scroll={false}
                  className="ti-btn ti-btn-icon ti-btn-wave !rounded-full !border-info/10 !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-info/10 text-info hover:bg-info hover:text-white hover:border-info"
                  onClick={(e) => {
                    if (data.ctype === "document") {
                      setSelectedDocumentId(data.id);
                      setScreen("viewer");
                    } else if (data.ctype === "folder") {
                      setParentId(data.id);
                      setScreen("explorer");
                    }
                    e.preventDefault();
                    setSingleFileDetail(item);
                  }}
                >
                  <i className="ri-eye-line"></i>
                </Link>
                <Link
                  aria-label="anchor"
                  href="#!"
                  scroll={false}
                  className="ti-btn ti-btn-icon ti-btn-wave !rounded-full !border-info/10 !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-info/10 text-info hover:bg-info hover:text-white hover:border-info"
                  onClick={async (e) => {
                    e.preventDefault();

                    await toggleFavourite(item._id);
                    await fetchNode();
                  }}
                >
                  <i
                    className={`ri-heart-${item.isFavourited ? "fill" : "line"
                      }`}
                  ></i>
                </Link>

                {hasPermission("file_manager.delete") && (
                  <Link
                    aria-label="anchor"
                    href="#!"
                    scroll={false}
                    className="ti-btn ti-btn-icon ti-btn-wave !rounded-full !border-danger/10 !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-danger/10 text-danger hover:bg-danger hover:text-white hover:border-danger"
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
                    <i className="ri-delete-bin-line"></i>
                  </Link>
                )}

              </div>
            </td>
          </>
        )}
      </tr>
    </>
  );
};

export default NodeView;
