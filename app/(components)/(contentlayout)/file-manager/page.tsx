"use client";
import { userPrivateRequest } from "@/config/axios.config";
import Seo from "@/shared/layout-components/seo/seo";
import AddFileModal from "@/shared/page-components/file-manager/AddFileModal";
import AddFolderModal from "@/shared/page-components/file-manager/AddFolderModal";
import BreadCrumb from "@/shared/page-components/file-manager/BreadCrumb";
import FileDetail from "@/shared/page-components/file-manager/FileDetail";
import LeftSideBar from "@/shared/page-components/file-manager/LeftSideBar";
import NoFileFolder from "@/shared/page-components/file-manager/NoFileFolder";
import NodeView from "@/shared/page-components/file-manager/NodeView";
import UniversalFileListWithFilter from "@/shared/page-components/file-manager/common/UserversalFileListWithFilter";
import FileExplorer from "@/shared/page-components/file-manager/explorer/FileExplorer";
import SearchResults from "@/shared/page-components/file-manager/search/SearchResults";
import ShowDocument from "@/shared/page-components/file-manager/viewer/ShowDocument";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const Filemanager = () => {
  const [isFoldersOpen, setFoldersOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  const handleResize = () => {
    const windowWidth = window.innerWidth;
    // Handle folders and details visibility
    if (windowWidth <= 575) {
      setFoldersOpen(true);
      setDetailsOpen(false);
    } else if (windowWidth <= 1200) {
      setDetailsOpen(true);
    } else {
      setFoldersOpen(false);
      setDetailsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleToggleFolders = () => {
    if (window.innerWidth <= 575) {
      setFoldersOpen(true);
      setDetailsOpen(false);
    }
  };

  const handleToggleFoldersClose = () => {
    setFoldersOpen(false);
  };

  const handleToggleDetails = () => {
    if (window.innerWidth <= 1200) {
      setDetailsOpen(true);
    }
  };

  const handleToggleDetailsClose = () => {
    setDetailsOpen(false);
  };

  // Code by arafat

  const [search, setSearch] = useState<string>("");
  const [screen, setScreen] = useState("explorer"); //possible values: explorer, search, viewer,recent,favourite,recycleBin,shared
  const [filter, setFilter] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [workspaceHomeFolderId, setWorkspaceHomeFolderId] = useState(null);
  const [users, setUsers] = useState(null);
  const [serviceTypes, setServiceTypes] = useState(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<any>(null);
  const [singleFileDetail, setSingleFileDetail] = useState<any>(null);

  const fetchPageData = async () => {
    await userPrivateRequest.get("/api/file/pageData").then((response) => {
      const { home_folder_id, inbox_folder_id, users, dataByServiceType } =
        response.data?.data ?? {};

      setWorkspaceHomeFolderId(home_folder_id);
      setParentId((prevState) => {
        if (prevState) {
          return prevState;
        } else {
          return home_folder_id;
        }
      });
      setUsers(users);
      setServiceTypes(dataByServiceType);
    });
  };
  useEffect(() => {
    fetchPageData();
  }, []);

  const handleDeleteDocument = async (ids: string[], actionType = "soft") => {
    await userPrivateRequest
      .delete("/api/file/deleteNodes", { data: { ids, actionType } })
      .then((response) => {
        toast.success("Document deleted successfully");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      });
  };

  const toggleFavourite = async (id: string) => {
    await userPrivateRequest
      .get("/api/file/toggleFavourite/" + id)
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      });
  };

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // This effect will run when the query parameter is present in the URL
  useEffect(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    let id = nextSearchParams.get("id");
    let mode = nextSearchParams.get("mode");
    if (mode && id) {
      if (mode === "viewer") {
        setScreen("viewer");
        setSelectedDocumentId(id);
      } else if (mode === "explorer") {
        setScreen("explorer");
        setParentId(id);
      } else if (mode === "search") {
        setSearch(id);
        setScreen("search");
      }
      nextSearchParams.delete("mode");
      nextSearchParams.delete("id");
      router.replace(`${pathname}?${nextSearchParams}`);
    }
  }, [searchParams]);

  return (
    <Fragment>
      <Seo title={"File Manager"} />
      <div className="file-manager-container p-2 gap-2 sm:!flex !block text-defaulttextcolor text-defaultsize">
        <LeftSideBar
          isFoldersOpen={isFoldersOpen}
          handleToggleFolders={handleToggleFolders}
          setSearch={setSearch}
          setScreen={setScreen}
          setFilter={setFilter}
          setParentId={setParentId}
          workspaceHomeFolderId={workspaceHomeFolderId}
        />
        {screen == "explorer" && (
          <>
            <FileExplorer
              parentId={parentId}
              setParentId={setParentId}
              setScreen={setScreen}
              filter={filter}
              setSelectedDocumentId={setSelectedDocumentId}
              selectedDocumentId={selectedDocumentId}
              isFoldersOpen={isFoldersOpen}
              handleToggleFoldersClose={handleToggleFoldersClose}
              users={users}
              handleDeleteDocument={handleDeleteDocument}
              toggleFavourite={toggleFavourite}
              setSingleFileDetail={setSingleFileDetail}
              serviceTypes={serviceTypes}
              workspaceHomeFolderId={workspaceHomeFolderId}
            />
          </>
        )}
        {screen == "search" && (
          <SearchResults
            isFoldersOpen={isFoldersOpen}
            handleToggleDetails={handleToggleDetails}
            search={search}
            setScreen={setScreen}
            setSelectedDocumentId={setSelectedDocumentId}
            handleDeleteDocument={handleDeleteDocument}
            toggleFavourite={toggleFavourite}
            setSingleFileDetail={setSingleFileDetail}
          />
        )}
        {screen == "tableExplorer" && (
          <UniversalFileListWithFilter
            parentId={parentId}
            setParentId={setParentId}
            setScreen={setScreen}
            setSelectedDocumentId={setSelectedDocumentId}
            selectedDocumentId={selectedDocumentId}
            isFoldersOpen={isFoldersOpen}
            handleToggleFoldersClose={handleToggleFoldersClose}
            users={users}
            filter={filter}
            handleDeleteDocument={handleDeleteDocument}
            toggleFavourite={toggleFavourite}
            setSingleFileDetail={setSingleFileDetail}
          />
        )}
        {screen == "viewer" && (
          <div
            className={`file-manager-folders ${isFoldersOpen ? "open" : ""}`}
          >
            <div
              className="p-4 file-folders-container  overflow-scroll h-[100vh]"
              id="file-folders-container"
            >
              <ShowDocument
                documentId={selectedDocumentId}
                setParentId={setParentId}
                setScreen={setScreen}
                search={search}
              />
            </div>
          </div>
        )}
        <FileDetail
          handleToggleDetailsClose={handleToggleDetailsClose}
          isDetailsOpen={isDetailsOpen}
          setSingleFileDetail={setSingleFileDetail}
          node={singleFileDetail}
        />
      </div>
    </Fragment>
  );
};

export default Filemanager;
