"use client";

import { userPrivateRequest } from "@/config/axios.config";
import { useConfig } from "@/shared/providers/ConfigProvider";
import { hasPermission } from "@/utils/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import AddFileModal from "../AddFileModal";
import AddFolderModal from "../AddFolderModal";
import BreadCrumb from "../BreadCrumb";
import NodeView from "../NodeView";

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
  const [limit, setLimit] = useState(16);
  const [nodeData, setNodeData] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<any>([]);
  const [serviceType, setServiceType] = useState<any>(null);
  const [isFetchingNode, setIsFetchingNode] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const config = useConfig();

  const { ref: topRef, inView: topInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const { ref: bottomRef, inView: bottomInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const fetchNode = async (pageNumber: number, append: boolean = true) => {
    if (!parentId || isRequesting || !hasMore) return;

    setIsFetchingNode(true);
    setIsRequesting(true);

    try {
      const response = await userPrivateRequest.get(
        `/api/file/getPaginatedDocumentNodes/${
          !serviceType ? parentId : ""
        }?page=${pageNumber}&limit=${limit}${
          serviceType ? `&serviceType=${serviceType}` : ""
        }${filter ? `&filter=${filter}` : ""}`
      );

      const data = response.data?.data ?? null;
      if (data) {
        const fetchedItems = data.items ?? [];

        setNodeData((prev) => {
          if (append) {
            return [...prev, ...fetchedItems];
          } else {
            return [...fetchedItems, ...prev];
          }
        });

        setHasMore(fetchedItems.length === limit);

        if (!serviceType) {
          setBreadcrumbs(data?.folder_information?.breadcrumb ?? []);
        }
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsFetchingNode(false);
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    setNodeData([]); 
    setPage(1); 
    setHasMore(true); 
    fetchNode(1, true);
  }, [parentId, serviceType, filter]);

  const handlePageChange = (newPage: number, append: boolean) => {
    if (newPage < 1 || isRequesting || !hasMore) return;
    setPage(newPage);
    fetchNode(newPage, append);
  };

  useEffect(() => {
    if (bottomInView && hasMore && !isRequesting) {
      handlePageChange(page + 1, true);
    }
  }, [bottomInView]);

  useEffect(() => {
    if (topInView && page > 1 && !isRequesting) {
      handlePageChange(page - 1, false);
    }
  }, [topInView]);

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
          className="p-4 file-folders-container overflow-scroll"
          id="file-folders-container"
        >
          {workspaceHomeFolderId == parentId && serviceTypes?.length > 0 && (
            <div className="grid grid-cols-12 gap-x-6 mb-4">
              {serviceTypes?.map((item: any) => (
                <div
                  className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 col-span-12"
                  key={item.serviceType}
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
                              {(Number(item?.totalSize ?? 0) / 1000).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div ref={topRef} className="h-12"></div>

          <div className="grid grid-cols-12 gap-x-6 mb-4">
            {nodeData?.map((item: any) => (
              <NodeView
                key={item.id}
                item={item}
                setParentId={setParentId}
                setSelectedDocumentId={setSelectedDocumentId}
                setScreen={setScreen}
                handleDeleteDocument={handleDeleteDocument}
                toggleFavourite={toggleFavourite}
                setSingleFileDetail={setSingleFileDetail}
                fetchNode={fetchNode}
              />
            ))}
          </div>

          <div ref={bottomRef} className="h-12"></div>
        </div>
      </div>
    </>
  );
};

export default FileExplorer;