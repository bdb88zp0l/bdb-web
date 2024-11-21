"use client";
import { userPrivateRequest } from "@/config/axios.config";
import Pagination from "@/shared/common-components/Pagination";
import SortBy from "@/shared/common-components/SortBy";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import {
  convertToPlainTextAndShorten,
  getImageUrl,
  hasPermission,
  toWordUpperCase,
} from "@/utils/utils";
import moment from "moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
const Select = dynamic(() => import("react-select"), { ssr: false });

const CaseList = () => {
  const [pageData, setPageData] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [temporaryKeyword, setTemporaryKeyword] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>({});

  const handleDelete = (id: number) => {
    userPrivateRequest
      .delete(`/api/cases/${id}`)
      .then((res) => {
        toast.success("User deleted successfully");
        fetchCases();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  const fetchCases = async () => {
    setIsFetching(true);
    const res = await userPrivateRequest
      .get(
        `/api/cases?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      )
      .then((res) => {
        setData(res.data?.data ?? {});
      })
      .finally(() => {
        setIsFetching(false);
      });
  };
  const fetchPageData = async () => {
    const res = await userPrivateRequest.get("/api/cases/data/get");
    setPageData(res.data.data ?? {});
  };
  useEffect(() => {
    fetchPageData();
  }, []);
  useEffect(() => {
    fetchCases();
  }, [page, limit, search, sortBy, sortOrder]);

  return (
    <Fragment>
      <Seo title={"Case Management"} />
      <Pageheader
        currentpage="Case Management"
        activepage="Admin"
        mainpage="Case Management"
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header flex items-center justify-between flex-wrap gap-4">
              <div className="flex" role="search">
                <input
                  className="form-control me-2 h-[36.47px]"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  value={temporaryKeyword}
                  onChange={(e) => {
                    setTemporaryKeyword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearch(temporaryKeyword);
                    }
                  }}
                />
                <button
                  className="ti-btn ti-btn-light !mb-0 h-[36.47px]"
                  type="submit"
                  onClick={() => {
                    setSearch(temporaryKeyword);
                    setPage(1);
                  }}
                >
                  Search
                </button>
                <button
                  className="text-info !py-1 !px-4 !text-[0.75rem] !m-0 h-[36.47px] content-center text-nowrap"
                  onClick={(e) => {
                    e.preventDefault();
                    setTemporaryKeyword(""); // Clear the temporary keyword
                    setSearch(""); // Clear the search results
                    setPage(1);
                  }}
                >
                  Clear Search Results
                </button>
              </div>

              <div className="flexflex-wrap gap-2">
                {hasPermission("case.create") && (
                  <Link
                    href="/cases/create"
                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem] me-2"
                  >
                    <i className="ri-add-line font-semibold align-middle"></i>
                    New Case
                  </Link>
                )}
                <button
                  type="button"
                  className="ti-btn ti-btn-success !py-1 !px-2 !text-[0.75rem] me-2"
                >
                  Export as XLSX
                </button>
                <SortBy
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  options={[
                    {
                      label: "Title",
                      value: "title",
                    },
                    {
                      label: "Case Number",
                      value: "caseNumber",
                    },
                    {
                      label: "Client",
                      value: "client.companyName",
                    },
                    {
                      label: "Contact Person",
                      value: "client.contact.firstName",
                    },
                    {
                      label: "Latest",
                      value: "createdAt",
                    },
                  ]}
                  onChange={(field: string, sortOrder: string) => {
                    setSortBy(field);
                    setSortOrder(sortOrder);
                    setPage(1);
                  }}
                />
              </div>
            </div>
            <div className="box-body !p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead>
                    <tr>
                      <th scope="col" className="text-start">
                        Case Title
                      </th>
                      <th scope="col" className="text-start">
                        Case Number
                      </th>
                      <th scope="col" className="text-start">
                        Client
                      </th>
                      <th scope="col" className="text-start">
                        Contact Person
                      </th>
                      <th scope="col" className="text-start">
                        Members
                      </th>
                      <th scope="col" className="text-start"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFetching && (
                      <td colSpan={7}>
                        <div className="flex justify-center mb-6">
                          <div className="ti-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      </td>
                    )}
                    {!isFetching &&
                      data?.docs?.map((item: any) => (
                        <tr
                          className="border border-defaultborder crm-contact"
                          key={Math.random()}
                        >
                          <td>
                            <div className="flex items-center gap-2">
                              <div>
                                <Link href={`/cases/overview/${item._id}`}>
                                  <span className="block font-semibold">
                                    {item?.title ?? ""}
                                  </span>
                                </Link>
                                <span
                                  className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem]"
                                  title="Created at"
                                >
                                  {item?.createdAt}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>{item.caseNumber ?? " "}</td>
                          <td>{item.clientData?.companyName ?? " "}</td>
                          <td>
                            {item.clientData?.contact?.firstName ?? " "}{" "}
                            {item.clientData?.contact?.lastName ?? " "}
                          </td>
                          <td>
                            <div className="avatar-list-stacked flex">
                              {item?.team?.users?.map(
                                (
                                  user: {
                                    photo: any;
                                    firstName: any;
                                    lastName: any;
                                  },
                                  index: number
                                ) => (
                                  <div key={index} className="relative group">
                                    <span className="avatar avatar-sm avatar-rounded">
                                      {getImageUrl(user?.photo) ? (
                                        <img
                                          src={`  ${getImageUrl(user?.photo)}`}
                                          alt=""
                                        />
                                      ) : (
                                        <i className="ri-account-circle-line me-1 align-middle text-3xl  text-[#8c9097]"></i>
                                      )}
                                    </span>

                                    {/* Tooltip */}
                                    {user?.firstName && (
                                      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 z-10">
                                        {`${user?.firstName ?? ""} ${
                                          user?.lastName ?? ""
                                        }`}
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                              {item?.members?.map(
                                (
                                  user: {
                                    photo: any;
                                    firstName: any;
                                    lastName: any;
                                  },
                                  index: number
                                ) => (
                                  <div key={index} className="relative group">
                                    <span className="avatar avatar-sm avatar-rounded">
                                      {getImageUrl(user?.photo) ? (
                                        <img
                                          src={`  ${getImageUrl(user?.photo)}`}
                                          alt=""
                                        />
                                      ) : (
                                        <i className="ri-account-circle-line me-1 align-middle text-3xl  text-[#8c9097]"></i>
                                      )}
                                    </span>

                                    {/* Tooltip */}
                                    {user?.firstName && (
                                      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 z-10">
                                        {`${user?.firstName ?? ""} ${
                                          user?.lastName ?? ""
                                        }`}
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="btn-list">
                              {" "}
                              {hasPermission("case.read") && (
                                <Link
                                  // href={`/cases/edit/${item._id}`}
                                  href={`/cases/overview/${item._id}`}
                                  className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon  me-2"
                                >
                                  <i className="ri-pencil-line"></i>
                                </Link>
                              )}{" "}
                              {/* <Link
                                href={`/cases/overview/${item._id}`}
                                className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon  me-2"
                              >
                                <i className="ri-pencil-line"></i>
                              </Link> */}
                              {hasPermission("case.delete") && (
                                <button
                                  aria-label="button"
                                  type="button"
                                  className="ti-btn ti-btn-sm ti-btn-danger ti-btn-icon contact-delete"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this item?"
                                      )
                                    ) {
                                      handleDelete(item?._id);
                                    }
                                  }}
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              limit={limit}
              page={page}
              totalRow={data?.totalDocs ?? 0}
              handlePageChange={(
                limit: number,
                newOffset: number,
                page: number
              ) => {
                setPage(page);
              }}
              handleLimitChange={(updatedLimit: number) => {
                setLimit(updatedLimit);
              }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CaseList;
