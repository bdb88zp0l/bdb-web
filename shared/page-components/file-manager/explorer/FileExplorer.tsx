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
import { useConfig } from "@/shared/providers/ConfigProvider";
const Select = dynamic(() => import("react-select"), { ssr: false });

const FileExplorer = ({
  parentId,
  setParentId,
  setScreen,
  setSelectedDocumentId,
  selectedDocumentId,
  filter,
  serviceTypes,
  isFoldersOpen,
  handleToggleFoldersClose,
  users,
  handleDeleteDocument,
  toggleFavourite,
  setSingleFileDetail,
  workspaceHomeFolderId,
}: any) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [nodeData, setNodeData] = useState<any>({});
  const [breadcrumbs, setBreadcrumbs] = useState<any>([]);
  const [serviceType, setServiceType] = useState<any>(null);
  const [isFetchingNode, setIsFetchingNode] = useState<boolean>(true);
  const config = useConfig();

  const fetchNode = async () => {
    console.log(serviceType, parentId);
    if (parentId) {
      setIsFetchingNode(true);
      userPrivateRequest
        .get(
          `/api/file/getPaginatedDocumentNodes/${
            !serviceType ? parentId : ""
          }?page=${page}&limit=${limit}${
            serviceType ? `&serviceType=${serviceType}` : ""
          }${filter ? `&filter=${filter}` : ""}`
        )
        .then((response) => {
          let data = response.data?.data ?? null;
          if (data) {
            setNodeData(data);
            if (!serviceType) {
              setBreadcrumbs(data?.folder_information?.breadcrumb ?? []);
            }
          }
        })
        .catch((error) => {
          console.error(error.message);
        })
        .finally(() => {
          setIsFetchingNode(false);
        });
    }
  };

  useEffect(() => {
    fetchNode();
  }, [parentId, page, limit, serviceType, filter]);
  return (
    <>
      <div className={`file-manager-folders ${isFoldersOpen ? "open" : ""}`}>
        <div className="flex p-4 flex-wrap gap-2 items-center justify-between border-b dark:border-defaultborder/10">
          <div>
            <BreadCrumb
              breadcrumbs={breadcrumbs}
              setParentId={setParentId}
              setScreen={setScreen}
              setServiceType={setServiceType}
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
            {hasPermission("file_manager.upload") && (
              <AddFolderModal parentId={parentId} fetchNode={fetchNode} />
            )}
            {hasPermission("file_manager.createFolder") && (
              <AddFileModal
                parentId={parentId}
                fetchNode={fetchNode}
                users={users}
              />
            )}
          </div>
        </div>
        <div
          className="p-4 file-folders-container  overflow-scroll"
          id="file-folders-container"
        >
          {workspaceHomeFolderId == parentId && serviceTypes?.length > 0 && (
            <>
              <div className="flex mb-4 items-center justify-between">
                <p className="mb-0 font-semibold text-[.875rem]">
                  Service Type
                </p>
              </div>
              <div className="grid grid-cols-12 gap-x-6 mb-4">
                {serviceTypes?.map((item: any) => (
                  <div
                    className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 col-span-12"
                    key={Math.random()}
                    onDoubleClick={() => {
                      setScreen("explorer");
                      setServiceType(item?.serviceType);
                    }}
                  >
                    <div className="box shadow-none !bg-light">
                      <div className="box-body !p-4">
                        <Link href="#!" scroll={false}>
                          <div className="flex justify-between flex-wrap">
                            <div className="file-format-icon">{/*  */}</div>
                            <div>
                              <span className="font-semibold mb-1">
                                {item?.serviceType}
                              </span>
                              <span className="text-[.625rem] block text-[#8c9097] dark:text-white/50 text-end">
                                {(Number(item?.totalSize ?? 0) / 1000).toFixed(
                                  2
                                )}{" "}
                                MB
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="grid grid-cols-12 gap-x-6 mb-4">
            {isFetchingNode ? (
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
              nodeData?.items?.map((item: any) => (
                <NodeView
                  item={item}
                  setParentId={setParentId}
                  setSelectedDocumentId={setSelectedDocumentId}
                  setScreen={setScreen}
                  handleDeleteDocument={handleDeleteDocument}
                  toggleFavourite={toggleFavourite}
                  setSingleFileDetail={setSingleFileDetail}
                  fetchNode={fetchNode}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FileExplorer;
