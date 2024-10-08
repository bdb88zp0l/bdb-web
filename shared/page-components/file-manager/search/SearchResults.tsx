import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
const Select = dynamic(() => import("react-select"), { ssr: false });
import { Recentdata } from "@/shared/data/pages/filemanager/filemanagerdata";
import { userPrivateRequest } from "@/config/axios.config";
import { toast } from "react-toastify";
import NoFileFolder from "../NoFileFolder";

const SearchResults = ({
  isFoldersOpen,
  handleToggleDetails,
  search,
  setSelectedDocumentId,
  setScreen,
  handleDeleteDocument,
  toggleFavourite,
}: any) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const fetchSearchResult = async (keyword: string) => {
    setIsSearching(true);
    userPrivateRequest
      .get(`/api/file/search?q=${keyword}`)
      .then((response) => {
        let documentMap: any = {}; // Object to hold unique documents by document_id
        let results = response.data?.data ?? [];

        // Loop through all results to group by document_id and gather page_numbers
        results.forEach((item: any) => {
          if (!documentMap[item.document_id]) {
            // If the document_id is not already added, initialize the object
            documentMap[item.document_id] = {
              ...item,
              page_numbers: [item.page_number], // Start with the first page_number
            };
          } else {
            // If document_id already exists, just push the page_number
            documentMap[item.document_id].page_numbers.push(item.page_number);
          }
        });

        // Convert documentMap back to an array
        const formattedResults = Object.values(documentMap);

        setSearchResult(formattedResults); // Update the search result state
      })
      .catch((error) => {
        toast.error(error.response.data?.message);
        console.log("error", error.message);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  useEffect(() => {
    if (search) {
      fetchSearchResult(search);
    }
  }, [search]);

  console.log(searchResult);
  return (
    <>
      <div className={`file-manager-folders ${isFoldersOpen ? "open" : ""}`}>
        <div
          className="p-4 file-folders-container  overflow-scroll"
          id="file-folders-container"
        >
          <div className="flex mb-4 items-center justify-between">
            <p className="mb-0 font-semibold text-[.875rem]">
              Search results for: {search}
            </p>
          </div>
          <div className="grid grid-cols-12 gap-6">
            {isSearching ? (
              <>
                <div className="col-span-12" key={Math.random()}>
                  <div className="flex justify-center mb-6">
                    <div className="ti-spinner" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              </>
            ) : searchResult?.length <= 0 ? (
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
                        {/* <th scope="col" className="text-start">
                          Size
                        </th>
                        <th scope="col" className="text-start">
                          Date Modified
                        </th> */}
                        <th scope="col" className="text-start">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="files-list">
                      {searchResult?.map((item) => (
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
                            {/* {item.breadcrumb?.length > 0
                              ? item.breadcrumb[item.breadcrumb.length - 2][1]
                              : ""} */}

                            {item.breadcrumb
                              ?.slice(0, -1)
                              ?.map((item: any) => {
                                // Capitalize the first letter for 'home'
                                if (item[1] === ".home") {
                                  return "Home";
                                }
                                return item[1];
                              })
                              .join(" > ")}
                          </td>
                          {/*<td>{idx.text3}</td>
                          <td>{idx.text4}</td> */}
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
                                  setSelectedDocumentId(item.document_id);
                                }}
                              >
                                <i className="ri-eye-line"></i>
                              </Link>
                            </div>
                          </td>
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

export default SearchResults;
