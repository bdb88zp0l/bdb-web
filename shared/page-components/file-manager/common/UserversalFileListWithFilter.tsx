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
import { convertToUUID, hasPermission } from "@/utils/utils";
import BreadCrumb from "../BreadCrumb";
import AddFolderModal from "../AddFolderModal";
import AddFileModal from "../AddFileModal";
import NoFileFolder from "../NoFileFolder";
import NodeView from "../NodeView";
import moment from "moment";
const Select = dynamic(() => import("react-select"), { ssr: false });

const UniversalFileListWithFilter = ({
  parentId,
  setParentId,
  setScreen,
  setSelectedDocumentId,
  isFoldersOpen,
  handleToggleFoldersClose,
  users,
  filter,
  handleDeleteDocument,
  toggleFavourite,
}: any) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [nodeData, setNodeData] = useState<any>({});
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const fetchNode = async () => {
    setIsFetching(true);

    // parent id is ignored here
    userPrivateRequest
      .get(
        `/api/file/getPaginatedDocumentNodes/?page=${page}&limit=${limit}&filter=${filter}`
      )
      .then((response) => {
        let data = response.data?.data ?? {};
        if (data) {
          setNodeData(data);
        }
      })
      .catch((error) => {
        console.error(error.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    fetchNode();
  }, [parentId, page, limit, filter]);
  return (
    <>
      <div className={`file-manager-folders ${isFoldersOpen ? "open" : ""}`}>
        <div className="flex p-4 flex-wrap gap-2 items-center justify-between border-b dark:border-defaultborder/10">
          <div>
            <BreadCrumb
              breadcrumbs={nodeData?.folder_information?.breadcrumb ?? []}
              setParentId={setParentId}
              setScreen={setScreen}
            />
          </div>
          <div className="flex gap-2">
            <button
              aria-label="button"
              onClick={handleToggleFoldersClose}
              type="button"
              id="folders-close-btn"
              className="sm:hidden block btn btn-icon btn-sm btn-danger"
            >
              <i className="ri-close-fill"></i>
            </button>
            <AddFolderModal parentId={parentId} fetchNode={fetchNode} />

            <AddFileModal
              parentId={parentId}
              fetchNode={fetchNode}
              users={users}
            />
          </div>
        </div>
        <div
          className="p-4 file-folders-container  overflow-scroll"
          id="file-folders-container"
        >
          <div className="grid grid-cols-12 gap-6">
            {isFetching ? (
              <>
                <div className="col-span-12" key={Math.random()}>
                  <div className="flex justify-center mb-6">
                    <div className="ti-spinner" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              </>
            ) : nodeData?.items?.length <= 0 ? (
              <NoFileFolder />
            ) : (
              <div className="xl:col-span-12 col-span-12">
                <div className="table-responsive border border-bottom-0 dark:border-defaultborder/10">
                  <table className="table whitespace-nowrap table-hover min-w-full">
                    <thead>
                      <tr>
                        <th scope="col" className="text-start">
                          File Name
                        </th>
                        <th scope="col" className="text-start">
                          File Location
                        </th>
                        <th scope="col" className="text-start">
                          Size
                        </th>
                        {filter == "recycleBin" ? (
                          <>
                            <th scope="col" className="text-start">
                              Deleted By
                            </th>
                            <th scope="col" className="text-start">
                              Deleted At
                            </th>
                          </>
                        ) : (
                          <>
                            <th scope="col" className="text-start">
                              Date Created
                            </th>
                            <th scope="col" className="text-start">
                              Action
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="files-list">
                      {nodeData?.items?.map((item) => (
                        <tr
                          className={
                            "border border-inherit border-solid border-x-0 hover:bg-gray-100 dark:border-defaultborder/10 dark:hover:bg-light"
                          }
                          key={Math.random()}
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <th scope="row">
                            <div className="flex items-center">
                              <div className="me-2">
                                <span className="avatar avatar-xs">
                                  <img
                                    src="../../assets/images/media/file-manager/1.png"
                                    alt=""
                                  />
                                </span>
                              </div>
                              <div>{item.title}</div>
                            </div>
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
                            {(Number(item?.size ?? 0) / 1000).toFixed(2)} MB
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
                                  .format("DD,MMM YYYY HH:mm")
                                  .toString()}
                              </td>
                            </>
                          ) : (
                            <>
                              <td>
                                {moment
                                  .utc(item.createdAt)
                                  .format("DD,MMM YYYY")
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
                                      e.preventDefault();
                                      setScreen("viewer");
                                      setSelectedDocumentId(item.id);
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
                                      fetchNode();
                                    }}
                                  >
                                    <i
                                      className={`ri-heart-${
                                        item.isFavourited ? "fill" : "line"
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
                                          await handleDeleteDocument([item.id]);
                                          fetchNode();
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UniversalFileListWithFilter;
