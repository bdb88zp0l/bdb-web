import React, { useEffect, useState } from "react";
// import Action from "./Action";
import ThumbnailPanel from "./ThumbnailPanel";
import PagePanel from "./PagePanel";
import { userPrivateRequest } from "@/config/axios.config";
import BreadCrumb from "../BreadCrumb";
import { toast } from "react-toastify";
const ShowDocument = ({ documentId, setParentId, setScreen, search }) => {
  const [showThumbnail, setShowThumbnail] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [documentData, setDocumentData] = useState<any>({});
  const [currentVersion, setCurrentVersion] = useState<any>({});

  const toggleThumbnail = () => {
    setShowThumbnail((toggole) => !toggole);
  };

  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const fetchDocumentInformation = (documentId: string) => {
    setIsFetching(true);
    userPrivateRequest
      .get(`/api/file/getDocumentInfo/${documentId}`)
      .then((response) => {
        let responseData = response.data?.data ?? {};
        setDocumentData(responseData);
        setCurrentVersion(
          responseData?.versions?.length > 0
            ? responseData.versions[responseData?.versions?.length - 1]
            : {}
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data?.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };
  useEffect(() => {
    if (documentId) {
      fetchDocumentInformation(documentId);
    }
  }, [documentId]);
  return (
    <>
      <BreadCrumb
        breadcrumbs={documentData?.breadcrumb ?? []}
        setParentId={setParentId}
        setScreen={setScreen}
      />
      <div className="pt-2 flex">
        <ThumbnailPanel
          showThumbnail={showThumbnail}
          setSelectedThumbnail={setSelectedThumbnail}
          data={currentVersion}
        />
        <PagePanel
          toggleThumbnail={toggleThumbnail}
          selectedThumbnail={selectedThumbnail}
          data={currentVersion}
          search={search}
        />
      </div>
    </>
  );
};

export default ShowDocument;
